'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Calendar } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trip } from '@hopon/core';

const DEMO_USER_ID = 'b07bb29b-67de-4f35-8c85-111c8358436b';
const API_URL = 'http://localhost:4000';

interface EditTripDialogProps {
  trip: Trip;
}

/**
 * Modal dialog for editing an existing travel project.
 * Handles metadata updates with real-time date validation.
 */
export function EditTripDialog({ trip }: EditTripDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(trip.name);
  const [startDate, setStartDate] = useState(trip.startDate ? trip.startDate.split('T')[0] : '');
  const [endDate, setEndDate] = useState(trip.endDate ? trip.endDate.split('T')[0] : '');
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { name: string; startDate?: string; endDate?: string }) => {
      const res = await fetch(`${API_URL}/trips/${trip.id}`, {
        method: 'PATCH',
        headers: {
          'x-user-id': DEMO_USER_ID,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update journey');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trip', trip.id] });
      setOpen(false);
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Please provide a name for your journey');
      return;
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError('End date cannot be before start date');
      return;
    }

    setError(null);
    mutation.mutate({
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="size-8 bg-transparent hover:bg-primary/10 rounded-full flex items-center justify-center text-slate-500 hover:text-primary transition-all border border-transparent hover:border-primary/20"
        >
          <Pencil className="size-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Trip Details</DialogTitle>
            <DialogDescription>Update the name and timeframe for this journey.</DialogDescription>
          </DialogHeader>

          <div className="py-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-slate-400 px-1">
                Journey Name
              </label>
              <Input
                placeholder="e.g. Summer in Japan 2026"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                autoFocus
                className={error ? 'border-red-500/50 focus-visible:ring-red-500' : ''}
              />
              {error && (
                <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest px-2">
                  {error}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-400 px-1">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                  <Input
                    type="date"
                    className="pl-10"
                    value={startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-400 px-1">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                  <Input
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
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-base hover:opacity-90 cursor-pointer"
            >
              {mutation.isPending ? 'Updating...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
