'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTrip } from '@/hooks/use-trip';
import { ItineraryHeader } from '@/components/itinerary/itinerary-header';
import { ItineraryMetrics } from '@/components/itinerary/itinerary-metrics';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, Sparkles, MapPin } from 'lucide-react';
import { groupEventsByBase, identifyItineraryGaps, BaseGroup as BaseGroupType } from '@hopon/core';
import { calculateTripDuration } from '@/lib/temporal-utils';
import { BaseGroup } from '@/components/itinerary/base-group';
import { GhostGroup } from '@/components/itinerary/ghost-group';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/itinerary/map-view'), {
  ssr: false,
  loading: () => (
    <div className="size-full bg-muted/20 animate-pulse flex items-center justify-center">
      <MapPin className="size-8 text-muted-foreground/10" />
    </div>
  ),
});

export default function TripDetail() {
  const params = useParams();
  const tripId = params['id'] as string;
  const { data: trip, isLoading, error } = useTrip(tripId);

  // Selection state for Map Sync
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  if (error) return <ErrorView message={(error as Error).message} />;
  if (isLoading || !trip) return <LoadingView />;

  const events = [...(trip.events || [])].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );

  const startDate = trip.startDate ?? undefined;
  const endDate = trip.endDate ?? undefined;

  const baseGroups = groupEventsByBase(events);
  const gaps = identifyItineraryGaps(events, startDate, endDate);
  const days = calculateTripDuration(startDate, endDate);

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-500">
      <ItineraryHeader trip={trip} />

      <div className="flex-1 max-w-7xl mx-auto w-full p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 flex flex-col gap-10">
            <div className="flex items-center gap-4 px-2">
              <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <CalendarDays className="size-4 text-primary" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/60">
                Itinerary Sequence
              </h2>
            </div>

            <div className="flex flex-col" data-testid="timeline-list">
              <TimelineList
                tripId={tripId}
                baseGroups={baseGroups}
                gaps={gaps}
                tripStartDate={startDate}
                tripEndDate={endDate}
                onHoverEvent={setSelectedEventId}
              />
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-12 pt-4">
            <div className="flex flex-col gap-8 sticky top-24">
              <ItineraryMetrics days={days} stays={baseGroups.length} />

              <section className="flex flex-col gap-6">
                <h3 className="text-[11px] uppercase font-black text-muted-foreground tracking-[0.3em]">
                  Spatial Visualization
                </h3>
                <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-border/50 shadow-inner group relative">
                  <MapView events={events} selectedEventId={selectedEventId} />
                </div>
              </section>

              <div className="p-6 rounded-[2rem] bg-muted/30 border border-border/50">
                <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-4">
                  Workspace Details
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-muted-foreground font-medium">Author</span>
                    <span className="text-foreground font-bold italic underline decoration-primary/30 underline-offset-4">
                      Demo User
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-muted-foreground font-medium">Visibility</span>
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-black uppercase tracking-tighter text-[9px] border border-primary/20">
                      Private
                    </span>
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

function TimelineList({
  tripId,
  baseGroups,
  gaps,
  tripStartDate,
  tripEndDate,
  onHoverEvent,
}: {
  tripId: string;
  baseGroups: BaseGroupType[];
  gaps: { startTime: string; endTime: string; numDays: number }[];
  tripStartDate?: string;
  tripEndDate?: string;
  onHoverEvent: (id: string | null) => void;
}) {
  if (baseGroups.length === 0 && gaps.length === 0) {
    return (
      <div className="relative bg-card rounded-[2.5rem] border shadow-2xl p-32 text-center flex flex-col items-center gap-6 opacity-40">
        <Sparkles className="size-8 text-muted-foreground/40 animate-pulse" />
        <p className="text-foreground font-black uppercase tracking-[0.2em] text-sm italic">
          Empty Itinerary
        </p>
      </div>
    );
  }

  const startGap = tripStartDate ? gaps.find((g) => g.startTime === tripStartDate) : null;
  const endGap = tripEndDate ? gaps.find((g) => g.endTime === tripEndDate) : null;

  return (
    <div className="flex flex-col gap-2">
      {startGap && (
        <GhostGroup tripId={tripId} startTime={startGap.startTime} numDays={startGap.numDays} />
      )}

      {baseGroups.map((group) => {
        const gapAfter = gaps.find(
          (g) => g.startTime === group.stay.endTime && g !== startGap && g !== endGap,
        );
        return (
          <React.Fragment key={group.stay.id}>
            <div
              onMouseEnter={() => onHoverEvent(group.stay.id)}
              onMouseLeave={() => onHoverEvent(null)}
            >
              <BaseGroup stay={group.stay} items={group.items} onHoverItem={onHoverEvent} />
            </div>
            {gapAfter && (
              <GhostGroup
                tripId={tripId}
                startTime={gapAfter.startTime}
                numDays={gapAfter.numDays}
              />
            )}
          </React.Fragment>
        );
      })}

      {endGap && endGap !== startGap && (
        <GhostGroup tripId={tripId} startTime={endGap.startTime} numDays={endGap.numDays} />
      )}
    </div>
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
