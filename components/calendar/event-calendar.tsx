"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { AddEventDialog } from "./add-event-dialog";
import { EventList } from "./event-list";
import { useCalendar } from "@/hooks/use-calendar";

export function EventCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { events, loading, addEvent } = useCalendar();

  const selectedDateEvents = events.filter(event => {
    if (!date) return false;
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-pink-600">Our Special Dates</h3>
          <AddEventDialog onAddEvent={addEvent} />
        </div>
        <div className="max-w-sm mx-auto">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{
              event: events.map(event => new Date(event.date))
            }}
            modifiersStyles={{
              event: { fontWeight: 'bold', color: 'rgb(219 39 119)' }
            }}
          />
        </div>
      </Card>
      
      <EventList 
        events={selectedDateEvents} 
        isLoading={loading}
        selectedDate={date}
        allEvents={events}
      />
    </div>
  );
}