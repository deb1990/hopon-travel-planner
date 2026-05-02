import * as React from 'react';
import { MapPin, Lock, ExternalLink, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ItineraryEvent } from '@hopon/core';

interface ItineraryRowProps {
  event: ItineraryEvent;
  className?: string;
}

/**
 * A high-precision row for displaying itinerary events.
 * Optimized for information density and technical clarity.
 */
export function ItineraryRow({ event, className }: ItineraryRowProps) {
  const isStay = event.type === 'STAY';

  return (
    <div
      className={cn(
        'group relative flex items-center gap-6 border-b border-border/40 bg-transparent px-6 py-4 hover:bg-muted/30 transition-all duration-200',
        isStay && 'bg-primary/[0.02] border-l-2 border-l-primary',
        className,
      )}
    >
      {/* Time Column (Technical Mono) */}
      <div className="flex w-20 flex-col font-mono text-[10px] tabular-nums tracking-tighter shrink-0">
        <span
          className={cn(
            'text-muted-foreground font-bold group-hover:text-foreground transition-colors',
            isStay && 'text-primary',
          )}
        >
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

      {/* Actions (Professional Gray) */}
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
