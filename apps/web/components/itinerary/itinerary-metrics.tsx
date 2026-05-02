import React from 'react';
import { Clock, MapPin } from 'lucide-react';

interface ItineraryMetricsProps {
  days: number;
  stays: number;
}

/**
 * Sidebar component showing key statistics for a trip.
 *
 * @param props.days - Total planned duration in days.
 * @param props.stays - Total number of unique accommodations (bases).
 */
export function ItineraryMetrics({ days, stays }: ItineraryMetricsProps) {
  return (
    <section className="flex flex-col gap-6">
      <h3 className="text-[11px] uppercase font-black text-muted-foreground tracking-[0.4em]">
        Analytics
      </h3>
      <div className="grid grid-cols-1 gap-5">
        <div className="bg-card p-6 rounded-[2.5rem] border border-border shadow-sm flex items-center justify-between group hover:border-primary/50 transition-all duration-500">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-tight">
              Mission Duration
            </span>
            <span className="text-3xl font-black text-foreground">
              {String(days).padStart(2, '0')}{' '}
              <span className="text-xs text-primary/50 italic uppercase">DAYS</span>
            </span>
          </div>
          <div className="size-14 rounded-3xl bg-muted flex items-center justify-center group-hover:bg-primary transition-all duration-500 group-hover:text-primary-foreground group-hover:shadow-xl">
            <Clock className="size-6" />
          </div>
        </div>
        <div className="bg-card p-6 rounded-[2.5rem] border border-border shadow-sm flex items-center justify-between group hover:border-primary/50 transition-all duration-500">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-tight">
              Total Stops
            </span>
            <span className="text-3xl font-black text-foreground">
              {String(stays).padStart(2, '0')}{' '}
              <span className="text-xs text-primary/50 italic uppercase">STAYS</span>
            </span>
          </div>
          <div className="size-14 rounded-3xl bg-muted flex items-center justify-center group-hover:bg-primary transition-all duration-500 group-hover:text-primary-foreground group-hover:shadow-xl">
            <MapPin className="size-6" />
          </div>
        </div>
      </div>
    </section>
  );
}
