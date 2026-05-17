'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Plane } from 'lucide-react';
import { EventForm } from './event-form';
import { CONFIG } from '@/lib/config';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface AddEventDialogProps {
  tripId: string;
  type: 'STAY' | 'ACTIVITY' | 'TRAVEL' | 'TRANSIT';
  initialDate?: string;
  className?: string;
}

/**
 * Technical dialog for adding new entries to the itinerary.
 * Uses the consistent "Middle Ground" trigger style for all actions.
 */
export function AddEventDialog({ tripId, type, initialDate, className }: AddEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleCreate = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${CONFIG.API_URL}/trips/${tripId}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': CONFIG.DEMO_USER_ID,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to create event');
      }

      toast.success(`${type.charAt(0) + type.slice(1).toLowerCase()} added to timeline`);
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Could not save event. Check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStay = type === 'STAY';
  const isTransit = type === 'TRANSIT';

  const getLabel = () => {
    if (isStay) return 'Add Stay';
    if (isTransit) return 'Add Transit';
    return 'Add Activity';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={cn(
            'inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer rounded-full transition-all group/add-btn font-black uppercase tracking-[0.2em] text-[9px]',
            // THE MIDDLE GROUND: Muted background, subtle borders
            'bg-muted/60 border border-border/40 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 h-8 px-4',
            // Contextual tinting for No-Accommodation gaps (Orange)
            className,
          )}
        >
          {isTransit ? (
            <Plane className="mr-1.5 size-3 stroke-[3]" />
          ) : (
            <Plus
              className={cn(
                'transition-transform group-hover/add-btn:scale-110',
                isStay ? 'size-3 stroke-[3]' : 'size-2.5 stroke-[4]',
              )}
            />
          )}
          {getLabel()}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] rounded-[2.5rem] border-none shadow-2xl bg-background/95 backdrop-blur-2xl p-8">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'size-10 rounded-2xl flex items-center justify-center shadow-inner',
                isStay
                  ? 'bg-orange-500/10 text-orange-600'
                  : isTransit
                    ? 'bg-indigo-500/10 text-indigo-600'
                    : 'bg-primary/10 text-primary',
              )}
            >
              {isTransit ? (
                <Plane className="size-5 stroke-[3]" />
              ) : (
                <Plus className="size-5 stroke-[3]" />
              )}
            </div>
            <DialogTitle className="text-2xl font-[1000] tracking-tighter uppercase italic leading-none">
              {isStay ? 'New Accommodation' : isTransit ? 'New Transit' : 'New Activity'}
            </DialogTitle>
          </div>
        </DialogHeader>

        <EventForm
          type={type as any}
          initialDate={initialDate}
          onSubmit={handleCreate}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
