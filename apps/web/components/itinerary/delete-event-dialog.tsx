'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CONFIG } from '@/lib/config';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { ItineraryEvent } from '@hopon/core';

interface DeleteEventDialogProps {
  event: ItineraryEvent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Confirmation dialog for removing itinerary entries.
 */
export function DeleteEventDialog({ event, open, onOpenChange }: DeleteEventDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`${CONFIG.API_URL}/trips/${event.tripId}/events/${event.id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': CONFIG.DEMO_USER_ID,
        },
      });

      if (!res.ok) throw new Error('Deletion failed');

      toast.error('Timeline entry removed');
      queryClient.invalidateQueries({ queryKey: ['trip', event.tripId] });
      onOpenChange(false);
    } catch {
      toast.error('Could not delete entry. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] rounded-[2rem] border-none shadow-2xl p-8 bg-background/95 backdrop-blur-xl">
        <DialogHeader className="flex flex-col items-center text-center gap-4">
          <div className="size-16 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center shadow-inner">
            <Trash2 className="size-8" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-xl font-black uppercase tracking-tight italic">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-muted-foreground max-w-[240px]">
              Are you sure you want to remove{' '}
              <span className="text-foreground font-bold italic">"{event.title}"</span>? This action
              is permanent.
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="grid grid-cols-2 gap-3 mt-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-xl font-bold uppercase tracking-widest text-[10px] h-12"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-xl bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest text-[10px] h-12 shadow-lg shadow-red-500/20"
          >
            {isDeleting ? 'Removing...' : 'Delete Entry'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
