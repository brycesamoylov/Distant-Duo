"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import type { User } from '@/lib/types';

export function usePartner() {
  const { data: session } = useSession();
  const [partner, setPartner] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    // Listen to the current user's document for partner ID changes
    const unsubUser = onSnapshot(doc(db, 'users', session.user.id), async (userDoc) => {
      const partnerId = userDoc.data()?.partnerId;
      
      if (!partnerId) {
        setPartner(null);
        setLoading(false);
        return;
      }

      // Get partner's data
      const unsubPartner = onSnapshot(doc(db, 'users', partnerId), (partnerDoc) => {
        if (partnerDoc.exists()) {
          setPartner({
            id: partnerDoc.id,
            ...partnerDoc.data(),
          } as User);
        }
        setLoading(false);
      });

      return () => unsubPartner();
    });

    return () => unsubUser();
  }, [session?.user?.id]);

  return { partner, loading };
} 