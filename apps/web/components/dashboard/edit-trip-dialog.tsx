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
import { Pencil } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trip } from '@hopon/core';
import { CONFIG } from '@/lib/config';
import { TripForm, TripFormData } from './trip-form';
import { toast } from 'sonner';

interface EditTripDialogProps {
  trip: Trip;
}

/**
 * Modal dialog for editing an existing travel project.
 * Orchestrates the update flow using the unified TripForm.
 *
 * @param props.trip - The current trip data to pre-fill the form.
 */
export function EditTripDialog({ trip }: EditTripDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: TripFormData) => {
      if (!trip?.id) throw new Error('Invalid Trip ID');
      const res = await fetch(`${CONFIG.API_URL}/trips/${trip.id}`, {
        method: 'PATCH',
        headers: {
          'x-user-id': CONFIG.DEMO_USER_ID,
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trip', trip.id] });
      setOpen(false);
      toast.success(`Journey "${data.name}" edited successfully.`);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const initialData: TripFormData = {
    name: trip.name,
    startDate: trip.startDate ? trip.startDate.split('T')[0] : '',
    endDate: trip.endDate ? trip.endDate.split('T')[0] : '',
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="size-8 bg-transparent hover:bg-primary/10 rounded-full flex items-center justify-center text-slate-500 hover:text-primary transition-all border border-transparent hover:border-primary/20 cursor-pointer"
        >
          <Pencil className="size-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Edit Trip Details</DialogTitle>
          <DialogDescription>Update the name and timeframe for this journey.</DialogDescription>
        </DialogHeader>

        <TripForm
          initialData={initialData}
          onSubmit={(data) => mutation.mutate(data)}
          isPending={mutation.isPending}
          submitLabel="Save Changes"
        />
      </DialogContent>
    </Dialog>
  );
}
