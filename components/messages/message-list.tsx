"use client";

import { useEffect, useRef, useMemo } from "react";
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

  const userEmoticon = useMemo(() => getRandomEmoticon(), []);
  const partnerEmoticon = useMemo(() => getRandomEmoticon(), []);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!session || !partner) {
    return (
      <Card className="h-[600px] flex items-center justify-center bg-gradient-to-b from-pink-50/50">
        <p className="text-gray-500">Please sign in and link with your partner to chat</p>
      </Card>
    );
  }

  return (
    <Card className="h-[calc(100vh-12rem)] flex flex-col bg-gradient-to-b from-pink-50/50">
      <div className="p-4 border-b flex items-center gap-3">
        <Avatar className="w-8 h-8">
          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-sm">
            {partnerEmoticon}
          </div>
        </Avatar>
        <div>
          <h3 className="font-medium text-gray-900">{partner.name}</h3>
          <p className="text-xs text-gray-500">Online</p>
        </div>
      </div>

      <div className="flex-1 p-4">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwn = message.userId === session.user.id;
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-2 group",
                    isOwn && "flex-row-reverse"
                  )}
                >
                  <Avatar className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                      isOwn ? "bg-pink-100" : "bg-blue-100"
                    )}>
                      {isOwn ? userEmoticon : partnerEmoticon}
                    </div>
                  </Avatar>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 max-w-[70%] shadow-sm",
                      isOwn 
                        ? "bg-pink-600 text-white rounded-tr-none" 
                        : "bg-white rounded-tl-none"
                    )}
                  >
                    <p className="leading-relaxed">{message.content}</p>
                    <p className={cn(
                      "text-[10px] mt-1 opacity-70",
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
      </div>

      <div className="p-4 border-t bg-white/50 backdrop-blur-sm">
        <MessageInput onSend={sendMessage} />
      </div>
    </Card>
  );
}