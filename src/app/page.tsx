"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Board from "@/components/Board";
import Keyboard from "@/components/Keyboard";
import Toast from "@/components/Toast";
import {
  getTodayWord,
  getRandomWord,
  getDayNumber,
  loadGameState,
  saveGameState,
  getKeyboardStates,
  generateShareText,
  isValidGuess,
  getHint,
  GameState,
} from "@/lib/game";
import { THEMES, getThemeWords } from "@/data/words";

export default function Home() {
  const [answer, setAnswer] = useState(() => getTodayWord());
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [revealRow, setRevealRow] = useState<number | null>(null);
  const [bounceRow, setBounceRow] = useState<number | null>(null);
  const [toast, setToast] = useState({ message: "", show: false });
  const [sdkReady, setSdkReady] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showWordList, setShowWordList] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("all");
  const sdkRef = useRef<any>(null);

  // Load game state & Farcaster SDK
  useEffect(() => {
    setGameState(loadGameState());

    // Dynamically import Farcaster SDK
    import("@farcaster/miniapp-sdk")
      .then((mod) => {
        const sdk = mod.default || mod;
        sdkRef.current = sdk;
        if (sdk?.actions?.ready) {
          sdk.actions.ready();
        }
        setSdkReady(true);
      })
      .catch(() => {
        // Not in Farcaster context, still works as standalone
        setSdkReady(false);
      });
  }, []);

  // Save state on changes
  useEffect(() => {
    if (gameState) saveGameState(gameState);
  }, [gameState]);

  const showToast = useCallback((msg: string) => {
    setToast({ message: msg, show: true });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 1600);
  }, []);

  const handleKey = useCallback(
    (key: string) => {
      if (!gameState || gameState.gameOver) return;

      if (key === "⌫") {
        setGameState((s) =>
          s ? { ...s, currentGuess: s.currentGuess.slice(0, -1) } : s
        );
        return;
      }

      if (key === "ENTER") {
        if (gameState.currentGuess.length !== 5) {
          setShakeRow(gameState.guesses.length);
          showToast("Not enough letters");
          setTimeout(() => setShakeRow(null), 500);
          return;
        }

        if (!isValidGuess(gameState.currentGuess)) {
          setShakeRow(gameState.guesses.length);
          showToast("Not in word list");
          setTimeout(() => setShakeRow(null), 500);
          return;
        }

        const guess = gameState.currentGuess.toUpperCase();
        const won = guess === answer;
        const newGuesses = [...gameState.guesses, guess];
        const gameOver = won || newGuesses.length >= 6;

        setRevealRow(gameState.guesses.length);
        setTimeout(() => setRevealRow(null), 600);

        if (won) {
          setTimeout(() => {
            setBounceRow(newGuesses.length - 1);
            setTimeout(() => setBounceRow(null), 500);
          }, 700);
        }

        setGameState({
          ...gameState,
          guesses: newGuesses,
          currentGuess: "",
          gameOver,
          won,
        });

        if (gameOver && !won) {
          setTimeout(() => showToast(answer), 700);
        }

        return;
      }

      // Letter key
      if (gameState.currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
        setGameState((s) =>
          s ? { ...s, currentGuess: s.currentGuess + key } : s
        );
      }
    },
    [gameState, answer, showToast]
  );

  // Physical keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Enter") handleKey("ENTER");
      else if (e.key === "Backspace") handleKey("⌫");
      else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKey]);

  const handleShare = async () => {
    if (!gameState) return;
    const text = generateShareText(gameState.guesses, answer, gameState.won);

    // Try Farcaster cast first
    try {
      if (sdkRef.current?.actions?.composeCast) {
        await sdkRef.current.actions.composeCast({
          text,
        });
        return;
      }
    } catch {}

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard!");
    } catch {
      showToast("Could not share");
    }
  };

  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-correct text-2xl font-bold animate-pulse">
          CryptoWordle 🔗
        </div>
      </div>
    );
  }

  const keyStates = getKeyboardStates(gameState.guesses, answer);

  return (
    <main className="flex flex-col items-center justify-between min-h-screen max-w-[424px] mx-auto py-3 px-2 relative">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold tracking-wider">
          <span className="text-correct">Crypto</span>
          <span className="text-white">Wordle</span>
          <span className="ml-1">🔗</span>
        </h1>
        <p className="text-[10px] text-gray-500 tracking-widest uppercase">
          Daily crypto word puzzle · #{getDayNumber()}
        </p>
        <div className="flex gap-3 justify-center mt-2">
          <button
            onClick={() => setShowThemes(true)}
            className="text-[10px] text-gray-500 hover:text-correct transition-colors px-2 py-1 border border-gray-800 rounded hover:border-correct/50"
          >
            {THEMES.find(t => t.id === currentTheme)?.emoji} {THEMES.find(t => t.id === currentTheme)?.name}
          </button>
          <button
            onClick={() => setShowWordList(true)}
            className="text-[10px] text-gray-500 hover:text-correct transition-colors px-2 py-1 border border-gray-800 rounded hover:border-correct/50"
          >
            📖 Word List
          </button>
        </div>
      </div>

      {/* Theme Selector Modal */}
      {showThemes && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowThemes(false)}>
          <div className="bg-[#1a1a2e] rounded-xl p-5 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-1">Choose Theme</h2>
            <p className="text-xs text-gray-500 mb-4">Pick a category and start a new game</p>
            <div className="flex flex-col gap-2">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setCurrentTheme(theme.id);
                    const words = getThemeWords(theme.id);
                    setAnswer(words[Math.floor(Math.random() * words.length)]);
                    localStorage.removeItem("cryptowordle-state");
                    setGameState({
                      guesses: [],
                      currentGuess: "",
                      gameOver: false,
                      won: false,
                      dayIndex: -1,
                    });
                    setHint(null);
                    setHintsUsed(0);
                    setShowThemes(false);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                    currentTheme === theme.id
                      ? "bg-correct/20 border border-correct/50"
                      : "bg-gray-800/50 border border-gray-700 hover:border-gray-500"
                  }`}
                >
                  <span className="text-2xl">{theme.emoji}</span>
                  <div>
                    <div className="text-sm font-bold text-white">{theme.name}</div>
                    <div className="text-[10px] text-gray-400">{theme.description} · {theme.words.length} words</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Word List Modal */}
      {showWordList && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowWordList(false)}>
          <div className="bg-[#1a1a2e] rounded-xl p-5 max-w-sm w-full max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-white">
                {THEMES.find(t => t.id === currentTheme)?.emoji} {THEMES.find(t => t.id === currentTheme)?.name} Words
              </h2>
              <button onClick={() => setShowWordList(false)} className="text-gray-500 hover:text-white text-xl">✕</button>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              The answer will be one of these {getThemeWords(currentTheme).length} words. You can guess any English word though!
            </p>
            <div className="flex flex-wrap gap-1.5">
              {getThemeWords(currentTheme).sort().map((word) => (
                <span
                  key={word}
                  className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded font-mono"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <Toast message={toast.message} show={toast.show} />

      {/* Board */}
      <Board
        guesses={gameState.guesses}
        currentGuess={gameState.currentGuess}
        answer={answer}
        shakeRow={shakeRow}
        revealRow={revealRow}
        bounceRow={bounceRow}
      />

      {/* Hint */}
      {!gameState.gameOver && gameState.guesses.length >= 2 && (
        <div className="flex flex-col items-center gap-1 my-1">
          {hint ? (
            <p className="text-xs text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-lg">
              💡 {hint}
            </p>
          ) : (
            <button
              onClick={() => {
                const h = getHint(answer, gameState.guesses, hintsUsed);
                setHint(h);
                setHintsUsed((n) => n + 1);
                setTimeout(() => setHint(null), 5000);
              }}
              className="text-xs text-gray-500 hover:text-amber-400 transition-colors px-3 py-1.5 border border-gray-700 rounded-lg hover:border-amber-400/50"
            >
              💡 Need a hint? ({3 - hintsUsed} left)
            </button>
          )}
        </div>
      )}

      {/* Game Over / Share */}
      {gameState.gameOver && (
        <div className="flex flex-col items-center gap-2 my-2">
          <p className="text-sm text-gray-400">
            {gameState.won
              ? `Solved in ${gameState.guesses.length}/6! 🎉`
              : `The word was ${answer}`}
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="bg-correct text-black font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-correct/80 transition-all active:scale-95"
            >
              Share Result
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("cryptowordle-state");
                setAnswer(getRandomWord(currentTheme));
                setGameState({
                  guesses: [],
                  currentGuess: "",
                  gameOver: false,
                  won: false,
                  dayIndex: -1,
                });
                setHint(null);
                setHintsUsed(0);
              }}
              className="bg-gray-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-gray-600 transition-all active:scale-95"
            >
              New Game
            </button>
          </div>
        </div>
      )}

      {/* Keyboard */}
      <div className="w-full mt-auto pt-2">
        <Keyboard keyStates={keyStates} onKey={handleKey} />
      </div>
    </main>
  );
}
