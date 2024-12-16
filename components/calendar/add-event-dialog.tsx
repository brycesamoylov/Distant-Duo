"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Plus } from "lucide-react";
import { Event, EventType } from "@/lib/types/event";

interface AddEventDialogProps {
  onAddEvent: (event: Omit<Event, 'id'>) => void;
}

const eventTypes: { value: EventType; label: string }[] = [
  { value: 'date', label: 'Virtual Date' },
  { value: 'call', label: 'Video Call' },
  { value: 'visit', label: 'In-Person Visit' },
  { value: 'anniversary', label: 'Anniversary' },
];

export function AddEventDialog({ onAddEvent }: AddEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: undefined as Date | undefined,
    type: 'date' as EventType,
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.title) return;

    onAddEvent({
      title: formData.title,
      date: formData.date,
      type: formData.type,
      description: formData.description,
    });

    // Reset form and close dialog
    setFormData({
      title: '',
      date: undefined,
      type: 'date',
      description: '',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-pink-600 border-pink-200 hover:bg-pink-50">
          <Plus className="h-4 w-4 mr-1" />
          Add New Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Special Date</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Our Virtual Movie Night"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Event Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: EventType) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Calendar
              mode="single"
              selected={formData.date}
              onSelect={(date) => setFormData(prev => ({ ...prev, date }))}
              className="rounded-md border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add any special notes or details..."
            />
          </div>

          <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700">
            Add Event
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}