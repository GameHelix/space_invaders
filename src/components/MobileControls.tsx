"use client";

import { useCallback, useRef } from "react";
import { motion } from "framer-motion";

interface MobileControlsProps {
  onLeft: (active: boolean) => void;
  onRight: (active: boolean) => void;
  onFire: () => void;
  onPause: () => void;
}

/**
 * On-screen touch controls for mobile play.
 * Uses pointer events for reliable cross-device support.
 */
export function MobileControls({ onLeft, onRight, onFire, onPause }: MobileControlsProps) {
  const leftRef = useRef(false);
  const rightRef = useRef(false);

  const handleLeft = useCallback((active: boolean) => {
    if (leftRef.current === active) return;
    leftRef.current = active;
    onLeft(active);
  }, [onLeft]);

  const handleRight = useCallback((active: boolean) => {
    if (rightRef.current === active) return;
    rightRef.current = active;
    onRight(active);
  }, [onRight]);

  const btnBase =
    "select-none touch-none flex items-center justify-center font-mono font-bold rounded-lg border-2 active:scale-95 transition-transform";

  return (
    <div className="flex items-center justify-between px-4 py-2 gap-3">
      {/* Left / Right */}
      <div className="flex gap-3">
        <motion.button
          className={`${btnBase} w-14 h-14 text-2xl border-cyan-400 text-cyan-400`}
          style={{ boxShadow: "0 0 12px #00ffff80" }}
          onPointerDown={() => handleLeft(true)}
          onPointerUp={() => handleLeft(false)}
          onPointerLeave={() => handleLeft(false)}
          whileTap={{ scale: 0.9, backgroundColor: "rgba(0,255,255,0.15)" }}
        >
          ◀
        </motion.button>
        <motion.button
          className={`${btnBase} w-14 h-14 text-2xl border-cyan-400 text-cyan-400`}
          style={{ boxShadow: "0 0 12px #00ffff80" }}
          onPointerDown={() => handleRight(true)}
          onPointerUp={() => handleRight(false)}
          onPointerLeave={() => handleRight(false)}
          whileTap={{ scale: 0.9, backgroundColor: "rgba(0,255,255,0.15)" }}
        >
          ▶
        </motion.button>
      </div>

      {/* Pause */}
      <motion.button
        className={`${btnBase} w-12 h-12 text-sm border-white/30 text-white/60`}
        onClick={onPause}
        whileTap={{ scale: 0.9 }}
      >
        ⏸
      </motion.button>

      {/* Fire */}
      <motion.button
        className={`${btnBase} w-20 h-14 text-sm border-pink-500 text-pink-400`}
        style={{ boxShadow: "0 0 12px #ff00ff80" }}
        onPointerDown={onFire}
        whileTap={{ scale: 0.9, backgroundColor: "rgba(255,0,255,0.15)" }}
      >
        FIRE
      </motion.button>
    </div>
  );
}
