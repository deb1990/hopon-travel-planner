'use client';

import * as React from 'react';
import { MapPin, Lock, ExternalLink, MoreVertical, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ItineraryEvent } from '@hopon/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ItineraryRowProps {
  event: ItineraryEvent;
  className?: string;
  isDraggable?: boolean;
}

/**
 * A high-precision row for displaying itinerary events.
 * Supports drag-and-drop sortable interactions.
 */
export function ItineraryRow({ event, className, isDraggable = false }: ItineraryRowProps) {
  const isStay = event.type === 'STAY';

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: event.id,
    disabled: !isDraggable || isStay, // Stays are anchors, not draggable
    data: {
      type: event.type,
      event,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative flex items-center gap-6 border-b border-border/40 bg-transparent px-6 py-4 hover:bg-muted/30 transition-all duration-200 cursor-pointer',
        isStay && 'bg-primary/[0.02] border-l-2 border-l-primary',
        isDragging && 'opacity-50 scale-[0.98] z-50 bg-muted shadow-2xl',
        className,
      )}
    >
      {/* Drag Handle (Only for non-stay draggable items) */}
      {!isStay && isDraggable && (
        <div
          {...attributes}
          {...listeners}
          className="absolute left-1 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded transition-opacity"
        >
          <GripVertical className="size-3.5 text-muted-foreground/40" />
        </div>
      )}

      {/* Time Column */}
      {!isStay && (
        <div className="flex w-20 flex-col font-mono text-[10px] tabular-nums tracking-tighter shrink-0">
          <span className="text-muted-foreground font-bold group-hover:text-foreground transition-colors">
            {new Date(event.startTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </span>
          {event.endTime && (
            <span className="text-[9px] opacity-40">
              {new Date(event.endTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </span>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
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
        {event.bookingLink && (
          <a
            href={event.bookingLink}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="size-3.5" />
          </a>
        )}
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <MoreVertical className="size-4" />
        </button>
      </div>
    </div>
  );
}
