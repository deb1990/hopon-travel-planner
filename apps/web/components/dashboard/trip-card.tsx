import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import { Trip } from '@hopon/core';
import Link from 'next/link';

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  return (
    <Link href={`/trips/${trip.id}`} className="group block">
      <Card className="hover:border-primary/50 transition-all duration-300 bg-secondary/10 group-hover:bg-secondary/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
              {trip.name}
            </CardTitle>
            <ArrowRight className="size-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 text-xs text-muted-foreground uppercase tracking-widest font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="size-3" />
              <span>Created {new Date(trip.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-3" />
              <span>{trip.visibility}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
