"use client";

import { EventCalendar } from "@/components/calendar/event-calendar";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Our Calendar</h1>
      <p className="text-gray-500">Keep track of your special dates and upcoming events together.</p>
      
      <EventCalendar />
    </div>
  );
} 