"use client";

import { useRef, useEffect } from "react";
import type { GameState } from "@/types/game";
import { renderGame } from "@/utils/renderer";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/constants/game";

interface GameCanvasProps {
  gameState: GameState;
  className?: string;
}

/**
 * Canvas component that renders the Space Invaders game.
 * Scales to fit the container while maintaining aspect ratio.
 */
export function GameCanvas({ gameState, className = "" }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Render game state to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderGame(ctx, gameState, CANVAS_WIDTH, CANVAS_HEIGHT);
  });

  return (
    <div ref={containerRef} className={`relative flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="max-w-full max-h-full object-contain"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
