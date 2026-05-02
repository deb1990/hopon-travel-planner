import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, Globe, MapPin } from 'lucide-react';
import { Trip } from '@hopon/core';
import Link from 'next/link';

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  return (
    <Link href={`/trips/${trip.id}`} className="group block">
      <Card className="studio-card h-48 rounded-[2rem] overflow-hidden flex flex-col justify-between border-none">
        <CardHeader className="pb-0 pt-8 px-8">
          <div className="flex justify-between items-start">
            <div className="size-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
              <Globe className="size-5" />
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <MapPin className="size-3 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                Active
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-8 px-8">
          <CardTitle className="text-xl font-black tracking-tight text-slate-900 mb-2">
            {trip.name}
          </CardTitle>
          <div className="flex items-center gap-4 text-[10px] text-slate-400 uppercase font-black tracking-widest">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3" />
              <span>
                {new Date(trip.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="size-1 rounded-full bg-slate-200" />
            <span>{trip.visibility}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
