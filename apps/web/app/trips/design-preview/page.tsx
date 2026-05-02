'use client';

import React from 'react';
import { ItineraryHeader } from '@/components/itinerary/itinerary-header';
import { ItineraryRow } from '@/components/itinerary/itinerary-row';
import { DayHeader } from '@/components/itinerary/day-header';
import { GapAlert } from '@/components/itinerary/gap-alert';
import { ItineraryGroup } from '@/components/itinerary/itinerary-group';
import { ItineraryMetrics } from '@/components/itinerary/itinerary-metrics';

export default function DesignPreview() {
  const mockStay1: any = {
    id: 'stay-1',
    type: 'STAY',
    title: 'Park Hyatt Tokyo',
    startTime: '2026-10-01T15:00:00Z',
    endTime: '2026-10-03T11:00:00Z',
    locationName: 'Shinjuku, Tokyo',
  };

  const mockStay2: any = {
    id: 'stay-2',
    type: 'STAY',
    title: 'The Ritz-Carlton Kyoto',
    startTime: '2026-10-05T15:00:00Z',
    endTime: '2026-10-07T11:00:00Z',
    locationName: 'Nakagyo Ward, Kyoto',
  };

  const mockActivities: any[] = [
    {
      id: 'act-1',
      type: 'ACTIVITY',
      title: 'Sushi dinner at Kyubey',
      startTime: '2026-10-02T19:00:00Z',
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ItineraryHeader />

      <div className="max-w-7xl mx-auto p-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-2">
          <div className="relative bg-card rounded-[2.5rem] border shadow-2xl overflow-hidden">
            <ItineraryGroup stay={mockStay1}>
              <DayHeader date="Oct 01" className="mt-4" />
              <ItineraryRow event={mockActivities[0]} className="border-none py-3 pl-10" />
            </ItineraryGroup>
          </div>

          <GapAlert days={2} />

          <div className="relative bg-card rounded-[2.5rem] border shadow-2xl overflow-hidden">
            <ItineraryGroup stay={mockStay2}>
              <DayHeader date="Oct 05" className="mt-4" />
            </ItineraryGroup>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-12">
          <ItineraryMetrics days={7} stays={2} />
          <div className="p-8 rounded-[2rem] bg-orange-500/[0.03] border border-orange-500/10">
            <h4 className="text-[10px] font-black uppercase text-orange-600 tracking-[0.3em] mb-4">
              Timeline Polish
            </h4>
            <ul className="text-xs space-y-4 text-muted-foreground font-medium leading-relaxed">
              <li className="flex gap-3">
                <span className="text-orange-600 font-bold shrink-0">01.</span>
                <span>Removed "Day XX" numbering for a cleaner technical look.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-600 font-bold shrink-0">02.</span>
                <span>The date itself now acts as the primary chronological anchor.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
