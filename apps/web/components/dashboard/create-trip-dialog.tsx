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
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const DEMO_USER_ID = 'b07bb29b-67de-4f35-8c85-111c8358436b';
const API_URL = 'http://localhost:4000';

export function CreateTripDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (tripName: string) => {
      const res = await fetch(`${API_URL}/trips`, {
        method: 'POST',
        headers: {
          'x-user-id': DEMO_USER_ID,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: tripName }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      setOpen(false);
      setName('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutation.mutate(name);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-10 px-6 rounded-full bg-blue-600 text-white font-black hover:bg-blue-700 hover:scale-105 transition-all shadow-md active:scale-95 border-none text-xs uppercase tracking-widest">
          <Plus className="size-4 mr-2 stroke-[4]" />
          New Journey
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Trip</DialogTitle>
            <DialogDescription>Give your new journey a name to get started.</DialogDescription>
          </DialogHeader>
          <div className="py-8">
            <Input
              placeholder="e.g. Summer in Japan 2026"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="h-14 text-lg"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={mutation.isPending || !name.trim()}
              className="w-full h-14 rounded-2xl bg-blue-600 text-white font-black text-base hover:bg-blue-700"
            >
              {mutation.isPending ? 'Creating Trip...' : 'Create Journey'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
