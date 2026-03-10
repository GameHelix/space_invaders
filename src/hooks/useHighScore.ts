import { useState, useEffect } from "react";

const HIGH_SCORE_KEY = "space_invaders_highscore";

/** Persists high score to localStorage */
export function useHighScore(): [number, (score: number) => void] {
  const [highScore, setHighScore] = useState<number>(0);

  useEffect(() => {
    const stored = localStorage.getItem(HIGH_SCORE_KEY);
    if (stored) setHighScore(parseInt(stored, 10));
  }, []);

  const updateHighScore = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem(HIGH_SCORE_KEY, score.toString());
    }
  };

  return [highScore, updateHighScore];
}
