import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Building2, 
  Edit3, 
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { getInterviewCountdown, getCompanyGradient } from '../utils/formatters';

export default function TimelineView({ applications, onEditApplication }) {
  // Filter applications that have interview_date
  const interviewApps = applications
    .filter(app => app.interview_date && app.interview_date.trim() !== '')
    .sort((a, b) => new Date(a.interview_date) - new Date(b.interview_date));

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
      
      {/* Title */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          <span>Interview Schedule & Countdown</span>
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Chronological timeline of upcoming technical rounds, screens, and panel reviews.
        </p>
      </div>

      {interviewApps.length === 0 ? (
        <div className="bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl p-12 text-center">
          <Calendar className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-zinc-300">No interviews scheduled yet</h3>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto mt-1">
            Add an interview date when creating or editing an application to see it on this timeline with active countdowns.
          </p>
        </div>
      ) : (
        <div className="relative border-l-2 border-zinc-800 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-8">
          {interviewApps.map((app, index) => {
            const countdown = getInterviewCountdown(app.interview_date);
            const dateObj = new Date(app.interview_date);
            const gradient = getCompanyGradient(app.company_name);
            const isUpcoming = countdown && countdown.type !== 'past';

            return (
              <div key={app.id} className="relative group">
                
                {/* Timeline Dot Indicator */}
                <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 bg-zinc-950 flex items-center justify-center transition-all ${
                  isUpcoming 
                    ? 'border-purple-500 ring-4 ring-purple-500/20' 
                    : 'border-zinc-700 ring-2 ring-zinc-800'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isUpcoming ? 'bg-purple-400' : 'bg-zinc-600'}`} />
                </div>

                {/* Card Container */}
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all shadow-md">
                  
                  {/* Top Bar: Company Monogram & Round Title & Countdown Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-tr ${gradient} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                        {app.company_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-base text-zinc-100">{app.company_name}</h3>
                          <span className="text-xs text-zinc-400">&bull; {app.role}</span>
                        </div>
                        <p className="text-xs font-medium text-purple-400 mt-0.5">
                          {app.interview_round || 'Interview Round'}
                        </p>
                      </div>
                    </div>

                    {countdown && (
                      <div className="self-start sm:self-center">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border shadow-sm ${countdown.badgeClass}`}>
                          {countdown.text}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Middle: Date, Time & Mode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3 text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-zinc-400" />
                      <span>
                        {dateObj.toLocaleDateString(undefined, { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-zinc-400" />
                      <span>
                        {dateObj.toLocaleTimeString(undefined, { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Notes / Prep Section */}
                  {app.notes && (
                    <div className="mt-3 p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/60 text-xs text-zinc-300">
                      <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                        Preparation Notes
                      </span>
                      <p className="whitespace-pre-line leading-relaxed">{app.notes}</p>
                    </div>
                  )}

                  {/* Footer actions */}
                  <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500">
                      Status: <strong className="text-zinc-300">{app.status}</strong>
                    </span>

                    <button
                      onClick={() => onEditApplication(app)}
                      className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Update Prep Notes / Date</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
