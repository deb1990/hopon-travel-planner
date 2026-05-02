'use client';

import React from 'react';
import { ItineraryEvent } from '@hopon/core';
import { ItineraryRow } from './itinerary-row';
import { DayHeader } from './day-header';
import { calculateTripDuration } from '@/lib/temporal-utils';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface BaseGroupProps {
  stay: ItineraryEvent;
  items: ItineraryEvent[];
}

/**
 * High-density container for a Stay and its nested activities.
 * Acts as a Droppable area for activities.
 */
export function BaseGroup({ stay, items }: BaseGroupProps) {
  const totalDays = calculateTripDuration(stay.startTime, stay.endTime);
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
      <div className="relative z-10 border-b border-border/40">
        <ItineraryRow event={stay} className="bg-primary/[0.04] py-8 border-none" />
      </div>

      <div className="absolute left-[31px] top-[90px] bottom-0 w-px bg-gradient-to-b from-primary via-primary/30 to-border/40 z-0 opacity-60 group-hover/base-group:opacity-100 transition-opacity duration-500" />

      <div className="flex flex-col relative z-10 pl-6 pb-8">
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {days.map((dayNum) => {
            const dayItems = itemsByDay.get(dayNum) || [];
            const currentDate = new Date(stay.startTime);
            currentDate.setUTCDate(currentDate.getUTCDate() + (dayNum - 1));
            const dateISO = currentDate.toISOString();

            return (
              <DaySection
                key={dayNum}
                dayNum={dayNum}
                dateISO={dateISO}
                dayItems={dayItems}
                containerId={stay.id}
              />
            );
          })}
        </SortableContext>
      </div>
    </div>
  );
}

/**
 * Sub-component for a specific calendar day within a stay.
 */
function DaySection({
  dayNum,
  dateISO,
  dayItems,
  containerId,
}: {
  dayNum: number;
  dateISO: string;
  dayItems: ItineraryEvent[];
  containerId: string;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${containerId}-${dateISO}`,
    data: { date: dateISO, stayId: containerId },
  });

  return (
    <div
      ref={setNodeRef}
      className={isOver ? 'bg-primary/[0.02] rounded-xl transition-colors' : ''}
    >
      <DayHeader date={dateISO} className={dayNum === 1 ? 'mt-6' : 'mt-10'} />

      <div className="flex flex-col gap-1 min-h-[20px]">
        {dayItems.length > 0 ? (
          dayItems.map((item) => (
            <div key={item.id} data-testid="nested-activity" className="relative">
              <div className="absolute left-[-26px] top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-border ring-2 ring-background z-20" />
              <ItineraryRow
                event={item}
                isDraggable
                className="border-none py-3 pl-8 hover:bg-primary/[0.02]"
              />
            </div>
          ))
        ) : (
          <div data-testid="empty-day-placeholder" className="relative py-4 pl-14">
            <div className="absolute left-[-26px] top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-border/30 ring-2 ring-background z-10" />
            <p className="text-[10px] text-muted-foreground italic font-medium uppercase tracking-widest opacity-60">
              No activities planned
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
