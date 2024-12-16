"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHangman } from "@/hooks/use-hangman";
import { useSession } from "next-auth/react";
import { usePartner } from "@/hooks/use-partner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

const HANGMAN_DRAWINGS = [
  `
  
  
  
  
  =========`,
  `
  +
  |
  |
  |
  =========`,
  `
  +--+
  |
  |
  |
  =========`,
  `
  +--+
  |  O
  |
  |
  =========`,
  `
  +--+
  |  O
  |  |
  |
  =========`,
  `
  +--+
  |  O
  | /|\\
  |
  =========`,
  `
  +--+
  |  O
  | /|\\
  | / \\
  =========`,
];

// Separate PlayAgainDialog component
function PlayAgainDialog({ 
  isOpen, 
  onClose, 
  onPlayAgain, 
  gameStatus, 
  word 
}: { 
  isOpen: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
  gameStatus: 'won' | 'lost' | 'active';
  word: string;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Play Again?</DialogTitle>
          <DialogDescription>
            {gameStatus === 'won' 
              ? "Congratulations! The word was guessed correctly!"
              : `Game Over! The word was "${word}"`
            }
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Quit
          </Button>
          <Button
            className="bg-pink-600 hover:bg-pink-700"
            onClick={onPlayAgain}
          >
            Play Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main Hangman component
export function Hangman() {
  const { data: session } = useSession();
  const { partner } = usePartner();
  const { currentGame, loading, startNewGame, makeGuess, isCreator } = useHangman();
  const [newWord, setNewWord] = useState("");
  const [showRoleSelect, setShowRoleSelect] = useState(!currentGame);
  const [isCreatingWord, setIsCreatingWord] = useState(false);

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

  // Role selection screen
  if (showRoleSelect) {
    return (
      <Card className="p-6">
        <div className="space-y-6 text-center">
          <h3 className="text-2xl font-semibold">Choose Your Role</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => {
                setShowRoleSelect(false);
                setIsCreatingWord(true);
              }}
              className="bg-pink-600 hover:bg-pink-700 p-8 h-auto flex flex-col gap-2"
            >
              <span className="text-lg">Create Word</span>
              <span className="text-sm opacity-80">Make a word for your partner to guess</span>
            </Button>
            <Button 
              onClick={() => {
                setShowRoleSelect(false);
                setIsCreatingWord(false);
              }}
              className="bg-pink-600 hover:bg-pink-700 p-8 h-auto flex flex-col gap-2"
            >
              <span className="text-lg">Guess Word</span>
              <span className="text-sm opacity-80">Try to guess your partner's word</span>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Word input for creator
  if (isCreatingWord && !currentGame) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Enter Your Word</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (newWord.trim()) {
            startNewGame(newWord.trim(), partner.id);
            setNewWord("");
          }
        }} className="space-y-4">
          <Input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            placeholder="Enter a word for your partner to guess"
            pattern="[A-Za-z]+"
            title="Only letters allowed"
            required
          />
          <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700">
            Start Game
          </Button>
        </form>
      </Card>
    );
  }

  // Waiting screen for guesser
  if (!currentGame && !isCreatingWord) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="animate-bounce text-4xl">🤔</div>
          <h3 className="text-xl font-semibold">Waiting for {partner.name}</h3>
          <p className="text-gray-500">Your partner is thinking of a word...</p>
        </div>
      </Card>
    );
  }

  // Game over state
  if (currentGame?.status === 'won' || currentGame?.status === 'lost') {
    return (
      <Card className="p-6">
        <div className="space-y-6 text-center">
          <h3 className="text-2xl font-semibold">
            {currentGame.status === 'won' 
              ? "Congratulations! 🎉" 
              : "Game Over!"
            }
          </h3>
          <p className="text-lg">The word was: <span className="font-bold">{currentGame.word}</span></p>
          <Button 
            onClick={() => {
              setShowRoleSelect(true);
              setIsCreatingWord(false);
            }}
            className="bg-pink-600 hover:bg-pink-700"
          >
            Play Again
          </Button>
        </div>
      </Card>
    );
  }

  // Active game UI
  return (
    <Card className="p-6">
      <div className="space-y-6">
        {isCreator ? (
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">You created the word:</h3>
            <p className="text-2xl font-mono tracking-wider">{currentGame.word}</p>
            <p className="text-gray-500">Wait for your partner to guess!</p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <pre className="font-mono text-lg">
                {HANGMAN_DRAWINGS[currentGame.wrongGuesses]}
              </pre>
            </div>

            <div className="text-center">
              <p className="text-2xl font-mono tracking-wider mb-2">
                {currentGame.word
                  .split('')
                  .map(letter => currentGame.guessedLetters.includes(letter) ? letter : '_')
                  .join(' ')}
              </p>
              <p className="text-sm text-gray-500">
                Wrong guesses: {currentGame.wrongGuesses} / {currentGame.maxGuesses}
              </p>
            </div>

            {currentGame.status === 'active' && (
              <div className="grid grid-cols-7 gap-2">
                {ALPHABET.map((letter) => (
                  <Button
                    key={letter}
                    variant="outline"
                    className={cn(
                      "w-full",
                      currentGame.guessedLetters.includes(letter) && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => makeGuess(letter)}
                    disabled={currentGame.guessedLetters.includes(letter)}
                  >
                    {letter.toUpperCase()}
                  </Button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
} 