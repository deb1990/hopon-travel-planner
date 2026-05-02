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
import { Plus, Calendar } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const DEMO_USER_ID = 'b07bb29b-67de-4f35-8c85-111c8358436b';
const API_URL = 'http://localhost:4000';

/**
 * Modal dialog for creating a new travel project.
 * Handles form validation and server-side trip initiation.
 */
export function CreateTripDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { name: string; startDate?: string; endDate?: string }) => {
      const res = await fetch(`${API_URL}/trips`, {
        method: 'POST',
        headers: {
          'x-user-id': DEMO_USER_ID,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create journey');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      setOpen(false);
      setName('');
      setStartDate('');
      setEndDate('');
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

    if (trimmedName.length < 3) {
      setError('Journey name must be at least 3 characters');
      return;
    }

    setError(null);
    mutation.mutate({
      name: trimmedName,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          setName('');
          setStartDate('');
          setEndDate('');
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="h-10 px-6 rounded-full bg-blue-600 text-white font-black hover:bg-blue-700 hover:scale-105 transition-all shadow-md active:scale-95 border-none text-xs uppercase tracking-widest cursor-pointer">
          <Plus className="size-4 mr-2 stroke-[4]" />
          New Journey
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Trip</DialogTitle>
            <DialogDescription>
              Give your new journey a name and optional dates to get started.
            </DialogDescription>
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
                    onChange={(e) => setStartDate(e.target.value)}
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
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full h-14 rounded-2xl bg-blue-600 text-white font-black text-base hover:bg-blue-700 cursor-pointer"
            >
              {mutation.isPending ? 'Creating Trip...' : 'Create Journey'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
