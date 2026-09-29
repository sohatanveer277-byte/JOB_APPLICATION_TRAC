import express from 'express';
import db from './db.js';

const router = express.Router();

// Helper: Parse numerical salary from string if needed
function parseSalaryNumbers(salaryEstimate, salaryMin, salaryMax) {
  let min = Number(salaryMin) || 0;
  let max = Number(salaryMax) || 0;

  if ((!min || !max) && salaryEstimate) {
    // Extract numbers like $150k or 150000 or $150,000 - $180,000
    const numbers = salaryEstimate.replace(/,/g, '').match(/\d+(\.\d+)?/g);
    if (numbers && numbers.length > 0) {
      let n1 = parseFloat(numbers[0]);
      let n2 = numbers.length > 1 ? parseFloat(numbers[1]) : n1;

      // if written in thousands e.g. "150k"
      if (salaryEstimate.toLowerCase().includes('k') && n1 < 1000) {
        n1 *= 1000;
        n2 *= 1000;
      }
      if (!min) min = Math.round(n1);
      if (!max) max = Math.round(n2);
    }
  }

  return { min, max };
}

// GET /api/applications - list all with filtering and search
router.get('/applications', (req, res) => {
  try {
    const { status, search, sort = 'newest' } = req.query;

    let query = 'SELECT * FROM applications WHERE 1=1';
    const params = [];

    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search && search.trim() !== '') {
      query += ' AND (company_name LIKE ? OR role LIKE ? OR notes LIKE ? OR location LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    if (sort === 'newest') {
      query += ' ORDER BY id DESC';
    } else if (sort === 'oldest') {
      query += ' ORDER BY id ASC';
    } else if (sort === 'interview_soonest') {
      query += ' ORDER BY CASE WHEN interview_date IS NULL THEN 1 ELSE 0 END, interview_date ASC';
    } else if (sort === 'salary_high') {
      query += ' ORDER BY salary_max DESC, salary_min DESC';
    } else if (sort === 'company') {
      query += ' ORDER BY company_name ASC';
    } else {
      query += ' ORDER BY id DESC';
    }

    const applications = db.prepare(query).all(...params);
    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/applications/:id - get single
router.get('/applications/:id', (req, res) => {
  try {
    const app = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id);
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.json({ success: true, data: app });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/applications - create application
router.post('/applications', (req, res) => {
  try {
    const {
      company_name,
      role,
      status = 'Bookmarked',
      salary_min,
      salary_max,
      salary_estimate = '',
      location = 'Remote',
      work_mode = 'Remote',
      job_url = '',
      interview_date = null,
      interview_round = '',
      notes = ''
    } = req.body;

    if (!company_name || !role) {
      return res.status(400).json({
        success: false,
        message: 'company_name and role are required fields'
      });
    }

    const { min, max } = parseSalaryNumbers(salary_estimate, salary_min, salary_max);

    const stmt = db.prepare(`
      INSERT INTO applications (
        company_name, role, status, salary_min, salary_max, salary_estimate,
        location, work_mode, job_url, interview_date, interview_round, notes, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    const result = stmt.run(
      company_name.trim(),
      role.trim(),
      status,
      min,
      max,
      salary_estimate || (min && max ? `$${Math.round(min / 1000)}k - $${Math.round(max / 1000)}k` : ''),
      location,
      work_mode,
      job_url,
      interview_date || null,
      interview_round,
      notes
    );

    const newApp = db.prepare('SELECT * FROM applications WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: newApp });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/applications/:id - update full application
router.put('/applications/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM applications WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const {
      company_name,
      role,
      status,
      salary_min,
      salary_max,
      salary_estimate,
      location,
      work_mode,
      job_url,
      interview_date,
      interview_round,
      notes
    } = req.body;

    const { min, max } = parseSalaryNumbers(
      salary_estimate ?? existing.salary_estimate,
      salary_min ?? existing.salary_min,
      salary_max ?? existing.salary_max
    );

    const stmt = db.prepare(`
      UPDATE applications SET
        company_name = ?,
        role = ?,
        status = ?,
        salary_min = ?,
        salary_max = ?,
        salary_estimate = ?,
        location = ?,
        work_mode = ?,
        job_url = ?,
        interview_date = ?,
        interview_round = ?,
        notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      company_name ?? existing.company_name,
      role ?? existing.role,
      status ?? existing.status,
      min,
      max,
      salary_estimate ?? existing.salary_estimate,
      location ?? existing.location,
      work_mode ?? existing.work_mode,
      job_url ?? existing.job_url,
      interview_date !== undefined ? interview_date : existing.interview_date,
      interview_round ?? existing.interview_round,
      notes ?? existing.notes,
      id
    );

    const updated = db.prepare('SELECT * FROM applications WHERE id = ?').get(id);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/applications/:id/status - quickly update pipeline stage
router.patch('/applications/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Bookmarked', 'Applied', 'Interviewing', 'Offered', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const stmt = db.prepare(`
      UPDATE applications 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    const result = stmt.run(status, id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const updated = db.prepare('SELECT * FROM applications WHERE id = ?').get(id);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/applications/:id
router.delete('/applications/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM applications WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/stats - aggregate salary insights, status breakdown, and upcoming interviews
router.get('/stats', (req, res) => {
  try {
    // Total and by status
    const all = db.prepare('SELECT * FROM applications').all();
    const statusCounts = {
      Bookmarked: 0,
      Applied: 0,
      Interviewing: 0,
      Offered: 0,
      Rejected: 0
    };

    all.forEach(app => {
      if (statusCounts[app.status] !== undefined) {
        statusCounts[app.status]++;
      }
    });

    // Salary stats: filter applications that have valid salary_max > 0 or salary_min > 0
    const appsWithSalary = all.filter(a => (a.salary_max > 0 || a.salary_min > 0));
    let salaryMin = 0;
    let salaryMax = 0;
    let salaryAvg = 0;

    if (appsWithSalary.length > 0) {
      const mins = appsWithSalary.map(a => a.salary_min || a.salary_max).filter(n => n > 0);
      const maxs = appsWithSalary.map(a => a.salary_max || a.salary_min).filter(n => n > 0);

      salaryMin = Math.min(...mins);
      salaryMax = Math.max(...maxs);

      const sumAvgs = appsWithSalary.reduce((acc, a) => {
        const mid = ((a.salary_min || a.salary_max) + (a.salary_max || a.salary_min)) / 2;
        return acc + mid;
      }, 0);
      salaryAvg = Math.round(sumAvgs / appsWithSalary.length);
    }

    // Upcoming interviews: where interview_date is set and not empty, sorted chronologically
    const upcomingInterviews = all
      .filter(a => a.interview_date && a.interview_date.trim() !== '')
      .map(a => {
        const interviewTime = new Date(a.interview_date).getTime();
        const nowTime = new Date().getTime();
        const diffMs = interviewTime - nowTime;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return {
          id: a.id,
          company_name: a.company_name,
          role: a.role,
          interview_date: a.interview_date,
          interview_round: a.interview_round || 'Interview Round',
          status: a.status,
          days_until: diffDays
        };
      })
      .sort((a, b) => new Date(a.interview_date) - new Date(b.interview_date));

    res.json({
      success: true,
      stats: {
        total: all.length,
        activePipeline: statusCounts.Applied + statusCounts.Interviewing + statusCounts.Offered,
        statusCounts,
        salary: {
          min: salaryMin,
          max: salaryMax,
          avg: salaryAvg,
          trackedCount: appsWithSalary.length
        },
        upcomingInterviews
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
