'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Link as LinkIcon, Home, Loader2, Hash } from 'lucide-react';
import { ItineraryEvent, resolveLocation } from '@hopon/core';

interface EventFormProps {
  type: 'STAY' | 'ACTIVITY' | 'TRAVEL';
  initialData?: ItineraryEvent;
  initialDate?: string;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

/**
 * Reusable form logic for creating and editing itinerary events.
 * Features separate Location and Plus Code fields.
 */
export function EventForm({
  type,
  initialData,
  initialDate,
  onSubmit,
  isSubmitting,
}: EventFormProps) {
  const isStay = type === 'STAY';
  const [isResolving, setIsResolving] = useState(false);

  const getStartTime = () => {
    if (initialData) {
      return isStay
        ? new Date(initialData.startTime).toISOString().split('T')[0]
        : new Date(initialData.startTime).toISOString().slice(0, 16);
    }
    if (initialDate) {
      return isStay
        ? new Date(initialDate).toISOString().split('T')[0]
        : new Date(initialDate).toISOString().slice(0, 16);
    }
    return '';
  };

  const getEndTime = () => {
    if (initialData?.endTime) {
      return isStay
        ? new Date(initialData.endTime).toISOString().split('T')[0]
        : new Date(initialData.endTime).toISOString().slice(0, 16);
    }
    return isStay && initialDate ? new Date(initialDate).toISOString().split('T')[0] : '';
  };

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    locationName: initialData?.locationName || '',
    plusCode: initialData?.plusCode || '',
    startTime: getStartTime(),
    endTime: getEndTime(),
    bookingLink: (initialData as any)?.bookingLink || '',
    accommodationType: (initialData as any)?.accommodationType || 'Hotel',
    notes: initialData?.notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResolving(true);

    try {
      // 1. Resolve coordinates. Priority: Dedicated Plus Code field -> Location field (legacy check)
      const resolutionString = formData.plusCode || formData.locationName;
      const coords = await resolveLocation(resolutionString);

      const startStr = formData.startTime || new Date().toISOString();
      const finalStart = isStay ? new Date(startStr + 'T00:00:00Z') : new Date(startStr);

      let finalEnd: Date | null = null;
      if (formData.endTime) {
        finalEnd = isStay ? new Date(formData.endTime + 'T23:59:59Z') : new Date(formData.endTime);
      }

      onSubmit({
        ...formData,
        type,
        startTime: finalStart.toISOString(),
        endTime: finalEnd?.toISOString() || null,
        lat: coords ? coords[0] : (initialData as any)?.lat || null,
        lng: coords ? coords[1] : (initialData as any)?.lng || null,
      });
    } finally {
      setIsResolving(false);
    }
  };

  const loading = isSubmitting || isResolving;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-4">
      {/* 1. PRIMARY LOCATION DATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
            Location Name
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40" />
            <Input
              required
              placeholder="e.g. Viking Museum"
              value={formData.locationName}
              onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
              className="rounded-2xl bg-muted/30 border-border/40 pl-10 h-12 text-sm font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
            Plus Code (Opt)
          </label>
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40" />
            <Input
              placeholder="e.g. FM5C+X5"
              value={formData.plusCode}
              onChange={(e) => setFormData({ ...formData, plusCode: e.target.value })}
              className="rounded-2xl bg-muted/30 border-border/40 pl-10 h-12 text-xs font-mono"
            />
            {isResolving && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 size-3.5 text-primary animate-spin" />
            )}
          </div>
        </div>
      </div>

      {/* 2. TITLE FIELD */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
          {isStay ? 'Accommodation Name' : 'Activity Title'}
        </label>{' '}
        <Input
          required
          placeholder={isStay ? 'e.g. The Thief Hotel' : 'e.g. Afternoon Sightseeing'}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="rounded-2xl bg-muted/30 border-border/40 focus:ring-primary/20 h-12 text-sm font-bold"
        />
      </div>

      {/* 3. METADATA (STAY ONLY) */}
      {isStay && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
              Stay Type
            </label>
            <div className="relative">
              <Home className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 pointer-events-none" />
              <select
                value={formData.accommodationType}
                onChange={(e) => setFormData({ ...formData, accommodationType: e.target.value })}
                className="flex h-12 w-full items-center justify-between rounded-2xl border border-border/40 bg-muted/30 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none font-bold"
              >
                <option value="Hotel">Hotel</option>
                <option value="AirBNB">AirBNB</option>
                <option value="Camping">Camping</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
              Booking Link
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40" />
              <Input
                type="url"
                placeholder="https://..."
                value={formData.bookingLink}
                onChange={(e) => setFormData({ ...formData, bookingLink: e.target.value })}
                className="rounded-2xl bg-muted/30 border-border/40 pl-10 h-12 text-[10px] font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. TEMPORAL DATA */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
            {isStay ? 'Check-in Date' : 'Date & Time'}
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40" />
            <Input
              type={isStay ? 'date' : 'datetime-local'}
              required
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="rounded-2xl bg-muted/30 border-border/40 pl-10 h-12 text-xs font-mono"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
            {isStay ? 'Check-out Date' : 'End Time (Opt)'}
          </label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40" />
            <Input
              type={isStay ? 'date' : 'datetime-local'}
              required={isStay}
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="rounded-2xl bg-muted/30 border-border/40 pl-10 h-12 text-xs font-mono"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="mt-4 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-[10px] h-14 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
      >
        {loading
          ? isResolving
            ? 'Resolving Coordinates...'
            : 'Syncing...'
          : initialData
            ? 'Update Timeline'
            : `Save ${type.toLowerCase()}`}
      </Button>
    </form>
  );
}
