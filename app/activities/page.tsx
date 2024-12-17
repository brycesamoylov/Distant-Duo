"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2 } from "lucide-react";
import { useState } from "react";
import { Hangman } from "@/components/games/hangman";
import { Wordle } from "@/components/games/wordle";

type Game = {
  icon: typeof Gamepad2;
  label: string;
  description: string;
  players: string;
  comingSoon: boolean;
  component?: () => JSX.Element;
};

const games: Game[] = [
  { 
    icon: Gamepad2,
    label: "Hangman",
    description: "Classic word guessing game to play together",
    players: "2 Players",
    comingSoon: false,
    component: Hangman
  },
  { 
    icon: Gamepad2,
    label: "Wordle",
    description: "Guess the same word together and compare results",
    players: "2 Players",
    comingSoon: false,
    component: Wordle
  }
];

export default function ActivitiesPage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Activities Together</h1>
        <p className="text-gray-500">Play games together, even when apart</p>
      </section>

      {selectedGame?.component ? (
        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={() => setSelectedGame(null)}
            className="mb-4"
          >
            ← Back to Games
          </Button>
          <selectedGame.component />
        </div>
      ) : (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Games</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {games.map((game) => (
              <Card 
                key={game.label} 
                className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => !game.comingSoon && setSelectedGame(game)}
              >
                <game.icon className="h-8 w-8 text-pink-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{game.label}</h3>
                <p className="text-gray-500 mb-4">{game.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{game.players}</span>
                  <Button 
                    className="bg-pink-600 hover:bg-pink-700"
                    disabled={game.comingSoon}
                  >
                    {game.comingSoon ? "Coming Soon" : "Play Now"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}