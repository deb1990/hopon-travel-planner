import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, Globe } from 'lucide-react';
import { Trip } from '@hopon/core';
import Link from 'next/link';
import { DeleteTripDialog } from './delete-trip-dialog';

interface TripCardProps {
  trip: Trip;
}

/**
 * A high-density card representing a travel journey in the dashboard grid.
 * Separates navigation (clicking the card) from management (the delete action).
 *
 * @param props.trip - The trip metadata to display.
 */
export function TripCard({ trip }: TripCardProps) {
  const dateLabel = trip.startDate
    ? `${new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} — ${
        trip.endDate
          ? new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
          : 'Open Ended'
      }`
    : `Created ${new Date(trip.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;

  return (
    <div className="group relative cursor-pointer">
      {/* Action Layer (Trash Button) - High Z-Index to stay above the Link */}
      <div className="absolute top-8 right-8 z-30">
        <DeleteTripDialog tripId={trip.id} tripName={trip.name} />
      </div>

      {/* Navigation Layer */}
      <Link href={`/trips/${trip.id}`} className="block">
        <Card className="studio-card h-48 rounded-[2rem] overflow-hidden flex flex-col justify-between border-none relative z-10">
          <CardHeader className="pb-0 pt-8 px-8">
            <div className="flex justify-between items-start">
              <div className="size-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                <Globe className="size-5" />
              </div>
              {/* Empty space for the absolute-positioned Trash button */}
              <div className="size-8" />
            </div>
          </CardHeader>
          <CardContent className="pb-8 px-8">
            <CardTitle className="text-xl font-black tracking-tight text-foreground mb-2 truncate pr-4">
              {trip.name}
            </CardTitle>
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground uppercase font-black tracking-widest">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3" />
                <span>{dateLabel}</span>
              </div>
              <div className="size-1 rounded-full bg-border" />
              <span>{trip.visibility}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
