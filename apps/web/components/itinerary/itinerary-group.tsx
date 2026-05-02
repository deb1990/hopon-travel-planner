import React from 'react';
import { ItineraryRow } from './itinerary-row';
import { ItineraryEvent } from '@hopon/core';

interface ItineraryGroupProps {
  stay: ItineraryEvent;
  children: React.ReactNode;
}

/**
 * Groups itinerary items under a "Stay" base with a visual thread line.
 * Supports multi-day children.
 */
export function ItineraryGroup({ stay, children }: ItineraryGroupProps) {
  return (
    <div className="relative flex flex-col group/itinerary-group bg-card mb-8">
      {/* The Anchor Row (Stay) */}
      <div className="relative z-10 border-b border-border/40">
        <ItineraryRow event={stay} className="bg-primary/[0.04] py-8 border-none" />
      </div>

      {/* The Thread (Persistent Vertical Line) */}
      <div className="absolute left-[31px] top-[90px] bottom-0 w-px bg-gradient-to-b from-primary via-primary/30 to-border/40 z-0 opacity-60 group-hover/itinerary-group:opacity-100 transition-opacity duration-500" />

      {/* Nested Days & Activities */}
      <div className="flex flex-col relative z-10 pl-6 pb-6">{children}</div>
    </div>
  );
}
