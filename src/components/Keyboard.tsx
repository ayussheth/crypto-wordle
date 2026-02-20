"use client";

import { LetterState } from "@/lib/game";

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

const stateStyles: Record<string, string> = {
  correct: "bg-correct text-black",
  misplaced: "bg-misplaced text-black",
  wrong: "bg-wrong/60 text-gray-500",
  default: "bg-[#2a2a3e] text-gray-200 active:bg-[#3a3a4e]",
};

interface KeyboardProps {
  keyStates: Record<string, LetterState>;
  onKey: (key: string) => void;
}

export default function Keyboard({ keyStates, onKey }: KeyboardProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 w-full max-w-[500px] px-1">
      {ROWS.map((row, i) => (
        <div key={i} className="flex gap-1 w-full justify-center">
          {row.map((key) => {
            const state = keyStates[key];
            const style = state ? stateStyles[state] : stateStyles.default;
            const isWide = key === "ENTER" || key === "⌫";

            return (
              <button
                key={key}
                onClick={() => onKey(key)}
                className={`
                  ${isWide ? "px-3 min-w-[52px]" : "min-w-[30px] sm:min-w-[36px]"}
                  h-[46px] sm:h-[50px]
                  rounded-md font-semibold text-xs sm:text-sm
                  flex items-center justify-center
                  transition-all duration-150
                  ${style}
                `}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
