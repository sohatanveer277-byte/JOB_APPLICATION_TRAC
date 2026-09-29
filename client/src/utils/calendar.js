/**
 * Utilities to generate calendar links and download .ics files
 */

function formatToIcsDate(date) {
  // Format as YYYYMMDDTHHmmssZ
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Generate Google Calendar Event Link
 */
export function generateGoogleCalendarUrl(app) {
  if (!app.interview_date) return null;

  const startDate = new Date(app.interview_date);
  // Default interview duration: 60 minutes
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  const title = `${app.company_name} — ${app.interview_round || 'Interview'} (${app.role})`;
  
  let details = `Company: ${app.company_name}\nRole: ${app.role}`;
  if (app.interview_round) details += `\nRound: ${app.interview_round}`;
  if (app.notes) details += `\n\nPrep Notes:\n${app.notes}`;
  if (app.job_url) details += `\n\nJob Posting:\n${app.job_url}`;
  details += `\n\nTracked in JobPulse ATS`;

  const location = `${app.work_mode || 'Remote'} ${app.location ? `(${app.location})` : ''}`.trim();

  const dates = `${formatToIcsDate(startDate)}/${formatToIcsDate(endDate)}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: dates,
    details: details,
    location: location
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate and trigger download of an .ics file (for Apple Calendar, Outlook, etc.)
 */
export function downloadIcsFile(app) {
  if (!app.interview_date) return;

  const startDate = new Date(app.interview_date);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  const title = `${app.company_name} — ${app.interview_round || 'Interview'} (${app.role})`;
  
  let description = `Role: ${app.role}\\nRound: ${app.interview_round || 'General'}`;
  if (app.notes) {
    description += `\\n\\nNotes:\\n${app.notes.replace(/\n/g, '\\n')}`;
  }
  if (app.job_url) {
    description += `\\n\\nJob Posting: ${app.job_url}`;
  }

  const location = `${app.work_mode || 'Remote'} ${app.location ? `(${app.location})` : ''}`.trim();

  const uid = `jobpulse-${app.id}-${Date.now()}@jobpulse.ats`;
  const dtStamp = formatToIcsDate(new Date());
  const dtStart = formatToIcsDate(startDate);
  const dtEnd = formatToIcsDate(endDate);

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//JobPulse ATS//Job Interview Scheduler//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${title.replace(/\n/g, ' ')}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: ${title}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  const cleanCompanyName = (app.company_name || 'Interview').replace(/[^a-zA-Z0-9_-]/g, '_');
  link.download = `${cleanCompanyName}_Interview.ics`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
