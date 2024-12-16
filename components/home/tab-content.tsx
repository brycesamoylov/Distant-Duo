"use client";

import { MessageList } from "@/components/messages/message-list";
import { EventCalendar } from "@/components/calendar/event-calendar";

interface TabContentProps {
  activeTab: 'messages' | 'calendar';
}

export function TabContent({ activeTab }: TabContentProps) {
  if (activeTab === 'messages') {
    return (
      <section>
        <h2 className="text-2xl font-semibold text-pink-600 mb-4">Recent Messages</h2>
        <MessageList />
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold text-pink-600 mb-4">Upcoming Events</h2>
      <EventCalendar />
    </section>
  );
}