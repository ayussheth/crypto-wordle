import { ANSWERS, isValidGuess, getThemeWords } from "@/data/words";

export type LetterState = "correct" | "misplaced" | "wrong" | "empty" | "pending";

export interface TileData {
  letter: string;
  state: LetterState;
}

export interface GameState {
  guesses: string[];
  currentGuess: string;
  gameOver: boolean;
  won: boolean;
  dayIndex: number;
}

// Get a consistent day index from the date
function getDayIndex(): number {
  const start = new Date(2025, 0, 1); // Jan 1 2025
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getTodayWord(): string {
  const idx = getDayIndex();
  return ANSWERS[idx % ANSWERS.length];
}

export function getRandomWord(themeId?: string): string {
  const words = themeId ? getThemeWords(themeId) : ANSWERS;
  return words[Math.floor(Math.random() * words.length)];
}

export function getDayNumber(): number {
  return getDayIndex();
}

export function evaluateGuess(guess: string, answer: string): LetterState[] {
  const result: LetterState[] = Array(5).fill("wrong");
  const answerArr = answer.split("");
  const guessArr = guess.split("");
  const used = Array(5).fill(false);

  // First pass: correct positions
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === answerArr[i]) {
      result[i] = "correct";
      used[i] = true;
    }
  }

  // Second pass: misplaced
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    for (let j = 0; j < 5; j++) {
      if (!used[j] && guessArr[i] === answerArr[j]) {
        result[i] = "misplaced";
        used[j] = true;
        break;
      }
    }
  }

  return result;
}

export function getKeyboardStates(
  guesses: string[],
  answer: string
): Record<string, LetterState> {
  const states: Record<string, LetterState> = {};
  const priority: Record<LetterState, number> = {
    correct: 3,
    misplaced: 2,
    wrong: 1,
    pending: 0,
    empty: 0,
  };

  for (const guess of guesses) {
    const eval_ = evaluateGuess(guess, answer);
    for (let i = 0; i < 5; i++) {
      const letter = guess[i];
      const current = states[letter] || "empty";
      if (priority[eval_[i]] > priority[current]) {
        states[letter] = eval_[i];
      }
    }
  }

  return states;
}

const STORAGE_KEY = "cryptowordle-state";

export function loadGameState(): GameState {
  const dayIndex = getDayIndex();
  if (typeof window === "undefined") {
    return { guesses: [], currentGuess: "", gameOver: false, won: false, dayIndex };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as GameState;
      if (saved.dayIndex === dayIndex) {
        return { ...saved, currentGuess: "" };
      }
    }
  } catch {}

  return { guesses: [], currentGuess: "", gameOver: false, won: false, dayIndex };
}

export function saveGameState(state: GameState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      guesses: state.guesses,
      gameOver: state.gameOver,
      won: state.won,
      dayIndex: state.dayIndex,
    }));
  } catch {}
}

export function generateShareText(guesses: string[], answer: string, won: boolean): string {
  const dayNum = getDayNumber();
  const score = won ? `${guesses.length}/6` : "X/6";
  const grid = guesses
    .map((guess) => {
      const eval_ = evaluateGuess(guess, answer);
      return eval_
        .map((s) => (s === "correct" ? "🟩" : s === "misplaced" ? "🟨" : "⬛"))
        .join("");
    })
    .join("\n");

  return `CryptoWordle 🔗 #${dayNum} ${score}\n\n${grid}\n\nPlay now 👇\nhttps://crypto-wordle-mu.vercel.app`;
}

export function getHint(answer: string, guesses: string[], hintsUsed: number): string {
  const hints: string[] = [];
  const guessedLetters = new Set(guesses.join("").split(""));
  const unrevealedLetters = answer.split("").filter((l) => !guessedLetters.has(l));

  // Hint type 1: reveal a letter that hasn't been guessed
  if (unrevealedLetters.length > 0 && hintsUsed === 0) {
    const letter = unrevealedLetters[0];
    hints.push(`The word contains the letter "${letter}"`);
  }
  // Hint type 2: position hint
  else if (hintsUsed === 1) {
    // Find a position that hasn't been correctly guessed
    for (let i = 0; i < 5; i++) {
      const posGuessed = guesses.some((g) => g[i] === answer[i]);
      if (!posGuessed) {
        hints.push(`Position ${i + 1} is "${answer[i]}"`);
        break;
      }
    }
    if (hints.length === 0) hints.push(`Think about blockchain terminology...`);
  }
  // Hint type 3: category hint
  else {
    const categories: Record<string, string[]> = {
      "related to consensus/validation": ["BLOCK", "CHAIN", "STAKE", "PROOF", "NODES", "EPOCH", "VALID", "MERGE", "PHASE"],
      "related to trading/DeFi": ["TRADE", "YIELD", "SWAPS", "POOLS", "LONGS", "SHORT", "PRICE", "HEDGE", "PERPS", "FARMS"],
      "crypto culture/slang": ["WHALE", "DEGEN", "HODLS", "BASED", "ALPHA", "BULLS", "BEARS", "PUMPS", "DUMPS"],
      "related to technology": ["SMART", "NONCE", "HASHS", "BYTES", "BATCH", "BLOBS", "SHARD", "LAYER", "CRYPT"],
      "related to tokens/assets": ["TOKEN", "MINTS", "BURNS", "DROPS", "COINS", "ETHER", "ASSET", "FUNDS"],
    };
    for (const [cat, words] of Object.entries(categories)) {
      if (words.includes(answer)) {
        hints.push(`This word is ${cat}`);
        break;
      }
    }
    if (hints.length === 0) hints.push(`It's a common crypto/web3 term`);
  }

  return hints[0] || "No more hints available";
}

export { isValidGuess };
