'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useTrip } from '@/hooks/use-trip';
import { ItineraryHeader } from '@/components/itinerary/itinerary-header';
import { ItineraryMetrics } from '@/components/itinerary/itinerary-metrics';
import { ItineraryRow } from '@/components/itinerary/itinerary-row';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, CalendarDays, Plus, Sparkles } from 'lucide-react';
import { groupEventsByBase, identifyItineraryGaps, ItineraryEvent, BaseGroup } from '@hopon/core';
import { Button } from '@/components/ui/button';

/**
 * Detailed itinerary view for a single trip.
 * Composes timeline, metrics, and spatial context in a professional workspace layout.
 */
export default function TripDetail() {
  const params = useParams();
  const tripId = params['id'] as string;
  const { data: trip, isLoading, error } = useTrip(tripId);

  if (error) return <ErrorView message={(error as Error).message} />;
  if (isLoading || !trip) return <LoadingView />;

  const events = trip.events || [];
  const baseGroups = groupEventsByBase(events);
  const gaps = identifyItineraryGaps(events);

  // Calculate dynamic duration
  const days = calculateDays(trip.startDate, trip.endDate);

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-500">
      <ItineraryHeader trip={trip} tripId={tripId} />

      <div className="flex-1 max-w-7xl mx-auto w-full p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Timeline Column */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CalendarDays className="size-4 text-primary" />
                </div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">
                  Timeline Sequence
                </h2>
              </div>
              <Button
                size="sm"
                className="rounded-full bg-primary text-primary-foreground font-bold h-8 px-4 text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
              >
                <Plus className="size-3 mr-1.5 stroke-[3]" />
                Add Entry
              </Button>
            </div>

            {/* Container for the timeline with the background thread */}
            <div className="relative bg-card rounded-[2.5rem] border shadow-2xl overflow-hidden min-h-[400px]">
              {/* Vertical Thread Line */}
              <div className="timeline-thread z-0" />

              <div className="flex flex-col relative z-10">
                <TimelineList baseGroups={baseGroups} gaps={gaps} />
              </div>
            </div>
          </div>

          {/* Inspector Panel Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-12 pt-4">
            <div className="flex flex-col gap-8 sticky top-24">
              <ItineraryMetrics days={days} stays={baseGroups.length} />
              <SpatialContext />

              {/* Secondary Meta Panel */}
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

/**
 * Calculates the total number of days between two ISO dates.
 * Defaults to 1 if no range is provided.
 */
function calculateDays(start?: string, end?: string): number {
  if (!start || !end) return 1;
  const s = new Date(start);
  const e = new Date(end);
  const diff = e.getTime() - s.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
}

function TimelineList({
  baseGroups,
  gaps,
}: {
  baseGroups: BaseGroup[];
  gaps: { startTime: string; endTime: string }[];
}) {
  if (baseGroups.length === 0) {
    return (
      <div className="p-32 text-center flex flex-col items-center gap-6">
        <div className="size-20 rounded-[2.5rem] bg-muted/30 border border-border/50 flex items-center justify-center mb-2 shadow-inner">
          <Sparkles className="size-8 text-muted-foreground/40 animate-pulse" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-foreground font-black uppercase tracking-[0.2em] text-sm italic">
            Empty Itinerary
          </p>
          <p className="text-muted-foreground text-xs font-medium max-w-[200px]">
            Begin your journey by defining your first accommodation base.
          </p>
        </div>
        <Button className="rounded-full bg-primary text-primary-foreground font-black h-12 px-8 text-[11px] uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
          <Plus className="size-4 mr-2 stroke-[3]" />
          Create First Entry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {baseGroups.map((group) => (
        <div key={group.stay.id} className="relative">
          {/* Base Header Indicator */}
          <div className="absolute left-[31px] top-10 -translate-x-1/2 size-3 rounded-full bg-primary ring-4 ring-background z-20 shadow-[0_0_15px_rgba(var(--primary),0.5)]" />

          <div className="bg-muted/50 py-10 border-b border-border/40">
            <ItineraryRow event={group.stay} className="bg-transparent border-none py-0 px-16" />
          </div>

          <div className="flex flex-col py-4">
            {group.items.map((item: ItineraryEvent) => (
              <div key={item.id} className="relative">
                {/* Item Indicator Dot */}
                <div className="absolute left-[31px] top-1/2 -translate-y-1/2 -translate-x-1/2 size-1.5 rounded-full bg-muted-foreground/30 ring-2 ring-background z-20" />
                <ItineraryRow
                  event={item}
                  className="pl-24 border-none py-4 hover:bg-primary/[0.03]"
                />
              </div>
            ))}
          </div>

          {/* Gap Alert Injection */}
          {gaps.find((g) => g.startTime === group.stay.endTime) && (
            <div className="mx-16 my-8 p-6 rounded-[2rem] border border-dashed border-amber-500/20 bg-amber-500/[0.02] flex items-center justify-between group hover:bg-amber-500/[0.05] transition-all duration-300">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
                  Temporal Gap Detected
                </span>
                <span className="text-[11px] text-amber-600/50 font-medium tracking-tight">
                  No accommodation assigned for this interval.
                </span>
              </div>
              <button className="text-[9px] font-black text-amber-600 uppercase bg-background px-4 py-2 rounded-full border border-amber-500/20 shadow-sm hover:scale-105 hover:border-amber-500 transition-all cursor-pointer">
                Assign Base
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SpatialContext() {
  return (
    <section className="flex flex-col gap-6">
      <h3 className="text-[11px] uppercase font-black text-muted-foreground tracking-[0.3em]">
        Spatial Visualization
      </h3>
      <div className="aspect-[4/3] bg-muted/40 rounded-[2.5rem] border border-border/50 flex flex-col items-center justify-center relative overflow-hidden group shadow-inner">
        <div className="absolute inset-0 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <MapPin className="size-10 text-muted-foreground/30 group-hover:text-primary transition-all duration-700 group-hover:scale-110" />
        <span className="z-10 text-[9px] uppercase font-black text-muted-foreground/50 mt-8 tracking-[0.4em] group-hover:text-primary transition-colors">
          Coordinates Locked
        </span>
      </div>
    </section>
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
        className="mt-12 px-10 py-4 bg-primary text-primary-foreground font-black rounded-full text-xs uppercase hover:bg-primary/90 shadow-2xl hover:scale-105 transition-all text-center"
      >
        Return to Origin
      </a>
    </div>
  );
}
