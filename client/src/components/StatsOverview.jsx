import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Layers, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { getInterviewCountdown } from '../utils/formatters';

export default function StatsOverview({ stats, onSelectApplication }) {
  if (!stats) return null;

  const { salary, statusCounts, activePipeline, upcomingInterviews, total } = stats;

  const nextInterview = upcomingInterviews && upcomingInterviews.length > 0 
    ? upcomingInterviews[0] 
    : null;
  const nextCountdown = nextInterview ? getInterviewCountdown(nextInterview.interview_date) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 pb-2">
      {/* Top Banner: Upcoming Interview Alert if any */}
      {nextInterview && (
        <div className="mb-5 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-blue-950/60 via-purple-950/40 to-zinc-900/80 border border-blue-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-blue-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Next Upcoming Interview</span>
                {nextCountdown && (
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${nextCountdown.badgeClass}`}>
                    {nextCountdown.text}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-zinc-100 mt-0.5">
                <span className="font-semibold text-white">{nextInterview.company_name}</span> &bull; {nextInterview.role}
                {nextInterview.interview_round ? ` (${nextInterview.interview_round})` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectApplication && onSelectApplication(nextInterview.id)}
            className="self-start sm:self-center flex items-center gap-1.5 text-xs font-medium text-blue-300 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3 Main Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Salary Insights */}
        <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Salary Insights
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">
              {salary.trackedCount} tracked
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-zinc-100">
                ${salary.avg ? Math.round(salary.avg / 1000) : 0}k
              </span>
              <span className="text-xs text-zinc-400">avg / year</span>
            </div>

            {/* Visual Salary Range Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-zinc-400 font-mono mb-1">
                <span>Min: ${salary.min ? Math.round(salary.min / 1000) : 0}k</span>
                <span className="text-emerald-400 font-medium">Max: ${salary.max ? Math.round(salary.max / 1000) : 0}k</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-full w-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Active Pipeline & Status Breakdown */}
        <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between group hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Active Pipeline
            </span>
            <span className="text-xs font-semibold text-blue-400 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              {activePipeline} active
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2 pt-1 border-t border-zinc-800/60">
            <div className="text-center p-2 rounded-lg bg-zinc-950/40">
              <span className="text-[11px] text-zinc-500 block">Applied</span>
              <span className="text-base font-semibold text-blue-400">{statusCounts.Applied || 0}</span>
            </div>
            <div className="text-center p-2 rounded-lg bg-zinc-950/40">
              <span className="text-[11px] text-zinc-500 block">Interviews</span>
              <span className="text-base font-semibold text-purple-400">{statusCounts.Interviewing || 0}</span>
            </div>
            <div className="text-center p-2 rounded-lg bg-zinc-950/40">
              <span className="text-[11px] text-zinc-500 block">Offers</span>
              <span className="text-base font-semibold text-emerald-400">{statusCounts.Offered || 0}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Interview Activity & Next Steps */}
        <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between group hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              Interview Activity
            </span>
            <span className="text-[11px] text-zinc-400">
              {upcomingInterviews.length} upcoming
            </span>
          </div>

          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-zinc-100">
                {upcomingInterviews.length}
              </span>
              <span className="text-xs text-zinc-400">scheduled rounds</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              {upcomingInterviews.length > 0 
                ? `Next: ${nextInterview.company_name} on ${new Date(nextInterview.interview_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}`
                : 'No upcoming interviews scheduled yet.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
