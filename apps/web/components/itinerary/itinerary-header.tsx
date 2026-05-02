import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Share2, MoreHorizontal } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';

interface ItineraryHeaderProps {
  tripName?: string;
  tripId: string;
}

/**
 * Sticky header for the trip detail view.
 * Provides professional breadcrumb navigation and mission control actions.
 *
 * @param props.tripName - The display name of the trip.
 * @param props.tripId - Unique identifier for the trip.
 */
export function ItineraryHeader({ tripName, tripId }: ItineraryHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl px-8 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors group"
          >
            <ChevronLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Dashboard
          </Link>
          <div className="h-4 w-px bg-border/60" />
          <div className="flex flex-col">
            <h1 className="text-xl font-[1000] tracking-tight text-foreground uppercase italic">
              {tripName || 'Exploring...'}
            </h1>
            <span className="text-[9px] text-primary/60 font-mono font-bold tracking-tighter">
              {tripId}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="size-8 rounded-xl hover:bg-primary/5">
            <Share2 className="size-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8 rounded-xl hover:bg-primary/5">
            <MoreHorizontal className="size-4 text-muted-foreground" />
          </Button>
          <div className="w-px h-4 bg-border/60 mx-1" />
          <ThemeToggle />
          <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10 ml-2">
            <div className="size-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
            <span className="text-[9px] font-black uppercase text-primary/70 tracking-widest">
              Active Sync
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
