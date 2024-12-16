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
  updateDoc,
  doc,
} from 'firebase/firestore';
import type { WordleGame } from '@/lib/types';
import { usePartner } from './use-partner';

const WORDS = [
  'REACT', 'HEART', 'SMILE', 'DREAM', 'HAPPY',
  'PEACE', 'DANCE', 'LAUGH', 'SWEET', 'SHINE',
  'LIGHT', 'SPARK', 'CHARM', 'BLISS', 'GRACE',
  'FAITH', 'TRUST', 'UNITY', 'SHARE', 'BLOOM'
];

export function useWordle() {
  const { data: session } = useSession();
  const { partner } = usePartner();
  const [currentGame, setCurrentGame] = useState<WordleGame | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id || !partner?.id) {
      setLoading(false);
      return;
    }

    const gamesQuery = query(
      collection(db, 'wordle_games'),
      where('players', 'array-contains', session.user.id),
      orderBy('createdAt', 'desc'),
      where('status', '==', 'active')
    );

    const unsubscribe = onSnapshot(gamesQuery, (snapshot) => {
      if (!snapshot.empty) {
        const gameDoc = snapshot.docs[0];
        setCurrentGame({
          id: gameDoc.id,
          ...gameDoc.data(),
          createdAt: gameDoc.data().createdAt.toDate(),
        } as WordleGame);
      } else {
        setCurrentGame(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [session?.user?.id, partner?.id]);

  const startNewGame = async () => {
    if (!session?.user?.id || !partner?.id) return;

    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    const gameData = {
      word: randomWord,
      guesses: [],
      createdAt: Timestamp.now(),
      createdBy: session.user.id,
      status: 'active',
      players: [session.user.id, partner.id],
      maxGuesses: 6,
    };

    await addDoc(collection(db, 'wordle_games'), gameData);
  };

  const makeGuess = async (guess: string) => {
    if (!currentGame || !session?.user?.id) return;
    if (guess.length !== 5) return;

    const gameRef = doc(db, 'wordle_games', currentGame.id);
    const newGuesses = [...currentGame.guesses, guess.toUpperCase()];

    let newStatus = currentGame.status;
    if (guess.toUpperCase() === currentGame.word) {
      newStatus = 'won';
    } else if (newGuesses.length >= currentGame.maxGuesses) {
      newStatus = 'lost';
    }

    await updateDoc(gameRef, {
      guesses: newGuesses,
      status: newStatus,
    });
  };

  const checkGuess = (guess: string): { letter: string; status: 'correct' | 'present' | 'absent' }[] => {
    if (!currentGame) return [];
    
    const word = currentGame.word;
    const result = [];
    const letterCount: { [key: string]: number } = {};

    // Count letters in the target word
    for (const letter of word) {
      letterCount[letter] = (letterCount[letter] || 0) + 1;
    }

    // First pass: mark correct letters
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i].toUpperCase();
      if (letter === word[i]) {
        result[i] = { letter, status: 'correct' };
        letterCount[letter]--;
      }
    }

    // Second pass: mark present and absent letters
    for (let i = 0; i < guess.length; i++) {
      if (result[i]) continue;
      
      const letter = guess[i].toUpperCase();
      if (letterCount[letter] > 0) {
        result[i] = { letter, status: 'present' };
        letterCount[letter]--;
      } else {
        result[i] = { letter, status: 'absent' };
      }
    }

    return result;
  };

  return {
    currentGame,
    loading,
    startNewGame,
    makeGuess,
    checkGuess,
  };
} 