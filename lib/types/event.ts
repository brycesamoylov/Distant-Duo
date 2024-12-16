export interface Event {
  id: string;
  title: string;
  date: Date;
  type: 'date' | 'call' | 'visit' | 'anniversary';
  description?: string;
}

export type EventType = Event['type'];