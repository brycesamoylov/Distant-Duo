"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar } from "lucide-react";

interface TabSelectorProps {
  activeTab: 'messages' | 'calendar';
  onTabChange: (tab: 'messages' | 'calendar') => void;
}

export function TabSelector({ activeTab, onTabChange }: TabSelectorProps) {
  return (
    <div className="flex space-x-2 mb-6">
      <Button
        variant={activeTab === 'messages' ? 'default' : 'outline'}
        onClick={() => onTabChange('messages')}
        className={activeTab === 'messages' ? 'bg-pink-600 hover:bg-pink-700' : ''}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Messages
      </Button>
      <Button
        variant={activeTab === 'calendar' ? 'default' : 'outline'}
        onClick={() => onTabChange('calendar')}
        className={activeTab === 'calendar' ? 'bg-pink-600 hover:bg-pink-700' : ''}
      >
        <Calendar className="h-4 w-4 mr-2" />
        Calendar
      </Button>
    </div>
  );
}