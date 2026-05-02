import React from 'react';

interface DayHeaderProps {
  date: string;
  className?: string;
}

/**
 * A subtle marker that indicates the calendar date and day of week within a threaded group.
 * Maintains high-density horizontal alignment.
 */
export function DayHeader({ date, className }: DayHeaderProps) {
  const d = new Date(date);
  const dayName = d.toLocaleDateString(undefined, { weekday: 'long' });
  const dateStr = d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={className}>
      <div className="flex items-center gap-6 py-4 ml-[-8px]">
        {/* Thread Anchor */}
        <div className="size-4 rounded-full bg-background border-2 border-primary flex items-center justify-center z-20 shadow-sm shrink-0">
          <div className="size-1 rounded-full bg-primary" />
        </div>

        {/* Single Line Date & Day */}
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="text-sm font-[1000] tracking-tight text-foreground uppercase italic tabular-nums">
            {dateStr}
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/40 leading-none">
            {dayName}
          </span>
        </div>

        {/* Separator Line */}
        <div className="h-px flex-1 bg-gradient-to-r from-border/40 to-transparent" />
      </div>
    </div>
  );
}
