import React, { useState } from 'react';
import { 
  Plus, 
  MoreHorizontal, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  DollarSign,
  Briefcase,
  Edit2,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { STATUSES } from '../utils/constants';
import { formatSalary, getInterviewCountdown, getCompanyGradient } from '../utils/formatters';
import AddToCalendarButton from './AddToCalendarButton';

export default function BoardView({ 
  applications, 
  onEditApplication, 
  onDeleteApplication, 
  onUpdateStatus, 
  onOpenCreateWithStatus 
}) {
  const [draggedAppId, setDraggedAppId] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Group applications by status
  const columns = STATUSES.map(status => ({
    ...status,
    items: applications.filter(app => app.status === status.id)
  }));

  const handleDragStart = (e, appId) => {
    setDraggedAppId(appId);
    e.dataTransfer.setData('text/plain', appId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, statusId) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData('text/plain') || draggedAppId;
    if (appId) {
      onUpdateStatus(parseInt(appId, 10), statusId);
    }
    setDraggedAppId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {columns.map(column => (
          <div
            key={column.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
            className="bg-zinc-900/40 rounded-xl border border-zinc-800/60 p-3 flex flex-col min-h-[500px] transition-colors hover:border-zinc-700/60"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${column.badgeClass}`}>
                  {column.label}
                </span>
                <span className="text-xs font-mono text-zinc-500">
                  {column.items.length}
                </span>
              </div>
              
              <button
                onClick={() => onOpenCreateWithStatus(column.id)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                title={`Add to ${column.label}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Application Cards List */}
            <div className="flex flex-col gap-3 flex-1">
              {column.items.map(app => {
                const countdown = getInterviewCountdown(app.interview_date);
                const gradient = getCompanyGradient(app.company_name);

                return (
                  <div
                    key={app.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, app.id)}
                    className="group bg-zinc-900/90 hover:bg-zinc-800/80 border border-zinc-800 rounded-xl p-3.5 shadow-sm hover:shadow-md hover:border-zinc-700/80 cursor-grab active:cursor-grabbing transition-all relative"
                  >
                    {/* Card Top: Avatar & Company Name & Actions */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${gradient} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm`}>
                          {app.company_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-sm text-zinc-100 truncate group-hover:text-white">
                            {app.company_name}
                          </h3>
                          <p className="text-xs text-zinc-400 truncate">
                            {app.role}
                          </p>
                        </div>
                      </div>

                      {/* Card Menu Dropdown */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === app.id ? null : app.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-zinc-700/60 text-zinc-400 hover:text-zinc-200 transition-opacity"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {activeMenuId === app.id && (
                          <div 
                            className="absolute right-0 top-6 z-20 w-40 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl py-1 text-xs text-zinc-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => {
                                onEditApplication(app);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 flex items-center gap-2"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
                              <span>Edit Details</span>
                            </button>
                            
                            {/* Advance stage quickly */}
                            <div className="border-t border-zinc-800 my-1"></div>
                            <div className="px-3 py-1 text-[10px] uppercase font-mono text-zinc-500">Move to stage</div>
                            {STATUSES.filter(s => s.id !== app.status).map(s => (
                              <button
                                key={s.id}
                                onClick={() => {
                                  onUpdateStatus(app.id, s.id);
                                  setActiveMenuId(null);
                                }}
                                className="w-full text-left px-3 py-1 hover:bg-zinc-800 text-[11px] text-zinc-400 hover:text-zinc-200"
                              >
                                &rarr; {s.label}
                              </button>
                            ))}

                            <div className="border-t border-zinc-800 my-1"></div>
                            <button
                              onClick={() => {
                                onDeleteApplication(app);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-red-500/10 text-red-400 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Salary & Work Mode Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap my-2.5">
                      <span className="inline-flex items-center text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                        <DollarSign className="w-3 h-3 mr-0.5" />
                        {formatSalary(app.salary_min, app.salary_max, app.salary_estimate)}
                      </span>

                      <span className="inline-flex items-center text-[11px] text-zinc-400 bg-zinc-800/80 border border-zinc-700/50 px-2 py-0.5 rounded-md">
                        {app.work_mode}
                      </span>
                    </div>

                    {/* Interview Countdown Badge if present */}
                    {countdown && (
                      <div className="mt-2 pt-2 border-t border-zinc-800/60 flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 text-xs min-w-0">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span className="text-[11px] text-zinc-400 truncate max-w-[80px]">
                            {app.interview_round || 'Interview'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${countdown.badgeClass}`}>
                            {countdown.text}
                          </span>
                          <AddToCalendarButton application={app} variant="compact" />
                        </div>
                      </div>
                    )}

                    {/* Notes Snippet */}
                    {app.notes && !countdown && (
                      <p className="text-[11px] text-zinc-500 line-clamp-2 mt-2 pt-1 border-t border-zinc-800/40">
                        {app.notes}
                      </p>
                    )}

                    {/* Job Link */}
                    {app.job_url && (
                      <a
                        href={app.job_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[11px] text-blue-400/80 hover:text-blue-300 mt-2 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Job Posting</span>
                      </a>
                    )}
                  </div>
                );
              })}

              {column.items.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center p-4 border border-dashed border-zinc-800 rounded-xl text-center">
                  <p className="text-xs text-zinc-500">No applications</p>
                  <button
                    onClick={() => onOpenCreateWithStatus(column.id)}
                    className="text-xs text-blue-400 hover:text-blue-300 mt-1"
                  >
                    + Add one
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
