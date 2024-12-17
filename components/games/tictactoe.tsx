"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTicTacToe } from "@/hooks/use-tictactoe";
import { useSession } from "next-auth/react";
import { usePartner } from "@/hooks/use-partner";
import { cn } from "@/lib/utils";
import { X, Circle } from "lucide-react";

export function TicTacToe() {
  const { data: session } = useSession();
  const { partner } = usePartner();
  const { currentGame, loading, startNewGame, makeMove, resetGame, isCreator } = useTicTacToe();

  if (!session || !partner) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">
          Please sign in and link with your partner to play
        </p>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
        </div>
      </Card>
    );
  }

  if (!currentGame) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Start New Game</h3>
          <p className="text-gray-500">Play Tic-Tac-Toe together!</p>
          <Button 
            onClick={() => startNewGame()}
            className="bg-pink-600 hover:bg-pink-700"
          >
            Start Game
          </Button>
        </div>
      </Card>
    );
  }

  const isMyTurn = currentGame.currentTurn === session.user.id;
  const mySymbol = isCreator ? 'X' : 'O';

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Game Status */}
        <div className="text-center">
          {currentGame.status === 'active' && (
            <p className={cn(
              "text-lg font-medium",
              isMyTurn ? "text-pink-600" : "text-gray-500"
            )}>
              {isMyTurn ? "Your turn!" : `Waiting for ${partner.name}`}
            </p>
          )}
          {currentGame.status === 'won' && (
            <p className="text-lg font-medium text-green-600">
              {currentGame.winner === session.user.id ? 
                "You won! 🎉" : 
                `${partner.name} won!`
              }
            </p>
          )}
          {currentGame.status === 'draw' && (
            <p className="text-lg font-medium text-yellow-600">
              It's a draw!
            </p>
          )}
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-3 max-w-[300px] mx-auto">
          {currentGame.board.map((cell, index) => (
            <button
              key={index}
              onClick={() => isMyTurn && makeMove(index)}
              disabled={!isMyTurn || cell !== '' || currentGame.status !== 'active'}
              className={cn(
                "w-full h-24 rounded-xl flex items-center justify-center",
                "transition-all duration-200",
                cell === '' && isMyTurn ? "hover:bg-pink-50" : "hover:bg-gray-50",
                "border-2",
                isMyTurn && cell === '' ? "border-pink-200" : "border-gray-100",
                "disabled:cursor-not-allowed"
              )}
            >
              {cell === 'X' && (
                <X className="w-12 h-12 text-pink-600" strokeWidth={3} />
              )}
              {cell === 'O' && (
                <Circle className="w-12 h-12 text-blue-600" strokeWidth={3} />
              )}
            </button>
          ))}
        </div>

        {/* Game Controls */}
        {(currentGame.status === 'won' || currentGame.status === 'draw') && (
          <Button
            onClick={() => startNewGame()}
            className="w-full bg-pink-600 hover:bg-pink-700"
          >
            Play Again
          </Button>
        )}

        {/* Player Info */}
        <div className="flex justify-between text-sm text-gray-500">
          <div>You: {mySymbol}</div>
          <div>{partner.name}: {mySymbol === 'X' ? 'O' : 'X'}</div>
        </div>
      </div>
    </Card>
  );
} 