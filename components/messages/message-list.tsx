"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { MessageInput } from "./message-input";
import { useMessages } from "@/hooks/use-messages";
import { useSession } from "next-auth/react";
import { usePartner } from "@/hooks/use-partner";
import { getRandomEmoticon } from "@/lib/emoticons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function MessageList() {
  const { data: session } = useSession();
  const { partner } = usePartner();
  const { messages, loading, sendMessage } = useMessages();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!session || !partner) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <p className="text-gray-500">Please sign in and link with your partner to chat</p>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwn = message.userId === session.user.id;
              const user = isOwn ? session.user : partner;

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-end gap-2",
                    isOwn && "flex-row-reverse"
                  )}
                >
                  <Avatar className="w-8 h-8">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                      "bg-pink-100"
                    )}>
                      {getRandomEmoticon()}
                    </div>
                  </Avatar>
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 max-w-[70%]",
                      isOwn ? "bg-pink-600 text-white" : "bg-gray-100"
                    )}
                  >
                    <p>{message.content}</p>
                    <p className={cn(
                      "text-xs mt-1",
                      isOwn ? "text-pink-100" : "text-gray-500"
                    )}>
                      {format(message.createdAt, 'HH:mm')}
                    </p>
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