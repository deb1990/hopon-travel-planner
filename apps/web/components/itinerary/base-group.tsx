import * as React from 'react';
import { ItineraryRow } from './itinerary-row';
import { BaseGroup as BaseGroupType } from '@hopon/core';

interface BaseGroupProps {
  group: BaseGroupType;
}

/**
 * A visual grouping of itinerary items (activities) nested under a specific accommodation (stay).
 *
 * @param props.group - The base group object containing the stay and its associated items.
 */
export function BaseGroup({ group }: BaseGroupProps) {
  return (
    <div className="flex flex-col gap-0 relative">
      <ItineraryRow event={group.stay} className="border-l-4 border-l-primary bg-white/[0.05]" />

      <div className="flex flex-col gap-0 ml-4 border-l border-white/5">
        {group.items.length > 0 ? (
          group.items.map((event) => <ItineraryRow key={event.id} event={event} className="pl-8" />)
        ) : (
          <div className="px-12 py-4 text-[10px] uppercase font-black text-zinc-800 tracking-widest italic">
            No activities scheduled for this base
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * An alert component for identifying gaps in the timeline between stays.
 *
 * @param props.gap - The interval representing the unassigned period.
 */
export function GapAlert({ gap }: { gap: { startTime: string; endTime: string } }) {
  const start = new Date(gap.startTime).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
  const end = new Date(gap.endTime).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="mx-6 my-2 p-3 rounded-xl border border-dashed border-amber-500/20 bg-amber-500/[0.02] flex items-center justify-between group hover:bg-amber-500/[0.05] transition-colors">
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-black text-amber-500/50 uppercase tracking-[0.2em]">
          Amber Alert: Unassigned Interval
        </span>
        <span className="text-xs font-medium text-amber-200/70">
          {start} — {end}
        </span>
      </div>
      <div className="text-[9px] font-black text-amber-500/40 uppercase border border-amber-500/20 px-2 py-1 rounded-md group-hover:border-amber-500/50 group-hover:text-amber-500 transition-all cursor-pointer">
        Resolve Gap
      </div>
    </div>
  );
}
