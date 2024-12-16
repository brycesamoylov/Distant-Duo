"use client";

import { MessageList } from "@/components/messages/message-list";

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
      <MessageList />
    </div>
  );
}