"use client";

import Tile from "./Tile";
import { evaluateGuess, LetterState } from "@/lib/game";

interface BoardProps {
  guesses: string[];
  currentGuess: string;
  answer: string;
  shakeRow: number | null;
  revealRow: number | null;
  bounceRow: number | null;
}

export default function Board({ guesses, currentGuess, answer, shakeRow, revealRow, bounceRow }: BoardProps) {
  const rows: { letters: string[]; states: LetterState[]; isCurrentRow: boolean }[] = [];

  // Completed guesses
  for (let i = 0; i < guesses.length; i++) {
    const states = evaluateGuess(guesses[i], answer);
    rows.push({
      letters: guesses[i].split(""),
      states,
      isCurrentRow: false,
    });
  }

  // Current guess row
  if (guesses.length < 6) {
    const letters = currentGuess.padEnd(5, " ").split("");
    const states: LetterState[] = letters.map((l, i) =>
      i < currentGuess.length ? "pending" : "empty"
    );
    rows.push({ letters, states, isCurrentRow: true });
  }

  // Empty remaining rows
  while (rows.length < 6) {
    rows.push({
      letters: Array(5).fill(" "),
      states: Array(5).fill("empty") as LetterState[],
      isCurrentRow: false,
    });
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      {rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className={`flex gap-1.5 ${shakeRow === rowIdx ? "row-shake" : ""}`}
        >
          {row.letters.map((letter, colIdx) => (
            <Tile
              key={`${rowIdx}-${colIdx}`}
              letter={letter.trim()}
              state={row.states[colIdx]}
              delay={revealRow === rowIdx ? colIdx * 100 : 0}
              shouldFlip={revealRow === rowIdx}
              shouldBounce={bounceRow === rowIdx}
              shouldPop={row.isCurrentRow && colIdx === currentGuess.length - 1 && letter.trim() !== ""}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
