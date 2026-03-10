/** Game difficulty settings */
export type Difficulty = "easy" | "medium" | "hard";

/** Game state phases */
export type GamePhase = "menu" | "playing" | "paused" | "gameover" | "victory";

/** 2D position */
export interface Position {
  x: number;
  y: number;
}

/** 2D velocity */
export interface Velocity {
  x: number;
  y: number;
}

/** Axis-aligned bounding box */
export interface AABB {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Alien types with different appearances and point values */
export type AlienType = "small" | "medium" | "large";

/** Single alien entity */
export interface Alien {
  id: string;
  type: AlienType;
  position: Position;
  alive: boolean;
  points: number;
  animFrame: 0 | 1;
  row: number;
  col: number;
}

/** Player bullet */
export interface Bullet {
  id: string;
  position: Position;
  velocity: Velocity;
  fromPlayer: boolean;
}

/** Defensive barrier / bunker */
export interface Barrier {
  id: string;
  position: Position;
  health: number; // 0-100
  segments: boolean[][]; // pixel-level damage grid (8x6)
}

/** UFO / mystery ship */
export interface UFO {
  active: boolean;
  position: Position;
  direction: 1 | -1;
  points: number;
}

/** Player ship */
export interface Player {
  position: Position;
  lives: number;
  isInvincible: boolean;
  invincibleTimer: number;
}

/** Particle for explosion effects */
export interface Particle {
  id: string;
  position: Position;
  velocity: Velocity;
  color: string;
  alpha: number;
  size: number;
  life: number;
  maxLife: number;
}

/** Complete game state */
export interface GameState {
  phase: GamePhase;
  score: number;
  highScore: number;
  level: number;
  difficulty: Difficulty;
  player: Player;
  aliens: Alien[];
  bullets: Bullet[];
  barriers: Barrier[];
  ufo: UFO;
  particles: Particle[];
  alienDirection: 1 | -1;
  alienMoveTimer: number;
  alienMoveInterval: number;
  alienDescendAmount: number;
  ufoTimer: number;
  shootTimer: number;
  soundEnabled: boolean;
}

/** Difficulty configuration */
export interface DifficultyConfig {
  alienMoveInterval: number;
  alienShootInterval: number;
  alienBulletSpeed: number;
  playerBulletSpeed: number;
  ufoFrequency: number;
  barrierCount: number;
}
