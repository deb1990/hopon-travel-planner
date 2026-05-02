'use client';

import { useQuery } from '@tanstack/react-query';
import { ItineraryRow } from '@/components/itinerary/itinerary-row';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, ChevronLeft, Clock, Activity } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { groupEventsByBase, identifyItineraryGaps, ItineraryEvent } from '@hopon/core';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const DEMO_USER_ID = 'b07bb29b-67de-4f35-8c85-111c8358436b';
const API_URL = 'http://localhost:4000';

export default function TripDetail() {
  const params = useParams();
  const tripId = params['id'] as string;

  const {
    data: trip,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/trips/${tripId}`, {
        headers: { 'x-user-id': DEMO_USER_ID },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    },
    enabled: !!tripId,
  });

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
        <h2 className="text-blue-600 font-black text-2xl uppercase tracking-tighter">
          System Alert
        </h2>
        <p className="text-slate-400 text-sm mt-2 font-mono uppercase tracking-widest">
          {(error as Error).message}
        </p>
        <Link
          href="/"
          className="mt-8 px-8 py-3 bg-blue-600 text-white font-black rounded-full text-xs uppercase hover:bg-blue-700 shadow-xl transition-all"
        >
          Back to Origin
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24 gap-4 bg-background">
        <Skeleton className="h-12 w-64 bg-slate-50" />
        <Skeleton className="h-4 w-48 bg-slate-50" />
      </div>
    );
  }

  const events = (trip?.events || []) as ItineraryEvent[];
  const baseGroups = groupEventsByBase(events);
  const gaps = identifyItineraryGaps(events);

  return (
    <main className="flex min-h-screen flex-col bg-slate-50/50 text-slate-900 transition-colors duration-500">
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl px-8 py-5">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="size-10 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-white hover:border-blue-100 transition-all duration-300 group"
            >
              <ChevronLeft className="size-5 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                {trip?.name || 'Exploring...'}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">
                  Deployment ID:
                </span>
                <span className="text-[10px] text-blue-600 font-mono font-bold tracking-tighter">
                  {tripId?.slice(0, 8)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
              <div className="size-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                Active Link
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 flex flex-col gap-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="size-4 text-blue-600" />
                <h2 className="text-[11px] uppercase text-slate-400 tracking-[0.4em] font-black">
                  Timeline Sequence
                </h2>
              </div>
              <div className="h-px flex-1 bg-slate-200/50 ml-8" />
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)] overflow-hidden">
              <div className="flex flex-col">
                {baseGroups.length > 0 ? (
                  baseGroups.map((group) => (
                    <div key={group.stay.id}>
                      <div className="bg-slate-50/50 py-6 border-l-4 border-blue-600">
                        <ItineraryRow event={group.stay} className="bg-transparent border-none" />
                      </div>
                      <div className="flex flex-col border-l-2 border-slate-50 ml-10">
                        {group.items.map((item) => (
                          <ItineraryRow
                            key={item.id}
                            event={item}
                            className="hover:bg-blue-50/20 transition-colors"
                          />
                        ))}
                      </div>
                      {gaps.find((g) => g.startTime === group.stay.endTime) && (
                        <div className="mx-10 my-6 p-5 rounded-[2rem] border border-dashed border-orange-100 bg-orange-50/30 flex items-center justify-between group">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                              Temporal Discontinuity Detected
                            </span>
                            <span className="text-xs text-orange-900/40 font-medium">
                              No accommodation assigned for this interval.
                            </span>
                          </div>
                          <button className="text-[9px] font-black text-orange-600 uppercase bg-white px-3 py-1.5 rounded-full border border-orange-100 shadow-sm hover:scale-105 transition-all">
                            Assign Base
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-40 text-center flex flex-col items-center gap-4 bg-slate-50/30">
                    <div className="size-16 rounded-full bg-white border border-slate-100 flex items-center justify-center mb-4">
                      <Clock className="size-8 text-slate-200" />
                    </div>
                    <p className="text-slate-300 font-black uppercase tracking-widest text-[10px]">
                      Awaiting Instructions
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-12 pt-12">
            <section className="flex flex-col gap-6">
              <h3 className="text-[11px] uppercase font-black text-slate-300 tracking-[0.4em]">
                Analytics
              </h3>
              <div className="grid grid-cols-1 gap-5">
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-100 transition-all duration-500">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-tight">
                      Mission Duration
                    </span>
                    <span className="text-3xl font-black text-slate-900">
                      05 <span className="text-xs text-blue-600/50 italic">DAYS</span>
                    </span>
                  </div>
                  <div className="size-14 rounded-3xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-500 group-hover:text-white group-hover:shadow-xl">
                    <Clock className="size-6" />
                  </div>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-6">
              <h3 className="text-[11px] uppercase font-black text-slate-300 tracking-[0.4em]">
                Spatial
              </h3>
              <div className="aspect-square bg-slate-100 rounded-[4rem] border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group shadow-inner">
                <div className="absolute inset-0 bg-white/40 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <MapPin className="size-10 text-slate-300 group-hover:text-blue-600 transition-all duration-700 group-hover:scale-110" />
                <span className="z-10 text-[9px] uppercase font-black text-slate-400 mt-8 tracking-[0.3em] group-hover:text-blue-600 transition-colors">
                  Coordinates Locked
                </span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
