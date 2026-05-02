'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CONFIG } from '@/lib/config';
import { TripForm, TripFormData } from './trip-form';

/**
 * Modal dialog for initiating a new travel project.
 * Orchestrates the creation flow using the unified TripForm.
 */
export function CreateTripDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: TripFormData) => {
      const res = await fetch(`${CONFIG.API_URL}/trips`, {
        method: 'POST',
        headers: {
          'x-user-id': CONFIG.DEMO_USER_ID,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create journey');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-10 px-6 rounded-full bg-blue-600 text-white font-black hover:bg-blue-700 hover:scale-105 transition-all shadow-md active:scale-95 border-none text-xs uppercase tracking-widest cursor-pointer">
          <Plus className="size-4 mr-2 stroke-[4]" />
          New Journey
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Trip</DialogTitle>
          <DialogDescription>
            Give your new journey a name and optional dates to get started.
          </DialogDescription>
        </DialogHeader>

        <TripForm
          onSubmit={(data) => mutation.mutate(data)}
          isPending={mutation.isPending}
          submitLabel="Create Journey"
        />
      </DialogContent>
    </Dialog>
  );
}
