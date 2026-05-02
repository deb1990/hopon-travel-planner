import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface ItineraryHeaderProps {
  tripName?: string;
  tripId: string;
}

export function ItineraryHeader({ tripName, tripId }: ItineraryHeaderProps) {
  return (
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
              {tripName || 'Exploring...'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">
                Trip ID:
              </span>
              <span className="text-[10px] text-blue-600 font-mono font-bold tracking-tighter">
                {tripId.slice(0, 8)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
            <div className="size-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
              Live Sync
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
