'use client';

import React from 'react';
import { DayHeader } from './day-header';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GhostGroupProps {
  startTime: string;
  numDays: number;
}

/**
 * A placeholder group for intervals where no stay accommodation is assigned.
 * Designed to perfectly mirror the refined BaseGroup header styling.
 */
export function GhostGroup({ startTime, numDays }: GhostGroupProps) {
  const days = Array.from({ length: numDays }, (_, i) => i + 1);

  return (
    <div className="relative flex flex-col group/ghost-group bg-orange-500/[0.03] mb-12 rounded-[2.5rem] border border-orange-500/20 shadow-xl overflow-hidden">
      {/* The Ghost Header - Clean and Minimalist */}
      <div className="relative z-10 border-b border-orange-500/10 px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-orange-600 tracking-tight italic">
              Stay Not Assigned
            </span>
          </div>
        </div>
        <Button className="rounded-full bg-orange-600 text-white font-black h-8 px-4 text-[10px] uppercase tracking-widest hover:scale-105 transition-transform shadow-md border-none cursor-pointer">
          <Plus className="size-3 mr-1.5 stroke-[3]" />
          Assign
        </Button>
      </div>

      {/* The Thread (Orange Variant) */}
      <div className="absolute left-[31px] top-[90px] bottom-0 w-px bg-gradient-to-b from-orange-500/40 via-orange-500/20 to-transparent z-0 opacity-60" />

      {/* Nested Chronological Flow */}
      <div className="flex flex-col relative z-10 pl-6 pb-8">
        {days.map((dayNum) => {
          const currentDate = new Date(startTime);
          currentDate.setUTCDate(currentDate.getUTCDate() + (dayNum - 1));
          const dateISO = currentDate.toISOString();

          return (
            <React.Fragment key={dayNum}>
              <DayHeader date={dateISO} className={dayNum === 1 ? 'mt-6' : 'mt-10'} />
              <div className="flex flex-col gap-1">
                <div className="relative py-4 pl-14 text-orange-900/40 dark:text-orange-100/30">
                  <div className="absolute left-[-26px] top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-orange-500/30 ring-2 ring-background z-10" />
                  <p className="text-[10px] italic font-medium uppercase tracking-widest">
                    No activities planned
                  </p>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
