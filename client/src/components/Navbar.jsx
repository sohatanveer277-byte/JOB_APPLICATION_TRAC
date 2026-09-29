import React, { useEffect, useRef } from 'react';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Kanban, 
  TableProperties, 
  CalendarClock,
  Sparkles
} from 'lucide-react';

export default function Navbar({ 
  currentView, 
  setCurrentView, 
  searchQuery, 
  setSearchQuery, 
  onOpenCreateModal,
  totalCount 
}) {
  const searchInputRef = useRef(null);

  // Global keyboard shortcut: Cmd+K / Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold ring-1 ring-white/20">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-lg text-zinc-100 tracking-tight">JobPulse ATS</h1>
              <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Notion Style
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">Track tech applications, interviews & salaries</p>
          </div>
        </div>

        {/* Center: Search & Navigation View Switcher */}
        <div className="flex flex-1 max-w-xl items-center gap-3">
          
          {/* Quick Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies, roles, notes..."
              className="w-full bg-zinc-900/90 text-sm text-zinc-200 placeholder-zinc-500 rounded-lg pl-9 pr-14 py-2 border border-zinc-800 focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
            <kbd className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 bg-zinc-800 border border-zinc-700/60 px-1.5 py-0.5 rounded font-mono">
              ⌘K
            </kbd>
          </div>

          {/* View Toggles */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800/80 p-1 rounded-lg">
            <button
              onClick={() => setCurrentView('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentView === 'board'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
              title="Pipeline Board View"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Pipeline</span>
            </button>

            <button
              onClick={() => setCurrentView('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentView === 'table'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
              title="Notion Table View"
            >
              <TableProperties className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Table</span>
            </button>

            <button
              onClick={() => setCurrentView('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentView === 'timeline'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
              title="Interview Timeline View"
            >
              <CalendarClock className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Timeline</span>
            </button>
          </div>
        </div>

        {/* Right: Add New Application Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreateModal}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-lg shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all border border-blue-400/30"
          >
            <Plus className="w-4 h-4" />
            <span>New Application</span>
          </button>
        </div>

      </div>
    </header>
  );
}
