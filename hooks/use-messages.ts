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
  Timestamp,
  onSnapshot,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';
import type { Message } from '@/lib/types';
import { usePartner } from './use-partner';
import { subHours } from 'date-fns';

export function useMessages() {
  const { data: session } = useSession();
  const { partner } = usePartner();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id || !partner?.id) {
      setLoading(false);
      return;
    }

    const twentyFourHoursAgo = subHours(new Date(), 24);
    
    // Simplified query using only userId and createdAt
    const messagesQuery = query(
      collection(db, 'messages'),
      where('userId', 'in', [session.user.id, partner.id]),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        }))
        .filter(msg => msg.createdAt >= twentyFourHoursAgo) as Message[];

      setMessages(newMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [session?.user?.id, partner?.id]);

  const sendMessage = async (content: string) => {
    if (!session?.user?.id || !content.trim()) return;

    try {
      // Delete old messages before sending new one
      const twentyFourHoursAgo = subHours(new Date(), 24);
      const oldMessagesQuery = query(
        collection(db, 'messages'),
        where('userId', '==', session.user.id),
        where('createdAt', '<=', Timestamp.fromDate(twentyFourHoursAgo))
      );

      const snapshot = await getDocs(oldMessagesQuery);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Send new message
      await addDoc(collection(db, 'messages'), {
        content: content.trim(),
        userId: session.user.id,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
  };
} 