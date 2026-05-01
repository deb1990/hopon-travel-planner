import * as React from 'react';
import { MapPin, Clock, Lock, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ItineraryEvent } from '@hopon/core';

interface ItineraryRowProps {
  event: ItineraryEvent;
  className?: string;
}

export function ItineraryRow({ event, className }: ItineraryRowProps) {
  const isStay = event.type === 'STAY';

  return (
    <div
      className={cn(
        'group relative flex items-center gap-4 border-b border-border/50 bg-background px-4 py-2 hover:bg-accent/30 transition-colors',
        isStay && 'bg-secondary/20 font-semibold border-l-4 border-l-primary',
        className,
      )}
    >
      {/* Time Column */}
      <div className="flex w-24 flex-col text-[10px] text-muted-foreground uppercase tracking-wider">
        <div className="flex items-center gap-1">
          <Clock className="size-3" />
          {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        {event.endTime && (
          <div className="opacity-50">
            {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="text-sm">{event.title}</span>
          <Badge variant={isStay ? 'default' : 'outline'} className="h-4 px-1 text-[9px] uppercase">
            {event.type}
          </Badge>
          {event.isLocked && <Lock className="size-3 text-zinc-500" />}
        </div>

        {event.locationName && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            <span>{event.locationName}</span>
          </div>
        )}
      </div>

      {/* Actions (Visible on hover) */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {event.bookingLink && (
          <a
            href={event.bookingLink}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-primary"
          >
            <ExternalLink className="size-4" />
          </a>
        )}
      </div>
    </div>
  );
}
