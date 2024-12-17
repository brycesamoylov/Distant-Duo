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

type GuessStatus = "correct" | "present" | "absent";

interface WordleGuess {
  letter: string;
  status: GuessStatus;
}

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

  const checkGuess = (guess: string): WordleGuess[] => {
    if (!currentGame) return [];

    const word = currentGame.word.toUpperCase();
    const guessArray = guess.toUpperCase().split('');
    
    return guessArray.map((letter, i): WordleGuess => {
      if (word[i] === letter) {
        return { letter, status: "correct" };
      }
      if (word.includes(letter)) {
        return { letter, status: "present" };
      }
      return { letter, status: "absent" };
    });
  };

  return {
    currentGame,
    loading,
    startNewGame,
    makeGuess,
    checkGuess,
  };
} 