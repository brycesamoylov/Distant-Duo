"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWordle } from "@/hooks/use-wordle";
import { useSession } from "next-auth/react";
import { usePartner } from "@/hooks/use-partner";
import { cn } from "@/lib/utils";

export function Wordle() {
  const { data: session } = useSession();
  const { partner } = usePartner();
  const { currentGame, loading, startNewGame, makeGuess, checkGuess } = useWordle();
  const [currentGuess, setCurrentGuess] = useState("");

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

  const handleSubmitGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentGuess.length === 5) {
      makeGuess(currentGuess);
      setCurrentGuess("");
    }
  };

  if (!currentGame) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Start New Game</h3>
          <p className="text-gray-500">Play Wordle together!</p>
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

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-4 max-w-md mx-auto">
          {currentGame.guesses.map((guess, i) => (
            <div key={i} className="grid grid-cols-5 gap-2">
              {checkGuess(guess).map(({ letter, status }, j) => (
                <div
                  key={`${i}-${j}`}
                  className={cn(
                    "w-full h-10 flex items-center justify-center text-white font-bold text-xl rounded",
                    status === 'correct' && "bg-green-500",
                    status === 'present' && "bg-yellow-500",
                    status === 'absent' && "bg-gray-500"
                  )}
                >
                  {letter}
                </div>
              ))}
            </div>
          ))}
          {currentGame.status === 'active' && currentGame.guesses.length < currentGame.maxGuesses && (
            <form onSubmit={handleSubmitGuess} className="grid grid-cols-5 gap-2">
              <Input
                value={currentGuess}
                onChange={(e) => setCurrentGuess(e.target.value.toUpperCase())}
                maxLength={5}
                pattern="[A-Za-z]{5}"
                className="col-span-4 h-10"
                placeholder="Enter your guess"
                required
              />
              <Button type="submit" className="bg-pink-600 hover:bg-pink-700 h-10">
                Try
              </Button>
            </form>
          )}
        </div>

        {currentGame.status === 'won' && (
          <div className="text-center text-lg font-medium text-green-600">
            Congratulations! You found the word: {currentGame.word}
          </div>
        )}

        {currentGame.status === 'lost' && (
          <div className="text-center text-lg font-medium text-red-600">
            The word was: {currentGame.word}! Try again?
          </div>
        )}

        {(currentGame.status === 'won' || currentGame.status === 'lost') && (
          <Button
            onClick={() => startNewGame()}
            className="w-full bg-pink-600 hover:bg-pink-700"
          >
            Play Again
          </Button>
        )}

        <div className="text-sm text-gray-500 text-center">
          {currentGame.guesses.length} / {currentGame.maxGuesses} guesses used
        </div>
      </div>
    </Card>
  );
} 