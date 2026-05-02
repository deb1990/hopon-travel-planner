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
import { Trash2, AlertCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CONFIG } from '@/lib/config';

interface DeleteTripDialogProps {
  tripId: string;
  tripName: string;
}

/**
 * Safety confirmation dialog for trip removal.
 * Prevents event propagation to avoid accidental navigation to trip details.
 *
 * @param props.tripId - The ID of the trip to delete.
 * @param props.tripName - The name of the trip for confirmation display.
 */
export function DeleteTripDialog({ tripId, tripName }: DeleteTripDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${CONFIG.API_URL}/trips/${tripId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': CONFIG.DEMO_USER_ID },
      });
      if (!res.ok) throw new Error('Failed to delete trip');
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
        <button
          onClick={(e) => e.stopPropagation()}
          className="size-8 bg-transparent hover:bg-red-500/10 rounded-full flex items-center justify-center text-slate-500 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20 cursor-pointer"
        >
          <Trash2 className="size-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <div className="size-12 bg-red-500/10 rounded-2xl flex items-center justify-center mb-4 border border-red-500/20">
            <AlertCircle className="size-6 text-red-500" />
          </div>
          <DialogTitle className="text-red-500">Delete Trip?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-bold text-foreground">{tripName}</span>? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-8 gap-3 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="flex-1 rounded-2xl h-12"
          >
            Cancel
          </Button>
          <Button
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
            className="flex-1 rounded-2xl h-12 bg-red-600 hover:bg-red-700 text-white font-black cursor-pointer"
          >
            {mutation.isPending ? 'Deleting...' : 'Delete Trip'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
