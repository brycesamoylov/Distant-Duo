"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { MessageInput } from "./message-input";
import { useMessages } from "@/hooks/use-messages";
import { useSession } from "next-auth/react";
import { usePartner } from "@/hooks/use-partner";
import { format } from "date-fns";
import { LucideIcon } from "@/components/ui/lucide-icon";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function MessageList() {
  const { data: session } = useSession();
  const { partner } = usePartner();
  const { messages, loading, sendMessage } = useMessages();
  const scrollRef = useRef<HTMLDivElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Current messages:", messages);
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!session) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">Please sign in to view messages</p>
      </Card>
    );
  }

  if (!partner) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">Link with your partner to start messaging</p>
      </Card>
    );
  }

  if (loading) {
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
      <div className="h-[500px] flex flex-col">
        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwn = message.userId === session.user.id;
              const user = isOwn ? session.user : partner;

              return (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 ${
                    isOwn ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      user?.avatar?.bg || "bg-pink-100"
                    )}>
                      {user?.avatar?.icon ? (
                        <LucideIcon 
                          name={user.avatar.icon} 
                          className={cn("h-4 w-4", user.avatar.color || "text-pink-500")} 
                        />
                      ) : (
                        <Heart className="h-4 w-4 text-pink-500" />
                      )}
                    </div>
                  </Avatar>
                  <div
                    className={`flex flex-col ${
                      isOwn ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        isOwn
                          ? 'bg-pink-600 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-900 rounded-bl-none'
                      }`}
                    >
                      {message.content}
                    </div>
                    <span className="text-xs text-gray-400 mt-1">
                      {format(message.createdAt, 'p')}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={endOfMessagesRef} />
          </div>
        </ScrollArea>
        <MessageInput onSend={sendMessage} />
      </div>
    </Card>
  );
}