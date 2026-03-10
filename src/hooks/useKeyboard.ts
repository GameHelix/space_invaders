import { useEffect, useRef } from "react";

export interface KeyState {
  left: boolean;
  right: boolean;
  fire: boolean;
  pause: boolean;
}

/**
 * Tracks keyboard input state and returns a ref to the current keys.
 * Also accepts an onKeyDown callback for single-press actions.
 */
export function useKeyboard(onKeyDown?: (key: string) => void): React.RefObject<KeyState> {
  const keysRef = useRef<KeyState>({
    left: false,
    right: false,
    fire: false,
    pause: false,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = keysRef.current;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") k.left = true;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") k.right = true;
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") k.fire = true;
      if (e.key === "p" || e.key === "P" || e.key === "Escape") {
        onKeyDown?.("pause");
      }
      e.preventDefault();
    };

    const up = (e: KeyboardEvent) => {
      const k = keysRef.current;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") k.left = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") k.right = false;
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") k.fire = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [onKeyDown]);

  return keysRef;
}
