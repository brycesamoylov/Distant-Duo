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
import type { TicTacToeGame } from '@/lib/types';
import { usePartner } from './use-partner';

export function useTicTacToe() {
  const { data: session } = useSession();
  const { partner } = usePartner();
  const [currentGame, setCurrentGame] = useState<TicTacToeGame | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id || !partner?.id) {
      setLoading(false);
      return;
    }

    const gamesQuery = query(
      collection(db, 'tictactoe_games'),
      where('players', 'array-contains', session.user.id),
      orderBy('createdAt', 'desc'),
      where('status', 'in', ['active', 'won', 'lost', 'draw'])
    );

    const unsubscribe = onSnapshot(gamesQuery, (snapshot) => {
      if (!snapshot.empty) {
        const gameDoc = snapshot.docs[0];
        setCurrentGame({
          id: gameDoc.id,
          ...gameDoc.data(),
          createdAt: gameDoc.data().createdAt.toDate(),
        } as TicTacToeGame);
      } else {
        setCurrentGame(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [session?.user?.id, partner?.id]);

  const startNewGame = async () => {
    if (!session?.user?.id || !partner?.id) return;

    if (currentGame) {
      await deleteDoc(doc(db, 'tictactoe_games', currentGame.id));
    }

    const gameData = {
      board: Array(9).fill(''),
      currentTurn: session.user.id,
      createdAt: Timestamp.now(),
      creatorId: session.user.id,
      players: [session.user.id, partner.id],
      status: 'active',
      winner: null,
    };

    await addDoc(collection(db, 'tictactoe_games'), gameData);
  };

  const makeMove = async (index: number) => {
    if (!currentGame || !session?.user?.id || currentGame.currentTurn !== session.user.id) return;
    if (currentGame.board[index] !== '') return;

    const newBoard = [...currentGame.board];
    const symbol = currentGame.creatorId === session.user.id ? 'X' : 'O';
    newBoard[index] = symbol;

    const gameRef = doc(db, 'tictactoe_games', currentGame.id);
    const nextTurn = currentGame.players.find(id => id !== session.user.id)!;

    // Check for win or draw
    const winner = checkWinner(newBoard);
    const isDraw = !winner && newBoard.every(cell => cell !== '');

    await updateDoc(gameRef, {
      board: newBoard,
      currentTurn: nextTurn,
      status: winner ? 'won' : isDraw ? 'draw' : 'active',
      winner: winner ? session.user.id : null,
    });
  };

  const resetGame = async () => {
    if (currentGame) {
      await deleteDoc(doc(db, 'tictactoe_games', currentGame.id));
      setCurrentGame(null);
    }
  };

  return {
    currentGame,
    loading,
    startNewGame,
    makeMove,
    resetGame,
    isCreator: currentGame?.creatorId === session?.user?.id,
  };
}

// Helper function to check for a winner
function checkWinner(board: string[]): boolean {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }

  return false;
} 