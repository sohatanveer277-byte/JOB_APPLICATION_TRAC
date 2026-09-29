import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../applications.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency and performance
db.pragma('journal_mode = WAL');

// Initialize database schema
export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Bookmarked',
      salary_min INTEGER DEFAULT 0,
      salary_max INTEGER DEFAULT 0,
      salary_estimate TEXT DEFAULT '',
      location TEXT DEFAULT 'Remote',
      work_mode TEXT DEFAULT 'Remote',
      job_url TEXT DEFAULT '',
      interview_date TEXT DEFAULT NULL,
      interview_round TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed sample data if table is completely empty
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM applications');
  const { count } = countStmt.get();

  if (count === 0) {
    const insertStmt = db.prepare(`
      INSERT INTO applications (
        company_name, role, status, salary_min, salary_max, salary_estimate, 
        location, work_mode, job_url, interview_date, interview_round, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Dynamically calculate realistic upcoming dates relative to today
    const now = new Date();
    const inTwoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const inFiveDays = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    const inTenDays = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

    const seedData = [
      [
        'Linear',
        'Product Engineer',
        'Interviewing',
        170000,
        210000,
        '$170k - $210k',
        'San Francisco, CA',
        'Remote',
        'https://linear.app/careers',
        inTwoDays.toISOString().slice(0, 16),
        'Technical Architecture Round',
        'Review real-time sync engine, WebSocket protocols, and keyboard shortcuts ergonomics.'
      ],
      [
        'Stripe',
        'Full Stack Engineer',
        'Interviewing',
        180000,
        220000,
        '$180k - $220k',
        'Seattle, WA',
        'Hybrid',
        'https://stripe.com/jobs',
        inFiveDays.toISOString().slice(0, 16),
        'System Design & API Usability',
        'Discuss idempotent transactions, webhook retry strategies, and rate limiting patterns.'
      ],
      [
        'Vercel',
        'Senior Frontend Engineer',
        'Offered',
        165000,
        195000,
        '$165k - $195k',
        'New York, NY',
        'Remote',
        'https://vercel.com/careers',
        null,
        'Offer Negotiation',
        'Received written offer. Competitive equity grant + $5,000 WFH home office budget.'
      ],
      [
        'Supabase',
        'Developer Advocate / Engineer',
        'Applied',
        145000,
        175000,
        '$145k - $175k',
        'Singapore / Global',
        'Remote',
        'https://supabase.com/careers',
        null,
        'Application Submitted',
        'Applied with portfolio link and PostgreSQL open-source contributions.'
      ],
      [
        'GitHub',
        'Staff Software Engineer',
        'Applied',
        190000,
        230000,
        '$190k - $230k',
        'San Francisco, CA',
        'Remote',
        'https://github.com/about/careers',
        inTenDays.toISOString().slice(0, 16),
        'Recruiter Initial Screen',
        'Internal employee referral submitted via former colleague.'
      ],
      [
        'Datadog',
        'Cloud Infrastructure Engineer',
        'Bookmarked',
        155000,
        185000,
        '$155k - $185k',
        'Boston, MA',
        'Hybrid',
        'https://careers.datadoghq.com',
        null,
        '',
        'Role focuses on distributed tracing and eBPF kernel telemetry.'
      ],
      [
        'Figma',
        'UI Systems Engineer',
        'Rejected',
        170000,
        200000,
        '$170k - $200k',
        'San Francisco, CA',
        'Hybrid',
        'https://figma.com/careers',
        null,
        'Final Executive Panel',
        'Made it to final loop. Position closed due to an internal lateral transfer.'
      ],
      [
        'Raycast',
        'Frontend / macOS Engineer',
        'Bookmarked',
        150000,
        180000,
        '$150k - $180k',
        'London, UK',
        'Remote',
        'https://www.raycast.com',
        null,
        '',
        'Need to submit extension portfolio project before applying.'
      ]
    ];

    const insertMany = db.transaction((rows) => {
      for (const row of rows) {
        insertStmt.run(...row);
      }
    });

    insertMany(seedData);
  }
}

export default db;
