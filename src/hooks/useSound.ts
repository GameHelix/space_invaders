import { useRef, useCallback } from "react";

/**
 * Simple Web Audio API sound manager.
 * Generates synthesized sound effects procedurally.
 */
export function useSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext | null => {
    if (!enabled) return null;
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return ctxRef.current;
  }, [enabled]);

  /** Play a tone burst */
  const playTone = useCallback(
    (freq: number, duration: number, type: OscillatorType = "square", gain = 0.3) => {
      const ctx = getCtx();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + duration);
        gainNode.gain.setValueAtTime(gain, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
      } catch (_) {
        // ignore audio errors
      }
    },
    [getCtx]
  );

  const playShoot = useCallback(() => playTone(880, 0.08, "square", 0.2), [playTone]);
  const playAlienShoot = useCallback(() => playTone(220, 0.12, "sawtooth", 0.15), [playTone]);
  const playExplosion = useCallback(() => {
    playTone(180, 0.3, "sawtooth", 0.4);
    setTimeout(() => playTone(80, 0.4, "square", 0.3), 50);
  }, [playTone]);
  const playPlayerHit = useCallback(() => {
    playTone(400, 0.15, "sawtooth", 0.5);
    setTimeout(() => playTone(200, 0.2, "sawtooth", 0.4), 100);
    setTimeout(() => playTone(100, 0.3, "square", 0.3), 200);
  }, [playTone]);
  const playUFO = useCallback(() => playTone(440, 0.1, "sine", 0.2), [playTone]);
  const playLevelUp = useCallback(() => {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 0.15, "sine", 0.3), i * 120));
  }, [playTone]);

  return { playShoot, playAlienShoot, playExplosion, playPlayerHit, playUFO, playLevelUp };
}
