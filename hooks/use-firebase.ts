import { useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useSession } from 'next-auth/react';

export function useFirebase() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const getPartnerMessages = useCallback(async () => {
    if (!userId) return [];

    const userDoc = await getDocs(query(
      collection(db, 'users'),
      where('id', '==', userId)
    ));

    if (userDoc.empty) return [];

    const partnerId = userDoc.docs[0].data().partnerId;
    if (!partnerId) return [];

    const messagesQuery = query(
      collection(db, 'messages'),
      where('userId', 'in', [userId, partnerId]),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(messagesQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }, [userId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!userId) return;

    await addDoc(collection(db, 'messages'), {
      content,
      userId,
      createdAt: new Date()
    });
  }, [userId]);

  return {
    getPartnerMessages,
    sendMessage
  };
} 