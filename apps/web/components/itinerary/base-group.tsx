'use client';

import React from 'react';
import { ItineraryEvent } from '@hopon/core';
import { ItineraryRow } from './itinerary-row';
import { DayHeader } from './day-header';
import { calculateTripDuration } from '@/lib/temporal-utils';

interface BaseGroupProps {
  stay: ItineraryEvent;
  items: ItineraryEvent[];
}

/**
 * High-density container for a Stay and its nested activities.
 * Ensures every calendar day of the stay is visually represented.
 */
export function BaseGroup({ stay, items }: BaseGroupProps) {
  // 1. Calculate the total number of days for this stay
  const totalDays = calculateTripDuration(stay.startTime, stay.endTime);

  // 2. Map existing items to their specific day numbers
  const itemsByDay = new Map<number, ItineraryEvent[]>();
  items.forEach((item) => {
    const dayNum = calculateTripDuration(stay.startTime, item.startTime);
    if (!itemsByDay.has(dayNum)) itemsByDay.set(dayNum, []);
    itemsByDay.get(dayNum)!.push(item);
  });

  // 3. Generate a sequence of all days in the stay
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div className="relative flex flex-col group/base-group bg-card mb-12 rounded-[2.5rem] border shadow-2xl overflow-hidden">
      <div className="relative z-10 border-b border-border/40">
        <ItineraryRow event={stay} className="bg-primary/[0.04] py-8 border-none" />
      </div>

      <div className="absolute left-[31px] top-[90px] bottom-0 w-px bg-gradient-to-b from-primary via-primary/30 to-border/40 z-0 opacity-60 group-hover/base-group:opacity-100 transition-opacity duration-500" />

      <div className="flex flex-col relative z-10 pl-6 pb-8">
        {days.map((dayNum) => {
          const dayItems = itemsByDay.get(dayNum) || [];

          // Calculate the actual calendar date for this day number
          const currentDate = new Date(stay.startTime);
          currentDate.setUTCDate(currentDate.getUTCDate() + (dayNum - 1));
          const dateISO = currentDate.toISOString();

          return (
            <React.Fragment key={dayNum}>
              <DayHeader date={dateISO} className={dayNum === 1 ? 'mt-6' : 'mt-10'} />

              <div className="flex flex-col gap-1">
                {dayItems.length > 0 ? (
                  dayItems.map((item) => (
                    <div key={item.id} className="relative">
                      <div className="absolute left-[-26px] top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-border ring-2 ring-background z-20" />
                      <ItineraryRow
                        event={item}
                        className="border-none py-3 pl-8 hover:bg-primary/[0.02]"
                      />
                    </div>
                  ))
                ) : (
                  <div className="relative py-4 pl-14">
                    <div className="absolute left-[-26px] top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-border/30 ring-2 ring-background z-10" />
                    <p className="text-[10px] text-muted-foreground italic font-medium uppercase tracking-widest opacity-60">
                      No activities planned
                    </p>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
