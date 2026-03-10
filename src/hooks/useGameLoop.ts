import { useEffect, useRef, useCallback } from "react";

type UpdateFn = (dt: number) => void;

/**
 * Runs a requestAnimationFrame game loop.
 * Calls `update(dt)` every frame with delta time in seconds.
 */
export function useGameLoop(update: UpdateFn, running: boolean): void {
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const updateRef = useRef<UpdateFn>(update);
  updateRef.current = update;

  const loop = useCallback((timestamp: number) => {
    const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05); // cap at 50ms
    lastTimeRef.current = timestamp;
    updateRef.current(dt);
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (!running) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, loop]);
}
