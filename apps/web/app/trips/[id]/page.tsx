'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTrip } from '@/hooks/use-trip';
import { ItineraryHeader } from '@/components/itinerary/itinerary-header';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, Sparkles, MapPin, ShieldCheck } from 'lucide-react';
import { groupEventsByDay } from '@hopon/core';
import { calculateTripDuration } from '@/lib/temporal-utils';
import { DayCard } from '@/components/itinerary/day-card';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/itinerary/map-view'), {
  ssr: false,
  loading: () => (
    <div className="size-full bg-muted/20 animate-pulse flex items-center justify-center">
      <MapPin className="size-8 text-muted-foreground/10" />
    </div>
  ),
});

/**
 * Detailed itinerary view for a single trip.
 * High-density studio layout with balanced 1:1 dual-pane and compact inspector metrics.
 */
export default function TripDetail() {
  const params = useParams();
  const tripId = params['id'] as string;
  const { data: trip, isLoading, error } = useTrip(tripId);

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // --- HOOKS MUST BE CALLED BEFORE CONDITIONAL RETURNS ---
  const events = trip?.events || [];
  const startDate = trip?.startDate ?? undefined;
  const endDate = trip?.endDate ?? undefined;

  // Group events by calendar day
  const dayGroups = useMemo(
    () => groupEventsByDay(events, startDate, endDate),
    [events, startDate, endDate],
  );

  const days = calculateTripDuration(startDate, endDate);
  // -------------------------------------------------------

  if (error) return <ErrorView message={(error as Error).message} />;
  if (isLoading || !trip) return <LoadingView />;

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-500">
      <ItineraryHeader trip={trip} />

      <div className="flex-1 max-w-[1600px] mx-auto w-full p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {/* Main Timeline Column (Left - 50%) */}
          <div className="flex flex-col gap-10">
            <div className="flex items-center gap-4 px-2">
              <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <CalendarDays className="size-4 text-primary" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/60">
                Itinerary Sequence
              </h2>
            </div>

            <div className="flex flex-col" data-testid="timeline-list">
              {dayGroups.map((day) => (
                <DayCard
                  key={day.date}
                  day={day}
                  tripId={tripId}
                  onHoverItem={setSelectedEventId}
                />
              ))}
              {dayGroups.length === 0 && (
                <div className="relative bg-card rounded-[2.5rem] border shadow-2xl p-32 text-center flex flex-col items-center gap-6 opacity-40">
                  <Sparkles className="size-8 text-muted-foreground/40 animate-pulse" />
                  <p className="text-foreground font-black uppercase tracking-[0.2em] text-sm italic">
                    Zero days detected
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Inspector Panel Sidebar (Right - 50%) */}
          <div className="flex flex-col gap-10 pt-4">
            <div className="flex flex-col gap-10 sticky top-24">
              {/* PRIMARY: Journey Visualization */}
              <section className="flex flex-col gap-6">
                <h3 className="text-[11px] uppercase font-black text-muted-foreground tracking-[0.3em]">
                  Visualization
                </h3>
                <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-border/50 shadow-2xl group relative bg-card">
                  <MapView events={events} selectedEventId={selectedEventId} />
                </div>
              </section>

              {/* SECONDARY: Metrics and Details */}
              <div className="flex flex-col gap-6">
                <div className="p-5 rounded-[2.5rem] bg-muted/20 border border-border/50">
                  <h4 className="text-[9px] font-black uppercase text-muted-foreground/50 tracking-[0.3em] mb-4 ml-1">
                    Mission Analytics
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 px-1">
                      <div className="size-7 rounded-xl bg-background border border-border/40 flex items-center justify-center shrink-0">
                        <CalendarDays className="size-3 text-muted-foreground/60" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[7px] uppercase font-black text-muted-foreground/40 leading-none mb-0.5">
                          Duration
                        </span>
                        <span className="text-[11px] font-bold">
                          {String(days).padStart(2, '0')} Days
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 px-1">
                      <div className="size-7 rounded-xl bg-background border border-border/40 flex items-center justify-center shrink-0">
                        <ShieldCheck className="size-3 text-primary/60" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[7px] uppercase font-black text-muted-foreground/40 leading-none mb-0.5">
                          Access
                        </span>
                        <span className="text-[11px] font-black uppercase text-primary tracking-tighter">
                          Private
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function LoadingView() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 gap-4 bg-background">
      <Skeleton className="h-12 w-64 bg-muted" />
      <Skeleton className="h-4 w-48 bg-muted" />
    </div>
  );
}

function ErrorView({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
      <h2 className="text-primary font-black text-2xl uppercase tracking-tighter italic">
        Operational failure
      </h2>
      <p className="text-muted-foreground text-sm mt-2 font-mono uppercase tracking-widest">
        {message}
      </p>
      <a
        href="/"
        className="mt-12 px-10 py-4 bg-primary text-primary-foreground font-black rounded-full text-xs uppercase hover:bg-primary/90 shadow-2xl transition-all"
      >
        Return to Origin
      </a>
    </div>
  );
}
