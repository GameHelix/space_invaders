import type { DifficultyConfig } from "@/types/game";

/** Canvas dimensions */
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

/** Player */
export const PLAYER_WIDTH = 40;
export const PLAYER_HEIGHT = 24;
export const PLAYER_SPEED = 300; // px/s
export const PLAYER_BULLET_COOLDOWN = 400; // ms

/** Aliens */
export const ALIEN_COLS = 11;
export const ALIEN_ROWS = 5;
export const ALIEN_WIDTH = 32;
export const ALIEN_HEIGHT = 24;
export const ALIEN_H_SPACING = 48;
export const ALIEN_V_SPACING = 40;
export const ALIEN_TOP_MARGIN = 80;
export const ALIEN_LEFT_MARGIN = 64;
export const ALIEN_DESCEND_STEP = 16; // px per edge-hit

/** Points per alien type */
export const ALIEN_POINTS: Record<string, number> = {
  small: 30,
  medium: 20,
  large: 10,
};

/** UFO */
export const UFO_WIDTH = 48;
export const UFO_HEIGHT = 20;
export const UFO_SPEED = 150;
export const UFO_MIN_POINTS = 50;
export const UFO_MAX_POINTS = 300;

/** Barriers */
export const BARRIER_COUNT = 4;
export const BARRIER_WIDTH = 64;
export const BARRIER_HEIGHT = 48;
export const BARRIER_SEGMENTS_X = 8;
export const BARRIER_SEGMENTS_Y = 6;

/** Bullets */
export const BULLET_WIDTH = 3;
export const BULLET_HEIGHT = 12;

/** Difficulty presets */
export const DIFFICULTY_CONFIGS: Record<string, DifficultyConfig> = {
  easy: {
    alienMoveInterval: 900,
    alienShootInterval: 2000,
    alienBulletSpeed: 150,
    playerBulletSpeed: 500,
    ufoFrequency: 0.0005,
    barrierCount: 4,
  },
  medium: {
    alienMoveInterval: 600,
    alienShootInterval: 1400,
    alienBulletSpeed: 200,
    playerBulletSpeed: 550,
    ufoFrequency: 0.0008,
    barrierCount: 4,
  },
  hard: {
    alienMoveInterval: 350,
    alienShootInterval: 900,
    alienBulletSpeed: 280,
    playerBulletSpeed: 600,
    ufoFrequency: 0.0012,
    barrierCount: 3,
  },
};

/** Colors */
export const COLORS = {
  background: "#050510",
  neonCyan: "#00ffff",
  neonGreen: "#39ff14",
  neonPink: "#ff00ff",
  neonYellow: "#ffff00",
  neonOrange: "#ff6600",
  neonRed: "#ff0040",
  alienSmall: "#ff00ff",
  alienMedium: "#00ffff",
  alienLarge: "#39ff14",
  player: "#00ffff",
  playerBullet: "#00ffff",
  alienBullet: "#ff0040",
  barrier: "#39ff14",
  ufo: "#ff6600",
  particle: "#ffff00",
};
