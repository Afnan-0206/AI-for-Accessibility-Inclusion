import React from 'react';
import { AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';

const CONFIG = {
  high: {
    label: 'High Urgency — Immediate Action Required',
    icon: AlertTriangle,
    classes: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800',
  },
  medium: {
    label: 'Medium Urgency — Action Needed Soon',
    icon: Clock,
    classes: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800',
  },
  low: {
    label: 'Low Urgency — Informational Document',
    icon: CheckCircle2,
    classes: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800',
  },
};

export function UrgencyBadge({ urgency = 'low', className = '' }) {
  const cfg = CONFIG[urgency] || CONFIG.low;
  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border high-contrast:bg-black high-contrast:text-yellow-400 high-contrast:border-yellow-400 high-contrast:border-2 ${cfg.classes} ${className}`}
      role="status"
    >
      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span>{cfg.label}</span>
    </span>
  );
}

export default UrgencyBadge;
