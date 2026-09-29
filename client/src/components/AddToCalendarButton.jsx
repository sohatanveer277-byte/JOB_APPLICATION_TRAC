import React, { useState, useRef, useEffect } from 'react';
import { CalendarPlus, ExternalLink, Download, ChevronDown } from 'lucide-react';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

export default function AddToCalendarButton({ application, variant = 'default' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!application || !application.interview_date) return null;

  const googleUrl = generateGoogleCalendarUrl(application);

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    downloadIcsFile(application);
    setIsOpen(false);
  };

  const isCompact = variant === 'compact';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`inline-flex items-center gap-1 rounded-md transition-all font-medium border ${
          isCompact
            ? 'px-1.5 py-0.5 text-[10px] bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/30'
            : 'px-2.5 py-1 text-xs bg-zinc-800 hover:bg-zinc-700/80 text-zinc-200 border-zinc-700 shadow-sm'
        }`}
        title="Add interview to your calendar"
      >
        <CalendarPlus className={isCompact ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5 text-purple-400'} />
        <span>{isCompact ? '+ Cal' : 'Add to Calendar'}</span>
        <ChevronDown className={isCompact ? 'w-2 h-2 opacity-70' : 'w-3 h-3 text-zinc-400'} />
      </button>

      {isOpen && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-1.5 w-48 rounded-xl bg-zinc-900 border border-zinc-700/90 shadow-xl py-1 z-30 text-xs animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3 py-1.5 text-[10px] uppercase font-mono text-zinc-500 border-b border-zinc-800/80">
            Add to Calendar
          </div>

          <a
            href={googleUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-3 py-2 text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>Google Calendar</span>
            </span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </a>

          <button
            type="button"
            onClick={handleDownload}
            className="w-full flex items-center justify-between px-3 py-2 text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span>Apple / Outlook (.ics)</span>
            </span>
            <Download className="w-3 h-3 text-zinc-500" />
          </button>
        </div>
      )}
    </div>
  );
}
