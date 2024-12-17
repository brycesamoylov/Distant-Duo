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
  deleteDoc,
} from 'firebase/firestore';
import type { WordleGame, WordleGuess } from '@/lib/types';
import { usePartner } from './use-partner';

const WORDS = [
  'REACT', 'HEART', 'SMILE', 'DREAM', 'HAPPY',
  'PEACE', 'DANCE', 'LAUGH', 'SWEET', 'SHINE',
  'LIGHT', 'SPARK', 'CHARM', 'BLISS', 'GRACE',
  'FAITH', 'TRUST', 'UNITY', 'SHARE', 'BLOOM'
];

type GuessStatus = "correct" | "present" | "absent";

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
      where('status', 'in', ['active', 'won', 'lost'])
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

    if (currentGame && (currentGame.status === 'won' || currentGame.status === 'lost')) {
      await deleteDoc(doc(db, 'wordle_games', currentGame.id));
    }

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
    const letterCount: { [key: string]: number } = {};

    // Count letters in the target word
    for (const letter of word) {
      letterCount[letter] = (letterCount[letter] || 0) + 1;
    }

    // First pass: mark correct letters
    const result: WordleGuess[] = guessArray.map((letter, i) => {
      if (word[i] === letter) {
        letterCount[letter]--;
        return { letter, status: 'correct' as const };
      }
      return { letter, status: 'absent' as const };
    });

    // Second pass: mark present letters
    result.forEach((guess, i) => {
      if (guess.status !== 'correct' && letterCount[guess.letter] > 0) {
        letterCount[guess.letter]--;
        result[i] = { letter: guess.letter, status: 'present' as const };
      }
    });

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