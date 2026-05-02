'use client';

import React from 'react';
import { ItineraryEvent } from '@hopon/core';
import { ItineraryRow } from './itinerary-row';
import { DayHeader } from './day-header';
import { calculateTripDuration } from '@/lib/temporal-utils';
import { AddEventDialog } from './add-event-dialog';

interface BaseGroupProps {
  stay: ItineraryEvent;
  items: ItineraryEvent[];
}

/**
 * High-density container for a Stay and its nested chronological activities.
 */
export function BaseGroup({ stay, items }: BaseGroupProps) {
  // Normalize stay.endTime to string | undefined
  const endTime = stay.endTime ?? undefined;
  const totalDays = calculateTripDuration(stay.startTime, endTime);

  const itemsByDay = new Map<number, ItineraryEvent[]>();

  items.forEach((item) => {
    const dayNum = calculateTripDuration(stay.startTime, item.startTime);
    if (!itemsByDay.has(dayNum)) itemsByDay.set(dayNum, []);
    itemsByDay.get(dayNum)!.push(item);
  });

  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div
      data-testid="base-group"
      className="relative flex flex-col group/base-group bg-card mb-12 rounded-[2.5rem] border shadow-2xl overflow-hidden"
    >
      {/* The Anchor Header (Stay) */}
      <div className="relative z-10 border-b border-border/40">
        <ItineraryRow event={stay} className="bg-primary/[0.04] py-8 border-none" />
      </div>

      {/* The Continuous Thread (Visual Line) */}
      <div className="absolute left-[31px] top-[90px] bottom-0 w-px bg-gradient-to-b from-primary via-primary/30 to-border/40 z-0 opacity-60 group-hover/base-group:opacity-100 transition-opacity duration-500" />

      {/* Nested Chronological Flow */}
      <div className="flex flex-col relative z-10 pl-6 pb-8">
        {days.map((dayNum) => {
          const dayItems = itemsByDay.get(dayNum) || [];
          const currentDate = new Date(stay.startTime);
          currentDate.setUTCDate(currentDate.getUTCDate() + (dayNum - 1));
          const dateISO = currentDate.toISOString();

          return (
            <div key={dayNum} className="flex flex-col">
              <DayHeader date={dateISO} className={dayNum === 1 ? 'mt-6' : 'mt-10'} />

              <div className="flex flex-col gap-1">
                {dayItems.map((item) => (
                  <div key={item.id} data-testid="nested-activity" className="relative">
                    <div className="absolute left-[-26px] top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-border ring-2 ring-background z-20" />
                    <ItineraryRow
                      event={item}
                      className="border-none py-3 pl-8 hover:bg-primary/[0.02]"
                    />
                  </div>
                ))}

                {/* DYNAMIC ADD DIALOG */}
                <div className="relative pl-8 py-2">
                  <div className="absolute left-[-26px] top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-border/40 ring-2 ring-background z-10" />
                  <AddEventDialog tripId={stay.tripId} type="ACTIVITY" initialDate={dateISO} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
