"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  Timestamp,
  FirestoreDataConverter,
  CollectionReference,
} from 'firebase/firestore';
import type { Event } from '@/lib/types';
import { usePartner } from './use-partner';

// Create a converter for Event type
const eventConverter: FirestoreDataConverter<Event> = {
  toFirestore: (event: Event) => ({
    title: event.title,
    description: event.description,
    date: Timestamp.fromDate(event.date),
    type: event.type,
    userId: event.userId,
    createdAt: event.createdAt ? Timestamp.fromDate(event.createdAt) : Timestamp.now(),
    shared: event.shared,
  }),
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      title: data.title,
      description: data.description,
      date: data.date.toDate(),
      type: data.type,
      userId: data.userId,
      createdAt: data.createdAt.toDate(),
      shared: data.shared,
    } as Event;
  },
};

export function useCalendar() {
  const { data: session } = useSession();
  const { partner } = usePartner();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) {
      console.log('No session user ID');
      setLoading(false);
      return;
    }

    try {
      console.log('Setting up events listener for user:', session.user.id);
      const eventsRef = collection(db, 'events').withConverter(eventConverter);
      const eventsQuery = query(
        eventsRef,
        where('userId', 'in', partner ? [session.user.id, partner.id] : [session.user.id]),
        orderBy('date', 'asc')
      );

      const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
        console.log('Received events snapshot:', snapshot.docs.length, 'events');
        const newEvents = snapshot.docs.map(doc => doc.data());
        setEvents(newEvents);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error in useCalendar effect:', error);
      setLoading(false);
    }
  }, [session?.user?.id, partner]);

  const addEvent = async (eventData: Omit<Event, 'id' | 'userId' | 'createdAt'>) => {
    if (!session?.user?.id) return;

    const eventsRef = collection(db, 'events').withConverter(eventConverter) as CollectionReference<Event>;
    await addDoc(eventsRef, {
      ...eventData,
      id: '', // Will be set by Firestore
      userId: session.user.id,
      createdAt: new Date(),
    } as Event);
  };

  const updateEvent = async (eventId: string, eventData: Partial<Event>) => {
    const eventRef = doc(db, 'events', eventId).withConverter(eventConverter);
    await updateDoc(eventRef, eventData);
  };

  const deleteEvent = async (eventId: string) => {
    await deleteDoc(doc(db, 'events', eventId));
  };

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent
  };
} 