'use client';

import * as React from 'react';
import {
  MapPin,
  Lock,
  ExternalLink,
  MoreVertical,
  ArrowRight,
  Edit2,
  Trash2,
  Car,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ItineraryEvent } from '@hopon/core';
import { EditEventDialog } from './edit-event-dialog';
import { DeleteEventDialog } from './delete-event-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface ItineraryRowProps {
  event: ItineraryEvent;
  className?: string;
}

/**
 * A high-precision row for displaying itinerary events.
 * Features an action menu and spatial travel estimates.
 */
export function ItineraryRow({ event, className }: ItineraryRowProps) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const isStay = event.type === 'STAY';

  const startTimeStr = new Date(event.startTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const endTimeStr = event.endTime
    ? new Date(event.endTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    : null;

  const bookingLink = event.type === 'STAY' ? event.bookingLink : null;
  const travelTime = event.travelTimeMinutes;

  return (
    <>
      <div className="flex flex-col">
        {/* Travel Time Indicator (Transition Bridge) */}
        {travelTime && (
          <div className="flex items-center gap-2 ml-32 mb-[-8px] relative z-20">
            <div className="bg-background px-3 py-1 rounded-full border border-border/50 shadow-sm flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-700">
              <Car className="size-2.5 text-primary/60" />
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                {travelTime} min drive
              </span>
            </div>
          </div>
        )}

        <div
          className={cn(
            'group relative flex items-center gap-6 border-b border-border/40 bg-transparent px-6 py-4 hover:bg-muted/30 transition-all duration-200 cursor-pointer',
            isStay && 'bg-primary/[0.02] border-l-2 border-l-primary',
            className,
          )}
        >
          {/* TIME COLUMN */}
          {!isStay && (
            <div className="flex w-24 flex-col font-mono tabular-nums tracking-tighter shrink-0 gap-0.5">
              <div className="flex items-center gap-1.5 text-[10px] font-black text-foreground">
                <span>{startTimeStr}</span>
                {endTimeStr && <ArrowRight className="size-2 text-muted-foreground/40" />}
                <span className="text-muted-foreground/60">{endTimeStr}</span>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex flex-1 flex-col gap-0.5 min-w-0" onClick={() => setEditOpen(true)}>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'text-sm font-medium tracking-tight text-foreground/80 group-hover:text-foreground transition-colors',
                  isStay && 'text-base font-bold text-foreground',
                )}
              >
                {event.title}
              </span>
              <Badge
                variant="outline"
                className="h-4 px-1.5 text-[8px] font-black uppercase bg-muted/50 border-border/50 text-muted-foreground"
              >
                {event.type}
              </Badge>
              {event.isLocked && <Lock className="size-2.5 text-muted-foreground/50" />}
            </div>

            {event.locationName && (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                <MapPin className="size-3 shrink-0 opacity-40" />
                <span className="truncate">{event.locationName}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            {bookingLink && (
              <a
                href={bookingLink}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="size-3.5" />
              </a>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="text-muted-foreground hover:text-foreground transition-colors outline-none cursor-pointer p-1 rounded hover:bg-border/20"
                >
                  <MoreVertical className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setEditOpen(true)} className="gap-2">
                  <Edit2 className="size-3 text-muted-foreground" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setDeleteOpen(true)}
                  className="gap-2 text-red-500 focus:text-red-500 focus:bg-red-500/10"
                >
                  <Trash2 className="size-3" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <EditEventDialog event={event} open={editOpen} onOpenChange={setEditOpen} />

      <DeleteEventDialog event={event} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
  );
}
