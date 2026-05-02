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

const DEMO_USER_ID = 'b07bb29b-67de-4f35-8c85-111c8358436b';
const API_URL = 'http://localhost:4000';

interface DeleteTripDialogProps {
  tripId: string;
  tripName: string;
}

export function DeleteTripDialog({ tripId, tripName }: DeleteTripDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/trips/${tripId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': DEMO_USER_ID },
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
          className="size-8 bg-transparent hover:bg-red-500/10 rounded-full flex items-center justify-center text-slate-500 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
        >
          <Trash2 className="size-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <div className="size-12 bg-red-500/10 rounded-2xl flex items-center justify-center mb-4 border border-red-500/20">
            <AlertCircle className="size-6 text-red-500" />
          </div>
          <DialogTitle className="text-red-500">Terminate Expedition?</DialogTitle>
          <DialogDescription>
            You are about to permanently delete{' '}
            <span className="font-bold text-foreground">{tripName}</span>. This action is
            irreversible and all spatial data will be purged.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-8">
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
            className="flex-1 rounded-2xl h-12 bg-red-600 hover:bg-red-700 text-white font-black"
          >
            {mutation.isPending ? 'Purging...' : 'Confirm Purge'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
