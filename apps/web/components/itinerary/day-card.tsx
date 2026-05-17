'use client';

import React, { useState } from 'react';
import { DayGroup, StayEvent } from '@hopon/core';
import { ItineraryRow } from './itinerary-row';
import { DayHeader } from './day-header';
import { AddEventDialog } from './add-event-dialog';
import { EditEventDialog } from './edit-event-dialog';
import { Home, LogOut, LogIn, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DayCardProps {
  day: DayGroup;
  tripId: string;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  onHoverItem?: (id: string | null) => void;
}

/**
 * High-density container for a single calendar day.
 */
export function DayCard({ day, tripId, isFirstDay, isLastDay, onHoverItem }: DayCardProps) {
  const [editingStay, setEditingStay] = useState<StayEvent | null>(null);

  const hasAccommodation = day.activeStays.length > 0;

  // NORMALIZE: Strict UTC Date comparison (YYYY-MM-DD)
  const getUTCDateString = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
  };

  const currentDayUtc = getUTCDateString(day.date);

  const isCheckoutDay = day.activeStays.some(
    (stay) => getUTCDateString(stay.endTime || '') === currentDayUtc,
  );

  const isCheckinDay = day.activeStays.some(
    (stay) => getUTCDateString(stay.startTime) === currentDayUtc,
  );

  // Logic:
  // 1. If NO accommodation -> Always show Add Stay.
  // 2. If it's a checkout day -> show Add Stay (unless last day of trip).
  // 3. If it's a checkin day -> show Add Stay (unless first day of trip).
  let showAddStay = !hasAccommodation;
  if (hasAccommodation) {
    if (isCheckoutDay && !isLastDay) showAddStay = true;
    if (isCheckinDay && !isFirstDay) showAddStay = true;
  }

  return (
    <div className="relative flex flex-col group/day-card bg-card mb-8 rounded-[2.5rem] border border-border/40 shadow-xl overflow-hidden transition-all hover:shadow-2xl hover:border-primary/20">
      <div className="relative z-10 border-b border-border/40 bg-muted/20 px-8 py-6 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <DayHeader date={day.date} className="mt-0" />
          <div className="flex flex-wrap gap-2 mt-2">
            {day.activeStays.map((stay) => {
              const checkoutMatch = getUTCDateString(stay.endTime || '') === currentDayUtc;
              const checkinMatch = getUTCDateString(stay.startTime) === currentDayUtc;

              return (
                <button
                  key={stay.id}
                  onClick={() => setEditingStay(stay)}
                  className="cursor-pointer hover:scale-105 transition-transform"
                >
                  <Badge
                    variant="outline"
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-tight bg-background/50',
                      checkoutMatch && 'border-orange-500/30 text-orange-600',
                      checkinMatch && 'border-indigo-500/30 text-indigo-600',
                      !checkinMatch && !checkoutMatch && 'border-primary/20 text-primary',
                    )}
                  >
                    {checkoutMatch && <LogOut className="size-2.5" />}
                    {checkinMatch && <LogIn className="size-2.5" />}
                    {!checkinMatch && !checkoutMatch && <Home className="size-2.5" />}
                    <span className="truncate max-w-[120px]">{stay.title}</span>
                  </Badge>
                </button>
              );
            })}
            {!hasAccommodation && (
              <Badge
                variant="outline"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-orange-500/40 text-orange-600 bg-orange-500/5"
              >
                <AlertCircle className="size-2.5" />
                No Accommodation
              </Badge>
            )}
          </div>
        </div>

        {showAddStay && (
          <AddEventDialog
            tripId={tripId}
            type="STAY"
            initialDate={day.date}
            className="bg-orange-600 hover:bg-orange-700 shadow-orange-500/20"
          />
        )}
      </div>

      <div className="relative z-10 pl-6 pr-2 py-4">
        <div className="absolute left-[31px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/10 via-primary/10 to-transparent z-0 opacity-40" />

        <div className="flex flex-col gap-1 relative z-10">
          {day.items.length > 0 ? (
            day.items.map((item) => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => onHoverItem?.(item.id)}
                onMouseLeave={() => onHoverItem?.(null)}
              >
                <div className="absolute left-[-26px] top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-border/60 ring-2 ring-background z-20" />
                <ItineraryRow
                  event={item}
                  className="border-none py-3 pl-8 hover:bg-primary/[0.02]"
                />
              </div>
            ))
          ) : (
            <div className="relative pl-8 py-6">
              <p className="text-[10px] text-muted-foreground/40 italic font-medium uppercase tracking-[0.2em]">
                Zero operations scheduled
              </p>
            </div>
          )}

          <div className="relative pl-8 py-4">
            <div className="absolute left-[-26px] top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-border/30 ring-2 ring-background z-10" />
            <AddEventDialog tripId={tripId} type="ACTIVITY" initialDate={day.date} />
          </div>
        </div>
      </div>

      {editingStay && (
        <EditEventDialog
          event={editingStay}
          open={!!editingStay}
          onOpenChange={(open) => !open && setEditingStay(null)}
        />
      )}
    </div>
  );
}
