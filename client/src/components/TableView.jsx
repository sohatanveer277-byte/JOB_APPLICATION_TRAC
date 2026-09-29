import React, { useState } from 'react';
import { 
  ArrowUpDown, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Edit2, 
  Trash2,
  ChevronDown
} from 'lucide-react';
import { STATUSES } from '../utils/constants';
import { formatSalary, getInterviewCountdown, getCompanyGradient } from '../utils/formatters';

export default function TableView({ 
  applications, 
  onEditApplication, 
  onDeleteApplication, 
  onUpdateStatus,
  selectedStatusFilter,
  setSelectedStatusFilter
}) {
  const [sortField, setSortField] = useState('company_name');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Filter
  const filtered = selectedStatusFilter === 'All'
    ? applications
    : applications.filter(app => app.status === selectedStatusFilter);

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';

    if (sortField === 'salary') {
      aVal = a.salary_max || a.salary_min || 0;
      bVal = b.salary_max || b.salary_min || 0;
    }

    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      
      {/* Table Filter Tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedStatusFilter('All')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedStatusFilter === 'All'
              ? 'bg-zinc-100 text-zinc-900 font-semibold shadow'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          All Applications ({applications.length})
        </button>

        {STATUSES.map(s => {
          const count = applications.filter(a => a.status === s.id).length;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedStatusFilter(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                selectedStatusFilter === s.id
                  ? `${s.badgeClass} ring-1 ring-white/20 font-semibold`
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              <span>{s.label}</span>
              <span className="text-[10px] opacity-75 font-mono">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Table Container */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            
            {/* Header */}
            <thead className="bg-zinc-900/90 text-zinc-400 uppercase font-mono text-[11px] border-b border-zinc-800">
              <tr>
                <th 
                  onClick={() => handleSort('company_name')}
                  className="py-3.5 px-4 cursor-pointer hover:text-zinc-200 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Company</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('role')}
                  className="py-3.5 px-4 cursor-pointer hover:text-zinc-200 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Role</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Status</th>
                <th 
                  onClick={() => handleSort('salary')}
                  className="py-3.5 px-4 cursor-pointer hover:text-zinc-200 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Salary Estimate</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('interview_date')}
                  className="py-3.5 px-4 cursor-pointer hover:text-zinc-200 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Next Interview</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Work Mode</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {sorted.map(app => {
                const countdown = getInterviewCountdown(app.interview_date);
                const currentStatusObj = STATUSES.find(s => s.id === app.status) || STATUSES[0];
                const gradient = getCompanyGradient(app.company_name);

                return (
                  <tr 
                    key={app.id}
                    className="hover:bg-zinc-800/40 transition-colors group"
                  >
                    {/* Company */}
                    <td className="py-3 px-4 font-medium text-zinc-100">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-md bg-gradient-to-tr ${gradient} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm`}>
                          {app.company_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-white">{app.company_name}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-zinc-200">{app.role}</div>
                        {app.job_url && (
                          <a
                            href={app.job_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:underline mt-0.5"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            <span>Link</span>
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Status with Inline Dropdown */}
                    <td className="py-3 px-4">
                      <div className="relative inline-block">
                        <select
                          value={app.status}
                          onChange={(e) => onUpdateStatus(app.id, e.target.value)}
                          className={`appearance-none text-[11px] font-medium px-2.5 py-1 pr-6 rounded-md border cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500/50 ${currentStatusObj.badgeClass}`}
                        >
                          {STATUSES.map(s => (
                            <option key={s.id} value={s.id} className="bg-zinc-900 text-zinc-200">
                              {s.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                      </div>
                    </td>

                    {/* Salary */}
                    <td className="py-3 px-4 font-mono">
                      <span className="text-emerald-400 font-medium">
                        {formatSalary(app.salary_min, app.salary_max, app.salary_estimate)}
                      </span>
                    </td>

                    {/* Interview Date & Countdown */}
                    <td className="py-3 px-4">
                      {countdown ? (
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${countdown.badgeClass}`}>
                            {countdown.text}
                          </span>
                          <span className="text-[11px] text-zinc-400 truncate max-w-[120px]">
                            {app.interview_round}
                          </span>
                        </div>
                      ) : (
                        <span className="text-zinc-600 font-mono text-[11px]">—</span>
                      )}
                    </td>

                    {/* Work Mode */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50 text-[11px]">
                        {app.work_mode}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={() => onEditApplication(app)}
                          className="p-1.5 rounded-md hover:bg-zinc-700/60 text-zinc-400 hover:text-zinc-200 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteApplication(app)}
                          className="p-1.5 rounded-md hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}

              {sorted.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-500">
                    No applications found in this view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
