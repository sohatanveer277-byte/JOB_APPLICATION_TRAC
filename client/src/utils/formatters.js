// Format numbers into clean currency string ($175k or $175,000)
export function formatSalary(min, max, estimateStr) {
  if (min && max) {
    const minK = min >= 1000 ? `${Math.round(min / 1000)}k` : min;
    const maxK = max >= 1000 ? `${Math.round(max / 1000)}k` : max;
    return `$${minK} - $${maxK}`;
  }
  if (max) {
    const maxK = max >= 1000 ? `${Math.round(max / 1000)}k` : max;
    return `Up to $${maxK}`;
  }
  if (min) {
    const minK = min >= 1000 ? `${Math.round(min / 1000)}k` : min;
    return `From $${minK}`;
  }
  if (estimateStr && estimateStr.trim() !== '') {
    return estimateStr;
  }
  return 'Not specified';
}

// Calculate relative countdown string and alert level
export function getInterviewCountdown(dateStr) {
  if (!dateStr) return null;

  const target = new Date(dateStr);
  const now = new Date();
  
  // Set both to midnight for clean day calculation
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffDays = Math.round((targetDay - today) / (1000 * 60 * 60 * 24));
  
  // Format readable time if available
  const hasTime = dateStr.includes('T') && !dateStr.endsWith('T00:00') && !dateStr.endsWith('T00:00:00');
  const timeFormatted = hasTime ? target.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  if (diffDays === 0) {
    return {
      text: timeFormatted ? `Today at ${timeFormatted}` : 'Today!',
      type: 'urgent',
      days: 0,
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
    };
  } else if (diffDays === 1) {
    return {
      text: timeFormatted ? `Tomorrow at ${timeFormatted}` : 'Tomorrow',
      type: 'soon',
      days: 1,
      badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
    };
  } else if (diffDays > 1 && diffDays <= 7) {
    return {
      text: `In ${diffDays} days`,
      type: 'upcoming',
      days: diffDays,
      badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    };
  } else if (diffDays > 7) {
    return {
      text: target.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      type: 'future',
      days: diffDays,
      badgeClass: 'bg-zinc-800 text-zinc-400 border-zinc-700/50'
    };
  } else {
    return {
      text: 'Completed',
      type: 'past',
      days: diffDays,
      badgeClass: 'bg-zinc-800/60 text-zinc-500 border-zinc-700/30'
    };
  }
}

// Generate consistent modern gradient background for company avatar
const GRADIENTS = [
  'from-blue-600 to-indigo-600',
  'from-purple-600 to-pink-600',
  'from-emerald-600 to-teal-600',
  'from-amber-600 to-orange-600',
  'from-cyan-600 to-blue-600',
  'from-fuchsia-600 to-rose-600',
  'from-violet-600 to-purple-600'
];

export function getCompanyGradient(name) {
  if (!name) return GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
}
