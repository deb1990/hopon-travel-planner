'use client';

import React from 'react';
import { DayHeader } from './day-header';
import { AddEventDialog } from './add-event-dialog';

interface GhostGroupProps {
  tripId: string;
  startTime: string;
  numDays: number;
}

/**
 * A placeholder group for intervals where no stay accommodation is assigned.
 */
export function GhostGroup({ tripId, startTime, numDays }: GhostGroupProps) {
  const days = Array.from({ length: numDays }, (_, i) => i + 1);

  return (
    <div
      data-testid="ghost-group"
      className="relative flex flex-col group/ghost-group bg-orange-500/[0.03] mb-12 rounded-[2.5rem] border border-orange-500/20 shadow-xl overflow-hidden"
    >
      {/* The Ghost Header */}
      <div className="relative z-10 border-b border-orange-500/10 px-8 py-8 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold text-orange-600 tracking-tight italic">
            Stay Not Assigned
          </h3>
          <p className="text-[10px] font-bold text-orange-600/40 uppercase tracking-widest leading-none">
            Missing accommodation
          </p>
        </div>
        <AddEventDialog tripId={tripId} type="STAY" initialDate={startTime} />
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
            <div key={dayNum} className="flex flex-col">
              <DayHeader date={dateISO} className={dayNum === 1 ? 'mt-6' : 'mt-10'} />

              <div className="flex flex-col gap-1">
                <div className="relative pl-8 py-2">
                  <div className="absolute left-[-26px] top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-orange-500/30 ring-2 ring-background z-10" />
                  <AddEventDialog tripId={tripId} type="ACTIVITY" initialDate={dateISO} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
