import type { GameState, Alien, Barrier, AlienType } from "@/types/game";
import {
  ALIEN_COLS, ALIEN_ROWS, ALIEN_WIDTH, ALIEN_H_SPACING,
  ALIEN_V_SPACING, ALIEN_TOP_MARGIN, ALIEN_LEFT_MARGIN,
  ALIEN_POINTS, BARRIER_COUNT, CANVAS_WIDTH, CANVAS_HEIGHT,
  BARRIER_WIDTH, BARRIER_HEIGHT, BARRIER_SEGMENTS_X, BARRIER_SEGMENTS_Y,
  DIFFICULTY_CONFIGS,
} from "@/constants/game";
import type { Difficulty } from "@/types/game";

/** Determine alien type based on row index */
function getAlienType(row: number): AlienType {
  if (row === 0) return "small";
  if (row <= 2) return "medium";
  return "large";
}

/** Build the initial alien grid */
export function createAliens(): Alien[] {
  const aliens: Alien[] = [];
  for (let row = 0; row < ALIEN_ROWS; row++) {
    for (let col = 0; col < ALIEN_COLS; col++) {
      const type = getAlienType(row);
      aliens.push({
        id: `alien-${row}-${col}`,
        type,
        row,
        col,
        position: {
          x: ALIEN_LEFT_MARGIN + col * ALIEN_H_SPACING,
          y: ALIEN_TOP_MARGIN + row * ALIEN_V_SPACING,
        },
        alive: true,
        points: ALIEN_POINTS[type],
        animFrame: 0,
      });
    }
  }
  return aliens;
}

/** Build barrier structures */
export function createBarriers(count: number): Barrier[] {
  const barriers: Barrier[] = [];
  const totalWidth = count * BARRIER_WIDTH + (count - 1) * 60;
  const startX = (CANVAS_WIDTH - totalWidth) / 2;
  const barrierY = CANVAS_HEIGHT - 140;

  for (let i = 0; i < count; i++) {
    const segments: boolean[][] = [];
    for (let sy = 0; sy < BARRIER_SEGMENTS_Y; sy++) {
      const row: boolean[] = [];
      for (let sx = 0; sx < BARRIER_SEGMENTS_X; sx++) {
        // Create arch shape: remove bottom corners and top-center notch
        const isBottomCorner =
          sy >= BARRIER_SEGMENTS_Y - 2 && (sx < 2 || sx >= BARRIER_SEGMENTS_X - 2);
        row.push(!isBottomCorner);
      }
      segments.push(row);
    }
    barriers.push({
      id: `barrier-${i}`,
      position: { x: startX + i * (BARRIER_WIDTH + 60), y: barrierY },
      health: 100,
      segments,
    });
  }
  return barriers;
}

/** Create initial game state */
export function createInitialGameState(difficulty: Difficulty, highScore: number): GameState {
  const config = DIFFICULTY_CONFIGS[difficulty];
  return {
    phase: "playing",
    score: 0,
    highScore,
    level: 1,
    difficulty,
    player: {
      position: { x: CANVAS_WIDTH / 2 - 20, y: CANVAS_HEIGHT - 60 },
      lives: 3,
      isInvincible: false,
      invincibleTimer: 0,
    },
    aliens: createAliens(),
    bullets: [],
    barriers: createBarriers(config.barrierCount),
    ufo: {
      active: false,
      position: { x: -60, y: 40 },
      direction: 1,
      points: 100,
    },
    particles: [],
    alienDirection: 1,
    alienMoveTimer: 0,
    alienMoveInterval: config.alienMoveInterval,
    alienDescendAmount: 0,
    ufoTimer: 0,
    shootTimer: 0,
    soundEnabled: true,
  };
}
