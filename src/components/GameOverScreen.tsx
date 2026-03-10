"use client";

import { motion } from "framer-motion";
import type { Difficulty } from "@/types/game";

interface GameOverScreenProps {
  score: number;
  highScore: number;
  level: number;
  victory: boolean;
  onRestart: (difficulty: Difficulty) => void;
  onMenu: () => void;
  difficulty: Difficulty;
}

/**
 * Game over / victory screen shown at the end of a game.
 */
export function GameOverScreen({
  score,
  highScore,
  level,
  victory,
  onRestart,
  onMenu,
  difficulty,
}: GameOverScreenProps) {
  const isNewHighScore = score >= highScore && score > 0;

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#050510]/90 z-20 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center gap-6 px-6 text-center">
        {/* Title */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
        >
          <h2
            className="text-5xl md:text-6xl font-bold font-mono tracking-widest"
            style={{
              color: victory ? "#39ff14" : "#ff0040",
              textShadow: `0 0 20px ${victory ? "#39ff14" : "#ff0040"}, 0 0 40px ${victory ? "#39ff14" : "#ff0040"}`,
            }}
          >
            {victory ? "VICTORY!" : "GAME OVER"}
          </h2>
          {victory && (
            <p className="text-lg font-mono mt-2" style={{ color: "#00ffff" }}>
              Earth has been saved!
            </p>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex flex-col gap-3 font-mono"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex gap-8 justify-center">
            <div>
              <div className="text-xs opacity-60 tracking-widest">SCORE</div>
              <div className="text-3xl font-bold" style={{ color: "#00ffff" }}>
                {score.toString().padStart(6, "0")}
              </div>
            </div>
            <div>
              <div className="text-xs opacity-60 tracking-widest">LEVEL</div>
              <div className="text-3xl font-bold" style={{ color: "#ff00ff" }}>
                {level.toString().padStart(2, "0")}
              </div>
            </div>
          </div>

          {isNewHighScore && (
            <motion.div
              className="text-xl font-bold tracking-widest"
              style={{ color: "#ffff00", textShadow: "0 0 10px #ffff00" }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              ★ NEW HIGH SCORE! ★
            </motion.div>
          )}

          <div className="text-sm opacity-60">
            HIGH SCORE: {highScore.toString().padStart(6, "0")}
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex flex-col gap-3 w-full max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            className="border-2 py-3 px-6 font-mono font-bold tracking-widest text-lg"
            style={{ borderColor: "#00ffff", color: "#00ffff" }}
            onClick={() => onRestart(difficulty)}
            whileHover={{ scale: 1.04, backgroundColor: "rgba(0,255,255,0.1)" }}
            whileTap={{ scale: 0.97 }}
          >
            PLAY AGAIN
          </motion.button>
          <motion.button
            className="border-2 py-3 px-6 font-mono font-bold tracking-widest text-lg"
            style={{ borderColor: "#ffffff40", color: "#ffffff80" }}
            onClick={onMenu}
            whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.05)" }}
            whileTap={{ scale: 0.97 }}
          >
            MAIN MENU
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
