"use client";

import { Card } from "@/components/ui/card";
import { Event } from "@/lib/types";
import { Calendar, Clock, Video, Heart, MapPin } from "lucide-react";
import { format, isAfter, startOfDay, isSameDay } from "date-fns";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useCalendar } from "@/hooks/use-calendar";
import { EditEventDialog } from "./edit-event-dialog";

const eventTypeIcons = {
  date: Heart,
  call: Video,
  visit: MapPin,
  anniversary: Calendar,
  other: Clock,
};

interface EventListProps {
  events: Event[];
  isLoading?: boolean;
  selectedDate?: Date;
  allEvents: Event[];
}

export function EventList({ events, isLoading, selectedDate, allEvents }: EventListProps) {
  const { data: session } = useSession();
  const { deleteEvent } = useCalendar();

  const upcomingEvents = allEvents
    .filter(event => isAfter(new Date(event.date), startOfDay(new Date())))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const renderEventItem = (event: Event) => {
    const Icon = eventTypeIcons[event.type] || Clock;
    const isOwner = event.userId === session?.user?.id;

    return (
      <div
        key={event.id}
        className="flex items-start space-x-4 p-4 rounded-lg border"
      >
        <div className="p-2 bg-pink-100 rounded-full">
          <Icon className="h-5 w-5 text-pink-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{event.title}</h4>
          {event.description && (
            <p className="text-gray-500 text-sm mt-1">{event.description}</p>
          )}
          <p className="text-sm text-gray-400 mt-2">
            {format(new Date(event.date), 
              new Date(event.date).getHours() || new Date(event.date).getMinutes() 
                ? "PPp" 
                : "PP"
            )}
          </p>
        </div>
        {isOwner && (
          <div className="flex space-x-2">
            <EditEventDialog event={event} />
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={() => deleteEvent(event.id)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-pink-200 animate-bounce" />
          <div className="w-4 h-4 rounded-full bg-pink-300 animate-bounce [animation-delay:-.3s]" />
          <div className="w-4 h-4 rounded-full bg-pink-400 animate-bounce [animation-delay:-.5s]" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {events.length > 0 ? (
        <>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Events for {selectedDate && format(selectedDate, "PP")}
          </h3>
          <div className="space-y-4">
            {events.map(renderEventItem)}
          </div>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedDate && `No events for ${format(selectedDate, "PP")}`}
          </h3>
          {upcomingEvents.length > 0 ? (
            <>
              <h4 className="text-md font-medium text-gray-600 mt-6 mb-4">
                Upcoming Events
              </h4>
              <div className="space-y-4">
                {upcomingEvents.map(renderEventItem)}
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center">No upcoming events</p>
          )}
        </>
      )}
    </Card>
  );
}