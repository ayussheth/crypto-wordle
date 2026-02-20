"use client";

import { LetterState } from "@/lib/game";

interface TileProps {
  letter: string;
  state: LetterState;
  delay?: number;
  shouldFlip?: boolean;
  shouldBounce?: boolean;
  shouldPop?: boolean;
}

const stateColors: Record<LetterState, string> = {
  correct: "bg-correct/90 border-correct",
  misplaced: "bg-misplaced/90 border-misplaced",
  wrong: "bg-wrong border-wrong",
  empty: "bg-transparent border-[#2a2a3e]",
  pending: "bg-transparent border-[#4a4a5e]",
};

const stateText: Record<LetterState, string> = {
  correct: "text-black font-bold",
  misplaced: "text-black font-bold",
  wrong: "text-gray-300 font-bold",
  empty: "text-white",
  pending: "text-white font-bold",
};

export default function Tile({ letter, state, delay = 0, shouldFlip, shouldBounce, shouldPop }: TileProps) {
  const animClass = shouldFlip
    ? "tile-flip"
    : shouldBounce
    ? "tile-bounce"
    : shouldPop
    ? "tile-pop"
    : "";

  return (
    <div
      className={`
        w-[52px] h-[52px] sm:w-[58px] sm:h-[58px]
        border-2 rounded-md
        flex items-center justify-center
        text-2xl sm:text-3xl uppercase
        transition-colors duration-300
        ${stateColors[state]}
        ${stateText[state]}
        ${animClass}
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {letter}
    </div>
  );
}
