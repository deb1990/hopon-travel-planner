'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

export interface TripFormData {
  name: string;
  startDate?: string;
  endDate?: string;
}

interface TripFormProps {
  initialData?: TripFormData;
  onSubmit: (data: TripFormData) => void;
  isPending: boolean;
  submitLabel: string;
}

/**
 * A reusable form for creating or editing trip metadata.
 */
export function TripForm({ initialData, onSubmit, isPending, submitLabel }: TripFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Please provide a name for your journey');
      return;
    }

    if (trimmedName.length < 3) {
      setError('Journey name must be at least 3 characters');
      return;
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError('End date cannot be before start date');
      return;
    }

    setError(null);
    onSubmit({
      name: trimmedName,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    if (error) setError(null);
    if (endDate && val && new Date(val) > new Date(endDate)) {
      setEndDate('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" aria-label="trip-form">
      <div className="py-4 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="trip-name"
            className="text-[10px] font-black uppercase text-slate-400 px-1"
          >
            Journey Name
          </label>
          <Input
            id="trip-name"
            placeholder="e.g. Summer in Japan 2026"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            autoFocus
            className={error && !name.trim() ? 'border-red-500/50 focus-visible:ring-red-500' : ''}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="start-date"
              className="text-[10px] font-black uppercase text-slate-400 px-1"
            >
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              <Input
                id="start-date"
                type="date"
                className="pl-10"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="end-date"
              className="text-[10px] font-black uppercase text-slate-400 px-1"
            >
              End Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              <Input
                id="end-date"
                type="date"
                className="pl-10"
                value={endDate}
                min={startDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  if (error) setError(null);
                }}
              />
            </div>
          </div>
        </div>
        <div className="min-h-[1.25rem]">
          {error && (
            <span
              role="alert"
              data-testid="error-message"
              className="text-[10px] text-red-500 font-bold uppercase tracking-widest px-2"
            >
              {error}
            </span>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-14 rounded-2xl bg-blue-600 text-white font-black text-base hover:bg-blue-700 cursor-pointer"
      >
        {isPending ? 'Syncing...' : submitLabel}
      </Button>
    </form>
  );
}
