import React from 'react';
import { Clock, MapPin } from 'lucide-react';

interface ItineraryMetricsProps {
  days: number;
  stays: number;
}

/**
 * Sidebar component showing key statistics for a trip.
 * Refined with a 1:1 side-by-side layout for high-density analytics.
 */
export function ItineraryMetrics({ days, stays }: ItineraryMetricsProps) {
  return (
    <section className="flex flex-col gap-6">
      <h3 className="text-[11px] uppercase font-black text-muted-foreground tracking-[0.4em]">
        Analytics
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Mission Duration */}
        <div className="bg-card p-5 rounded-[2.5rem] border border-border/50 shadow-sm flex flex-col gap-4 group hover:border-primary/50 transition-all duration-500">
          <div className="size-10 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-primary transition-all duration-500 group-hover:text-primary-foreground group-hover:shadow-lg">
            <Clock className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-black text-muted-foreground/60 tracking-tight mb-1">
              Mission Duration
            </span>
            <span className="text-2xl font-black text-foreground tabular-nums">
              {String(days).padStart(2, '0')}{' '}
              <span className="text-[10px] text-primary/50 italic uppercase tracking-tighter">
                Days
              </span>
            </span>
          </div>
        </div>

        {/* Total Stops */}
        <div className="bg-card p-5 rounded-[2.5rem] border border-border/50 shadow-sm flex flex-col gap-4 group hover:border-primary/50 transition-all duration-500">
          <div className="size-10 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-primary transition-all duration-500 group-hover:text-primary-foreground group-hover:shadow-lg">
            <MapPin className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-black text-muted-foreground/60 tracking-tight mb-1">
              Total Stops
            </span>
            <span className="text-2xl font-black text-foreground tabular-nums">
              {String(stays).padStart(2, '0')}{' '}
              <span className="text-[10px] text-primary/50 italic uppercase tracking-tighter">
                Stays
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
