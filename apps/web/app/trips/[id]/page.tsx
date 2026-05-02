'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useTrip } from '@/hooks/use-trip';
import { ItineraryHeader } from '@/components/itinerary/itinerary-header';
import { ItineraryMetrics } from '@/components/itinerary/itinerary-metrics';
import { ItineraryRow } from '@/components/itinerary/itinerary-row';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, MapPin, Clock } from 'lucide-react';
import { groupEventsByBase, identifyItineraryGaps, ItineraryEvent, BaseGroup } from '@hopon/core';

/**
 * Detailed itinerary view for a single trip.
 * Composes timeline, metrics, and spatial context.
 */
export default function TripDetail() {
  const params = useParams();
  const tripId = params['id'] as string;
  const { data: trip, isLoading, error } = useTrip(tripId);

  if (error) return <ErrorView message={(error as Error).message} />;
  if (isLoading || !trip) return <LoadingView />;

  const baseGroups = groupEventsByBase(trip.events || []);
  const gaps = identifyItineraryGaps(trip.events || []);

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-500">
      <ItineraryHeader tripName={trip.name} tripId={tripId} />

      <div className="flex-1 max-w-7xl mx-auto w-full p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 flex flex-col gap-10">
            <TimelineHeader />
            <div className="bg-card rounded-[3rem] border shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)] overflow-hidden">
              <TimelineList baseGroups={baseGroups} gaps={gaps} />
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-12 pt-12">
            <ItineraryMetrics days={5} stays={baseGroups.length} />
            <SpatialContext />
          </div>
        </div>
      </div>
    </main>
  );
}

/**
 * Header for the itinerary view with branding and sync status.
 */
function TimelineHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Activity className="size-4 text-primary" />
        <h2 className="text-[11px] uppercase text-muted-foreground tracking-[0.4em] font-black">
          Trip Timeline
        </h2>
      </div>
      <div className="h-px flex-1 bg-border mx-6" />
    </div>
  );
}

/**
 * Renders the chronological list of stays and their activities.
 * Handles gap detection alerts between stays.
 */
function TimelineList({
  baseGroups,
  gaps,
}: {
  baseGroups: BaseGroup[];
  gaps: { startTime: string; endTime: string }[];
}) {
  if (baseGroups.length === 0) {
    return (
      <div className="p-40 text-center flex flex-col items-center gap-4 bg-muted/20">
        <Clock className="size-8 text-muted-foreground" />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">
          No events added yet
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {baseGroups.map((group) => (
        <div key={group.stay.id}>
          <div className="bg-muted/50 py-6 border-l-4 border-primary">
            <ItineraryRow event={group.stay} className="bg-transparent border-none" />
          </div>
          <div className="flex flex-col border-l-2 border-border ml-10">
            {group.items.map((item: ItineraryEvent) => (
              <ItineraryRow
                key={item.id}
                event={item}
                className="hover:bg-primary/5 transition-colors"
              />
            ))}
          </div>
          {gaps.find((g) => g.startTime === group.stay.endTime) && (
            <div className="mx-10 my-6 p-5 rounded-[2rem] border border-dashed border-amber-500/20 bg-amber-500/5 flex items-center justify-between group">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                  Gap in Schedule
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  No accommodation set for this time.
                </span>
              </div>
              <button className="text-[9px] font-black text-amber-600 uppercase bg-background px-3 py-1.5 rounded-full border shadow-sm hover:scale-105 transition-all">
                Add Base
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Visual placeholder for the future interactive map.
 */
function SpatialContext() {
  return (
    <section className="flex flex-col gap-6">
      <h3 className="text-[11px] uppercase font-black text-muted-foreground tracking-[0.4em]">
        Map View
      </h3>
      <div className="aspect-square bg-muted/30 rounded-[4rem] border flex flex-col items-center justify-center relative overflow-hidden group shadow-inner">
        <div className="absolute inset-0 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <MapPin className="size-10 text-muted-foreground group-hover:text-primary transition-all duration-700 group-hover:scale-110" />
        <span className="z-10 text-[9px] uppercase font-black text-muted-foreground mt-8 tracking-[0.3em] group-hover:text-primary transition-colors">
          Map Loading...
        </span>
      </div>
    </section>
  );
}

/**
 * Standardized loading state for the detail view.
 */
function LoadingView() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 gap-4 bg-background">
      <Skeleton className="h-12 w-64" />
      <Skeleton className="h-4 w-48" />
    </div>
  );
}

/**
 * Fallback UI for operational failures.
 */
function ErrorView({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
      <h2 className="text-primary font-black text-2xl uppercase tracking-tighter">
        Something went wrong
      </h2>
      <p className="text-muted-foreground text-sm mt-2 font-medium">{message}</p>
      <a
        href="/"
        className="mt-8 px-8 py-3 bg-primary text-primary-foreground font-black rounded-full text-xs uppercase hover:bg-primary/90 shadow-xl transition-all text-center"
      >
        Back to Dashboard
      </a>
    </div>
  );
}
