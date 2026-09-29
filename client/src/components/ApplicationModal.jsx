import React, { useState, useEffect } from 'react';
import { X, Sparkles, Calendar, DollarSign, Briefcase, MapPin, Link2 } from 'lucide-react';
import { STATUSES, WORK_MODES, INTERVIEW_ROUNDS } from '../utils/constants';

export default function ApplicationModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData = null, 
  initialStatus = 'Bookmarked' 
}) {
  const [formData, setFormData] = useState({
    company_name: '',
    role: '',
    status: initialStatus,
    salary_min: '',
    salary_max: '',
    salary_estimate: '',
    location: 'Remote',
    work_mode: 'Remote',
    job_url: '',
    interview_date: '',
    interview_round: '',
    notes: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        company_name: initialData.company_name || '',
        role: initialData.role || '',
        status: initialData.status || 'Bookmarked',
        salary_min: initialData.salary_min || '',
        salary_max: initialData.salary_max || '',
        salary_estimate: initialData.salary_estimate || '',
        location: initialData.location || 'Remote',
        work_mode: initialData.work_mode || 'Remote',
        job_url: initialData.job_url || '',
        interview_date: initialData.interview_date ? initialData.interview_date.slice(0, 16) : '',
        interview_round: initialData.interview_round || '',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        company_name: '',
        role: '',
        status: initialStatus || 'Bookmarked',
        salary_min: '',
        salary_max: '',
        salary_estimate: '',
        location: 'Remote',
        work_mode: 'Remote',
        job_url: '',
        interview_date: '',
        interview_round: '',
        notes: ''
      });
    }
    setError('');
  }, [initialData, initialStatus, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company_name.trim()) {
      setError('Company name is required');
      return;
    }
    if (!formData.role.trim()) {
      setError('Job role is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSave({
        ...formData,
        salary_min: formData.salary_min ? parseInt(formData.salary_min, 10) : 0,
        salary_max: formData.salary_max ? parseInt(formData.salary_max, 10) : 0,
        interview_date: formData.interview_date || null
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-zinc-900 border border-zinc-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                {initialData ? 'Edit Application' : 'New Job Application'}
              </h2>
              <p className="text-xs text-zinc-400">
                {initialData ? 'Update application progress and interview schedule' : 'Track a new role in your job pipeline'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              {error}
            </div>
          )}

          {/* Company & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Company Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Stripe, Linear, Vercel"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full bg-zinc-950 text-sm text-zinc-100 placeholder-zinc-500 rounded-lg px-3.5 py-2 border border-zinc-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Role Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Frontend Engineer"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-zinc-950 text-sm text-zinc-100 placeholder-zinc-500 rounded-lg px-3.5 py-2 border border-zinc-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Status & Work Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Pipeline Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-zinc-950 text-sm text-zinc-100 rounded-lg px-3.5 py-2 border border-zinc-800 focus:outline-none focus:border-blue-500 transition-all"
              >
                {STATUSES.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Work Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {WORK_MODES.map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setFormData({ ...formData, work_mode: mode })}
                    className={`py-2 text-xs font-medium rounded-lg border text-center transition-all ${
                      formData.work_mode === mode
                        ? 'bg-blue-600/20 text-blue-300 border-blue-500/50'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Salary Min & Max */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Estimated Salary Range ($ / Year)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
                <input
                  type="number"
                  placeholder="Min (e.g. 150000)"
                  value={formData.salary_min}
                  onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                  className="w-full bg-zinc-950 text-sm text-zinc-100 placeholder-zinc-500 rounded-lg pl-7 pr-3 py-2 border border-zinc-800 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
                <input
                  type="number"
                  placeholder="Max (e.g. 180000)"
                  value={formData.salary_max}
                  onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                  className="w-full bg-zinc-950 text-sm text-zinc-100 placeholder-zinc-500 rounded-lg pl-7 pr-3 py-2 border border-zinc-800 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Location & Job URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. San Francisco, CA / Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-zinc-950 text-sm text-zinc-100 placeholder-zinc-500 rounded-lg px-3.5 py-2 border border-zinc-800 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Job Posting Link
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.job_url}
                onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
                className="w-full bg-zinc-950 text-sm text-zinc-100 placeholder-zinc-500 rounded-lg px-3.5 py-2 border border-zinc-800 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Interview Date & Round */}
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400">
              <Calendar className="w-4 h-4" />
              <span>Interview Schedule & Countdown (Optional)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Interview Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.interview_date}
                  onChange={(e) => setFormData({ ...formData, interview_date: e.target.value })}
                  className="w-full bg-zinc-900 text-xs text-zinc-200 rounded-lg px-3 py-2 border border-zinc-700/60 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Interview Round</label>
                <input
                  type="text"
                  placeholder="e.g. Technical Round, System Design"
                  value={formData.interview_round}
                  onChange={(e) => setFormData({ ...formData, interview_round: e.target.value })}
                  className="w-full bg-zinc-900 text-xs text-zinc-200 placeholder-zinc-500 rounded-lg px-3 py-2 border border-zinc-700/60 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            {/* Quick Round Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {INTERVIEW_ROUNDS.slice(0, 5).map(round => (
                <button
                  key={round}
                  type="button"
                  onClick={() => setFormData({ ...formData, interview_round: round })}
                  className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  + {round}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Notes & Interview Prep (Markdown / Text)
            </label>
            <textarea
              rows={3}
              placeholder="Key talking points, recruiter name, compensation notes, tech stack requirements..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-zinc-950 text-xs text-zinc-100 placeholder-zinc-500 rounded-lg p-3 border border-zinc-800 focus:outline-none focus:border-blue-500 transition-all resize-y"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Create Application'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
