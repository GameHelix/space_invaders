"use client";

import { motion } from "framer-motion";
import type { Difficulty } from "@/types/game";

interface MenuScreenProps {
  highScore: number;
  onStart: (difficulty: Difficulty) => void;
}

/**
 * Main menu screen with difficulty selection and high score display.
 */
export function MenuScreen({ highScore, onStart }: MenuScreenProps) {
  const difficulties: { label: string; value: Difficulty; color: string; desc: string }[] = [
    { label: "EASY", value: "easy", color: "text-green-400 border-green-400", desc: "Slow aliens • More time to react" },
    { label: "MEDIUM", value: "medium", color: "text-yellow-400 border-yellow-400", desc: "Standard speed • Classic experience" },
    { label: "HARD", value: "hard", color: "text-red-400 border-red-400", desc: "Fast aliens • Intense action" },
  ];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050510] z-10">
      {/* Starfield */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 80 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-px bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        {/* Title */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold font-mono tracking-widest"
            style={{
              color: "#00ffff",
              textShadow: "0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 80px #00ffff",
            }}
            animate={{ textShadow: [
              "0 0 20px #00ffff, 0 0 40px #00ffff",
              "0 0 30px #00ffff, 0 0 60px #00ffff, 0 0 100px #00ffff",
              "0 0 20px #00ffff, 0 0 40px #00ffff",
            ]}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            SPACE
          </motion.h1>
          <motion.h1
            className="text-5xl md:text-7xl font-bold font-mono tracking-widest"
            style={{
              color: "#ff00ff",
              textShadow: "0 0 20px #ff00ff, 0 0 40px #ff00ff, 0 0 80px #ff00ff",
            }}
            animate={{ textShadow: [
              "0 0 20px #ff00ff, 0 0 40px #ff00ff",
              "0 0 30px #ff00ff, 0 0 60px #ff00ff, 0 0 100px #ff00ff",
              "0 0 20px #ff00ff, 0 0 40px #ff00ff",
            ]}}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          >
            INVADERS
          </motion.h1>
          <motion.p
            className="text-sm font-mono tracking-[0.4em] mt-2"
            style={{ color: "#ffffff80" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            NEON EDITION
          </motion.p>
        </motion.div>

        {/* High Score */}
        {highScore > 0 && (
          <motion.div
            className="font-mono text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="text-sm tracking-widest" style={{ color: "#ffffff60" }}>HIGH SCORE: </span>
            <span className="text-xl font-bold" style={{ color: "#ff00ff", textShadow: "0 0 10px #ff00ff" }}>
              {highScore.toString().padStart(6, "0")}
            </span>
          </motion.div>
        )}

        {/* Alien legend */}
        <motion.div
          className="flex gap-8 text-xs font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <span style={{ color: "#ff00ff" }}>▲ = 30pts</span>
          <span style={{ color: "#00ffff" }}>■ = 20pts</span>
          <span style={{ color: "#39ff14" }}>▼ = 10pts</span>
          <span style={{ color: "#ff6600" }}>UFO = ???</span>
        </motion.div>

        {/* Difficulty selection */}
        <motion.div
          className="flex flex-col items-center gap-4 w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-sm font-mono tracking-widest" style={{ color: "#ffffff80" }}>
            SELECT DIFFICULTY
          </p>
          {difficulties.map(({ label, value, color, desc }, i) => (
            <motion.button
              key={value}
              className={`w-full border-2 py-3 px-6 font-mono font-bold tracking-widest text-lg transition-all ${color} bg-transparent hover:bg-white/5`}
              onClick={() => onStart(value)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
            >
              <div>{label}</div>
              <div className="text-xs font-normal opacity-70">{desc}</div>
            </motion.button>
          ))}
        </motion.div>

        {/* Controls hint */}
        <motion.div
          className="text-center font-mono text-xs opacity-50 space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.2 }}
        >
          <div>ARROW KEYS / A-D to move • SPACE to shoot • P to pause</div>
          <div>Touch controls available on mobile</div>
        </motion.div>
      </div>
    </div>
  );
}
