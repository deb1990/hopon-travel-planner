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
  Hash,
  Plane,
  Train,
  Bus,
  Anchor,
  Footprints,
  LogIn,
  LogOut,
  CheckCircle2,
  Navigation2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ItineraryEvent, getGoogleMapsUrl } from '@hopon/core';
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
 */
export function ItineraryRow({ event, className }: ItineraryRowProps) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const isStay = event.type === 'STAY';
  const isTransit = event.type === 'TRANSIT';
  const isCheckInOut = event.type === 'CHECK_IN' || event.type === 'CHECK_OUT';

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

  const mapsUrl = getGoogleMapsUrl(event);
  const bookingLink = event.type === 'STAY' ? event.bookingLink : null;
  const travelTime = event.travelTimeMinutes;

  const getIcon = () => {
    if (event.type === 'CHECK_IN') return <LogIn className="size-3.5 text-indigo-500" />;
    if (event.type === 'CHECK_OUT') return <LogOut className="size-3.5 text-orange-500" />;
    if (event.type === 'STAY') return null;

    if (isTransit) {
      const mode = (event as any).transitMode;
      switch (mode) {
        case 'Flight':
          return <Plane className="size-3.5 text-primary" />;
        case 'Train':
          return <Train className="size-3.5 text-primary" />;
        case 'Bus':
          return <Bus className="size-3.5 text-primary" />;
        case 'Boat':
          return <Anchor className="size-3.5 text-primary" />;
        case 'Walk':
          return <Footprints className="size-3.5 text-primary" />;
        default:
          return <Car className="size-3.5 text-primary" />;
      }
    }
    return <CheckCircle2 className="size-3.5 text-muted-foreground/40" />;
  };

  return (
    <>
      <div className="flex flex-col w-full">
        {travelTime && (
          <div className="flex items-center gap-2 ml-32 mb-[-8px] relative z-20">
            <div className="bg-background px-3 py-1 rounded-full border border-border/50 shadow-sm flex items-center gap-1.5">
              <Car className="size-2.5 text-primary/60" />
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                {travelTime} min drive
              </span>
            </div>
          </div>
        )}

        <div
          className={cn(
            'group relative flex items-center gap-6 border-b border-border/40 bg-transparent px-6 py-4 hover:bg-muted/30 transition-all duration-200 cursor-pointer w-full',
            isStay && 'bg-primary/[0.02] border-l-2 border-l-primary py-8',
            isCheckInOut && 'opacity-80 bg-muted/10',
            className,
          )}
        >
          {!isStay && (
            <div className="flex w-24 flex-col font-mono tabular-nums tracking-tighter shrink-0 gap-0.5">
              <div className="flex items-center gap-1.5 text-[10px] font-black text-foreground">
                <span>{startTimeStr}</span>
                {endTimeStr && <ArrowRight className="size-2 text-muted-foreground/40" />}
                <span className="text-muted-foreground/60">{endTimeStr}</span>
              </div>
            </div>
          )}

          <div className="flex flex-1 flex-col gap-0.5 min-w-0" onClick={() => setEditOpen(true)}>
            <div className="flex items-center gap-3">
              <div className="shrink-0">{getIcon()}</div>
              <span
                className={cn(
                  'text-sm font-medium tracking-tight text-foreground/80 group-hover:text-foreground transition-colors truncate',
                  isStay && 'text-base font-[1000] text-foreground uppercase italic',
                  isCheckInOut && 'text-[13px] font-bold text-muted-foreground italic',
                )}
              >
                {event.title}
              </span>
              {!isCheckInOut && (
                <Badge
                  variant="outline"
                  className="h-4 px-1.5 text-[8px] font-black uppercase bg-muted/50 border-border/50 text-muted-foreground shrink-0"
                >
                  {event.type}
                </Badge>
              )}
              {event.isLocked && <Lock className="size-2.5 text-muted-foreground/50 shrink-0" />}
            </div>

            <div className="flex items-center gap-4 text-[11px] font-medium min-w-0">
              {event.locationName && (
                <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
                  <MapPin className="size-3 shrink-0 opacity-40" />
                  <span className="truncate">{event.locationName}</span>
                </div>
              )}
              {event.plusCode && (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted/50 border border-border/40 shrink-0">
                  <Hash className="size-2 text-primary/60" />
                  <span className="text-[9px] font-mono text-muted-foreground uppercase">
                    {event.plusCode}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-muted-foreground hover:text-indigo-600 transition-colors"
                title="Open in Google Maps"
              >
                <Navigation2 className="size-3.5" />
              </a>
            )}

            {bookingLink && (
              <a
                href={bookingLink}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-muted-foreground hover:text-primary transition-colors"
                title="View Booking"
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
                {mapsUrl && (
                  <DropdownMenuItem asChild>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Navigation2 className="size-3 text-indigo-500" />
                      Google Maps
                    </a>
                  </DropdownMenuItem>
                )}
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
