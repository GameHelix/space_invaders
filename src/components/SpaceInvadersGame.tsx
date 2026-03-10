"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Difficulty, GamePhase } from "@/types/game";
import { createInitialGameState } from "@/utils/gameInit";
import { updateGameState, advanceLevel } from "@/utils/gameLogic";
import { GameCanvas } from "./GameCanvas";
import { MenuScreen } from "./MenuScreen";
import { GameOverScreen } from "./GameOverScreen";
import { MobileControls } from "./MobileControls";
import { useGameLoop } from "@/hooks/useGameLoop";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useSound } from "@/hooks/useSound";
import { useHighScore } from "@/hooks/useHighScore";
import type { GameState } from "@/types/game";

/**
 * Root game component — manages all state and ties together
 * rendering, input, and game logic.
 */
export function SpaceInvadersGame() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [highScore, updateHighScore] = useHighScore();

  const gameStateRef = useRef<GameState | null>(null);
  const mobileLeftRef = useRef(false);
  const mobileRightRef = useRef(false);
  const prevPhaseRef = useRef<GamePhase>("menu");
  const victoryHandledRef = useRef(false);

  const sound = useSound(soundEnabled);

  // Keep ref in sync
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  /** Start or restart the game */
  const startGame = useCallback(
    (difficulty: Difficulty) => {
      const initial = createInitialGameState(difficulty, highScore);
      gameStateRef.current = initial;
      setGameState(initial);
      setPhase("playing");
      victoryHandledRef.current = false;
    },
    [highScore]
  );

  const goToMenu = useCallback(() => {
    setPhase("menu");
    setGameState(null);
  }, []);

  /** Toggle pause */
  const togglePause = useCallback(() => {
    setGameState((prev) => {
      if (!prev) return prev;
      if (prev.phase === "playing") return { ...prev, phase: "paused" };
      if (prev.phase === "paused") return { ...prev, phase: "playing" };
      return prev;
    });
  }, []);

  // Keyboard hook
  const keysRef = useKeyboard(togglePause);

  // Game loop update function
  const update = useCallback(
    (dt: number) => {
      const state = gameStateRef.current;
      if (!state || state.phase !== "playing") return;

      const left = keysRef.current.left || mobileLeftRef.current;
      const right = keysRef.current.right || mobileRightRef.current;
      const fire = keysRef.current.fire;

      const next = updateGameState(state, left, right, fire, dt);
      gameStateRef.current = next;
      setGameState({ ...next });

      // Phase transitions
      if (next.phase !== prevPhaseRef.current) {
        prevPhaseRef.current = next.phase;
        if (next.phase === "gameover") {
          updateHighScore(next.score);
          setPhase("gameover");
        } else if (next.phase === "victory" && !victoryHandledRef.current) {
          victoryHandledRef.current = true;
          sound.playLevelUp();
          updateHighScore(next.score);
          // Brief delay then advance level
          setTimeout(() => {
            setGameState((prev) => {
              if (!prev) return prev;
              const advanced = advanceLevel(prev);
              gameStateRef.current = advanced;
              victoryHandledRef.current = false;
              prevPhaseRef.current = "playing";
              return advanced;
            });
          }, 1500);
        }
      }
    },
    [keysRef, sound, updateHighScore]
  );

  useGameLoop(update, phase === "playing");

  // Mobile input handlers
  const handleMobileLeft = useCallback((active: boolean) => {
    mobileLeftRef.current = active;
  }, []);
  const handleMobileRight = useCallback((active: boolean) => {
    mobileRightRef.current = active;
  }, []);
  const handleMobileFire = useCallback(() => {
    if (keysRef.current) keysRef.current.fire = true;
    setTimeout(() => {
      if (keysRef.current) keysRef.current.fire = false;
    }, 100);
  }, [keysRef]);

  return (
    <div className="w-screen h-screen flex flex-col bg-[#050510] overflow-hidden">
      {/* Sound toggle */}
      <div className="absolute top-4 right-4 z-30">
        <motion.button
          className="border border-white/20 text-white/60 font-mono text-xs px-3 py-1.5 rounded hover:border-white/40 hover:text-white/80 transition-colors"
          onClick={() => setSoundEnabled((v) => !v)}
          whileTap={{ scale: 0.95 }}
        >
          {soundEnabled ? "🔊 SFX ON" : "🔇 SFX OFF"}
        </motion.button>
      </div>

      {/* Menu */}
      <AnimatePresence>
        {phase === "menu" && (
          <MenuScreen highScore={highScore} onStart={startGame} />
        )}
      </AnimatePresence>

      {/* Game area */}
      {gameState && (phase === "playing" || phase === "gameover") && (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Canvas */}
          <div className="flex-1 flex items-center justify-center min-h-0 p-2">
            <GameCanvas
              gameState={gameState}
              className="w-full h-full"
            />
          </div>

          {/* Mobile controls */}
          <div className="md:hidden shrink-0 border-t border-white/10 bg-[#0a0a1a]">
            <MobileControls
              onLeft={handleMobileLeft}
              onRight={handleMobileRight}
              onFire={handleMobileFire}
              onPause={togglePause}
            />
          </div>
        </div>
      )}

      {/* Game over overlay */}
      <AnimatePresence>
        {phase === "gameover" && gameState && (
          <GameOverScreen
            score={gameState.score}
            highScore={highScore}
            level={gameState.level}
            victory={false}
            difficulty={gameState.difficulty}
            onRestart={startGame}
            onMenu={goToMenu}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
