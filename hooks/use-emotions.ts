"use client";

import { useState, useEffect } from 'react';
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
  limit,
} from 'firebase/firestore';
import type { Emotion } from '@/lib/types';
import { usePartner } from './use-partner';

export function useEmotions() {
  const { data: session } = useSession();
  const { partner } = usePartner();
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id || !partner?.id) {
      setLoading(false);
      return;
    }

    const emotionsQuery = query(
      collection(db, 'emotions'),
      where('userId', 'in', [session.user.id, partner.id]),
      orderBy('createdAt', 'desc'),
      limit(2) // Get latest emotion for each user
    );

    const unsubscribe = onSnapshot(emotionsQuery, (snapshot) => {
      const newEmotions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Emotion[];

      setEmotions(newEmotions);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [session?.user?.id, partner?.id]);

  const setEmotion = async (type: string) => {
    if (!session?.user?.id) return;

    await addDoc(collection(db, 'emotions'), {
      type,
      userId: session.user.id,
      userName: session.user.name,
      createdAt: Timestamp.now(),
    });
  };

  return {
    emotions,
    loading,
    setEmotion,
  };
} 