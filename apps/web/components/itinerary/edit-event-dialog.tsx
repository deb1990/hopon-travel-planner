'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Settings2 } from 'lucide-react';
import { EventForm } from './event-form';
import { CONFIG } from '@/lib/config';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { ItineraryEvent } from '@hopon/core';

interface EditEventDialogProps {
  event: ItineraryEvent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * High-density dialog for updating existing itinerary entries.
 */
export function EditEventDialog({ event, open, onOpenChange }: EditEventDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleUpdate = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${CONFIG.API_URL}/trips/${event.tripId}/events/${event.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': CONFIG.DEMO_USER_ID,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to update event');

      toast.success('Timeline entry updated');
      queryClient.invalidateQueries({ queryKey: ['trip', event.tripId] });
      onOpenChange(false);
    } catch {
      toast.error('Update failed. Check your network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-[2.5rem] border-none shadow-2xl bg-background/95 backdrop-blur-2xl p-8">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
              <Settings2 className="size-5 stroke-[3]" />
            </div>
            <DialogTitle className="text-2xl font-[1000] tracking-tighter uppercase italic leading-none">
              Modify Entry
            </DialogTitle>
          </div>
        </DialogHeader>

        <EventForm
          type={event.type as any}
          initialData={event}
          onSubmit={handleUpdate}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
