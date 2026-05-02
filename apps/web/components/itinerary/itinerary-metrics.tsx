import React from 'react';
import { Clock, MapPin } from 'lucide-react';

interface ItineraryMetricsProps {
  days: number;
  stays: number;
}

export function ItineraryMetrics({ days, stays }: ItineraryMetricsProps) {
  return (
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
              {String(days).padStart(2, '0')}{' '}
              <span className="text-xs text-blue-600/50 italic uppercase">DAYS</span>
            </span>
          </div>
          <div className="size-14 rounded-3xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-500 group-hover:text-white group-hover:shadow-xl">
            <Clock className="size-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-100 transition-all duration-500">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-tight">
              Total Stops
            </span>
            <span className="text-3xl font-black text-slate-900">
              {String(stays).padStart(2, '0')}{' '}
              <span className="text-xs text-blue-600/50 italic uppercase">STAYS</span>
            </span>
          </div>
          <div className="size-14 rounded-3xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-500 group-hover:text-white group-hover:shadow-xl">
            <MapPin className="size-6" />
          </div>
        </div>
      </div>
    </section>
  );
}
