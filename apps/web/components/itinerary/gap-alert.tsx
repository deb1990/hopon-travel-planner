import React from 'react';
import { Home, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GapAlertProps {
  days: number;
}

/**
 * Visual indicator for unassigned accommodation in the itinerary.
 */
export function GapAlert({ days }: GapAlertProps) {
  return (
    <div className="group relative ml-[31px] my-6 mr-6">
      <div className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-[1px] h-full bg-orange-500/20" />
      <div className="flex items-center justify-between p-4 rounded-2xl border border-dashed border-orange-500/20 bg-orange-500/[0.03] hover:bg-orange-500/[0.06] transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Home className="size-4 text-orange-600" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest leading-none">
              Base Not Assigned
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              {days} {days === 1 ? 'Day' : 'Days'} unassigned
            </span>
          </div>
        </div>
        <Button
          size="xs"
          variant="outline"
          className="rounded-full border-orange-500/20 bg-background text-orange-600 hover:bg-orange-500 hover:text-white h-7 px-4"
        >
          <Plus className="size-3 mr-1" />
          Assign
        </Button>
      </div>
    </div>
  );
}
