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
import type { HangmanGame } from '@/lib/types';
import { usePartner } from './use-partner';

export function useHangman() {
  const { data: session } = useSession();
  const { partner } = usePartner();
  const [currentGame, setCurrentGame] = useState<HangmanGame | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id || !partner?.id) {
      setLoading(false);
      return;
    }

    const gamesQuery = query(
      collection(db, 'hangman_games'),
      where('players', 'array-contains', session.user.id),
      orderBy('createdAt', 'desc'),
      where('status', 'in', ['waiting', 'active', 'won', 'lost'])
    );

    const unsubscribe = onSnapshot(gamesQuery, (snapshot) => {
      if (!snapshot.empty) {
        const gameDoc = snapshot.docs[0];
        setCurrentGame({
          id: gameDoc.id,
          ...gameDoc.data(),
          createdAt: gameDoc.data().createdAt.toDate(),
        } as HangmanGame);
      } else {
        setCurrentGame(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [session?.user?.id, partner?.id]);

  const startNewGame = async (word?: string) => {
    if (!session?.user?.id || !partner?.id) return;

    if (currentGame && (currentGame.status === 'won' || currentGame.status === 'lost')) {
      await deleteDoc(doc(db, 'hangman_games', currentGame.id));
    }

    if (!word) return;

    const gameData = {
      word: word.toLowerCase(),
      guessedLetters: [],
      wrongGuesses: 0,
      createdAt: Timestamp.now(),
      creatorId: session.user.id,
      guesserId: partner.id,
      status: 'active',
      players: [session.user.id, partner.id],
      maxGuesses: 6,
      readyToPlay: [session.user.id],
    };

    await addDoc(collection(db, 'hangman_games'), gameData);
  };

  const makeGuess = async (letter: string) => {
    if (!currentGame || !session?.user?.id) return;

    const gameRef = doc(db, 'hangman_games', currentGame.id);
    const normalizedLetter = letter.toLowerCase();

    if (currentGame.guessedLetters.includes(normalizedLetter)) return;

    const newGuessedLetters = [...currentGame.guessedLetters, normalizedLetter];
    const isWrongGuess = !currentGame.word.includes(normalizedLetter);
    const newWrongGuesses = isWrongGuess ? currentGame.wrongGuesses + 1 : currentGame.wrongGuesses;

    let newStatus = currentGame.status;
    const allLettersGuessed = currentGame.word
      .split('')
      .every(letter => newGuessedLetters.includes(letter));
    
    if (allLettersGuessed) {
      newStatus = 'won';
    } else if (newWrongGuesses >= currentGame.maxGuesses) {
      newStatus = 'lost';
    }

    await updateDoc(gameRef, {
      guessedLetters: newGuessedLetters,
      wrongGuesses: newWrongGuesses,
      status: newStatus,
    });
  };

  const resetGame = async () => {
    if (currentGame) {
      await deleteDoc(doc(db, 'hangman_games', currentGame.id));
      setCurrentGame(null);
    }
  };

  return {
    currentGame,
    loading,
    startNewGame,
    makeGuess,
    isCreator: currentGame?.creatorId === session?.user?.id,
    resetGame,
  };
} 