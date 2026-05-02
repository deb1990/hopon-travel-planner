'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useTrip } from '@/hooks/use-trip';
import { ItineraryHeader } from '@/components/itinerary/itinerary-header';
import { ItineraryMetrics } from '@/components/itinerary/itinerary-metrics';
import { ItineraryRow } from '@/components/itinerary/itinerary-row';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, MapPin, Clock } from 'lucide-react';
import { groupEventsByBase, identifyItineraryGaps } from '@hopon/core';

export default function TripDetail() {
  const params = useParams();
  const tripId = params['id'] as string;
  const { data: trip, isLoading, error } = useTrip(tripId);

  if (error) return <ErrorView message={(error as Error).message} />;
  if (isLoading || !trip) return <LoadingView />;

  const baseGroups = groupEventsByBase(trip.events || []);
  const gaps = identifyItineraryGaps(trip.events || []);

  return (
    <main className="flex min-h-screen flex-col bg-slate-50/50 text-slate-900 transition-colors duration-500">
      <ItineraryHeader tripName={trip.name} tripId={tripId} />

      <div className="flex-1 max-w-7xl mx-auto w-full p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 flex flex-col gap-10">
            <TimelineHeader />
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)] overflow-hidden">
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
 * Sub-components (Private to this file until reused)
 */

function TimelineHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Activity className="size-4 text-blue-600" />
        <h2 className="text-[11px] uppercase text-slate-400 tracking-[0.4em] font-black">
          Timeline Sequence
        </h2>
      </div>
      <div className="h-px flex-1 bg-slate-200/50 ml-8" />
    </div>
  );
}

function TimelineList({ baseGroups, gaps }: { baseGroups: any[]; gaps: any[] }) {
  if (baseGroups.length === 0) {
    return (
      <div className="p-40 text-center flex flex-col items-center gap-4 bg-slate-50/30">
        <Clock className="size-8 text-slate-200" />
        <p className="text-slate-300 font-black uppercase tracking-widest text-[10px]">
          Awaiting Instructions
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {baseGroups.map((group) => (
        <div key={group.stay.id}>
          <div className="bg-slate-50/50 py-6 border-l-4 border-blue-600">
            <ItineraryRow event={group.stay} className="bg-transparent border-none" />
          </div>
          <div className="flex flex-col border-l-2 border-slate-50 ml-10">
            {group.items.map((item: any) => (
              <ItineraryRow
                key={item.id}
                event={item}
                className="hover:bg-blue-50/20 transition-colors"
              />
            ))}
          </div>
          {gaps.find((g) => g.startTime === group.stay.endTime) && (
            <div className="mx-10 my-6 p-5 rounded-[2rem] border border-dashed border-orange-100 bg-orange-50/30 flex items-center justify-between group">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                Temporal Discontinuity
              </span>
              <button className="text-[9px] font-black text-orange-600 uppercase bg-white px-3 py-1.5 rounded-full border border-orange-100 shadow-sm hover:scale-105 transition-all">
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
      <h3 className="text-[11px] uppercase font-black text-slate-300 tracking-[0.4em]">Spatial</h3>
      <div className="aspect-square bg-slate-100 rounded-[4rem] border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group shadow-inner">
        <MapPin className="size-10 text-slate-300 group-hover:text-blue-600 transition-all duration-700 group-hover:scale-110" />
        <span className="z-10 text-[9px] uppercase font-black text-slate-400 mt-8 tracking-[0.3em] group-hover:text-blue-600 transition-colors">
          Coordinates Locked
        </span>
      </div>
    </section>
  );
}

function LoadingView() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 gap-4 bg-background">
      <Skeleton className="h-12 w-64" />
      <Skeleton className="h-4 w-48" />
    </div>
  );
}

function ErrorView({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
      <h2 className="text-blue-600 font-black text-2xl uppercase tracking-tighter">System Alert</h2>
      <p className="text-slate-400 text-sm mt-2 font-mono uppercase tracking-widest">{message}</p>
      <a
        href="/"
        className="mt-8 px-8 py-3 bg-blue-600 text-white font-black rounded-full text-xs uppercase hover:bg-blue-700 shadow-xl transition-all text-center"
      >
        Back to Origin
      </a>
    </div>
  );
}
