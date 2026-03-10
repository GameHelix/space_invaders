import type { GameState, Bullet, Particle, Alien, AABB } from "@/types/game";
import {
  CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_SPEED, PLAYER_WIDTH, PLAYER_HEIGHT,
  BULLET_WIDTH, BULLET_HEIGHT, ALIEN_WIDTH, ALIEN_HEIGHT, UFO_WIDTH, UFO_HEIGHT,
  UFO_SPEED, BARRIER_WIDTH, BARRIER_HEIGHT, BARRIER_SEGMENTS_X, BARRIER_SEGMENTS_Y,
  DIFFICULTY_CONFIGS, ALIEN_DESCEND_STEP, UFO_MIN_POINTS, UFO_MAX_POINTS,
  COLORS,
} from "@/constants/game";
import { createAliens, createBarriers } from "./gameInit";
import { nanoid } from "nanoid";

/** Check AABB collision */
function aabbCollide(a: AABB, b: AABB): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/** Clamp a value between min and max */
function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/** Spawn an explosion of particles */
function spawnParticles(
  state: GameState,
  x: number,
  y: number,
  color: string,
  count = 12
): void {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = 60 + Math.random() * 120;
    state.particles.push({
      id: nanoid(6),
      position: { x, y },
      velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
      color,
      alpha: 1,
      size: 2 + Math.random() * 3,
      life: 0,
      maxLife: 0.4 + Math.random() * 0.4,
    });
  }
}

/** Move player left/right, returns new state (mutated in-place for perf) */
export function updatePlayer(
  state: GameState,
  left: boolean,
  right: boolean,
  dt: number
): void {
  const p = state.player;
  const speed = PLAYER_SPEED * dt;
  if (left) p.position.x -= speed;
  if (right) p.position.x += speed;
  p.position.x = clamp(p.position.x, 0, CANVAS_WIDTH - PLAYER_WIDTH);

  // Invincibility countdown
  if (p.isInvincible) {
    p.invincibleTimer -= dt;
    if (p.invincibleTimer <= 0) {
      p.isInvincible = false;
      p.invincibleTimer = 0;
    }
  }
}

/** Fire a player bullet */
export function firePlayerBullet(state: GameState): void {
  // Allow only one player bullet at a time
  if (state.bullets.some((b) => b.fromPlayer)) return;
  const config = DIFFICULTY_CONFIGS[state.difficulty];
  state.bullets.push({
    id: nanoid(6),
    position: {
      x: state.player.position.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
      y: state.player.position.y,
    },
    velocity: { x: 0, y: -config.playerBulletSpeed },
    fromPlayer: true,
  });
}

/** Alien shooting logic */
function fireAlienBullet(state: GameState): void {
  const aliveAliens = state.aliens.filter((a) => a.alive);
  if (aliveAliens.length === 0) return;

  // Pick a random alien in the bottom-most row of each column
  const cols = new Map<number, Alien>();
  for (const alien of aliveAliens) {
    const existing = cols.get(alien.col);
    if (!existing || alien.row > existing.row) cols.set(alien.col, alien);
  }
  const shooters = Array.from(cols.values());
  const shooter = shooters[Math.floor(Math.random() * shooters.length)];
  if (!shooter) return;

  const config = DIFFICULTY_CONFIGS[state.difficulty];
  state.bullets.push({
    id: nanoid(6),
    position: {
      x: shooter.position.x + ALIEN_WIDTH / 2 - BULLET_WIDTH / 2,
      y: shooter.position.y + ALIEN_HEIGHT,
    },
    velocity: { x: 0, y: config.alienBulletSpeed },
    fromPlayer: false,
  });
}

/** Update all bullets, detect collisions */
function updateBullets(state: GameState, dt: number): void {
  const toRemove = new Set<string>();

  for (const bullet of state.bullets) {
    bullet.position.x += bullet.velocity.x * dt;
    bullet.position.y += bullet.velocity.y * dt;

    // Out of bounds
    if (bullet.position.y < -BULLET_HEIGHT || bullet.position.y > CANVAS_HEIGHT + BULLET_HEIGHT) {
      toRemove.add(bullet.id);
      continue;
    }

    const bBox: AABB = {
      x: bullet.position.x,
      y: bullet.position.y,
      width: BULLET_WIDTH,
      height: BULLET_HEIGHT,
    };

    // Player bullet hits aliens
    if (bullet.fromPlayer) {
      let hit = false;
      for (const alien of state.aliens) {
        if (!alien.alive) continue;
        const aBox: AABB = {
          x: alien.position.x,
          y: alien.position.y,
          width: ALIEN_WIDTH,
          height: ALIEN_HEIGHT,
        };
        if (aabbCollide(bBox, aBox)) {
          alien.alive = false;
          state.score += alien.points;
          if (state.score > state.highScore) state.highScore = state.score;
          spawnParticles(
            state,
            alien.position.x + ALIEN_WIDTH / 2,
            alien.position.y + ALIEN_HEIGHT / 2,
            alien.type === "small"
              ? COLORS.alienSmall
              : alien.type === "medium"
              ? COLORS.alienMedium
              : COLORS.alienLarge,
            16
          );
          toRemove.add(bullet.id);
          // Speed up aliens as they are killed
          const alive = state.aliens.filter((a) => a.alive).length;
          state.alienMoveInterval = Math.max(
            60,
            state.alienMoveInterval - alive * 0.5
          );
          hit = true;
          break;
        }
      }
      if (hit) continue;

      // Player bullet hits UFO
      if (state.ufo.active) {
        const ufoBox: AABB = {
          x: state.ufo.position.x,
          y: state.ufo.position.y,
          width: UFO_WIDTH,
          height: UFO_HEIGHT,
        };
        if (aabbCollide(bBox, ufoBox)) {
          state.score += state.ufo.points;
          if (state.score > state.highScore) state.highScore = state.score;
          spawnParticles(
            state,
            state.ufo.position.x + UFO_WIDTH / 2,
            state.ufo.position.y + UFO_HEIGHT / 2,
            COLORS.ufo,
            20
          );
          state.ufo.active = false;
          toRemove.add(bullet.id);
          continue;
        }
      }
    }

    // Alien bullet hits player
    if (!bullet.fromPlayer && !state.player.isInvincible) {
      const pBox: AABB = {
        x: state.player.position.x,
        y: state.player.position.y,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
      };
      if (aabbCollide(bBox, pBox)) {
        state.player.lives -= 1;
        spawnParticles(
          state,
          state.player.position.x + PLAYER_WIDTH / 2,
          state.player.position.y + PLAYER_HEIGHT / 2,
          COLORS.player,
          24
        );
        state.player.isInvincible = true;
        state.player.invincibleTimer = 2.5; // 2.5s invincibility
        toRemove.add(bullet.id);
        continue;
      }
    }

    // Bullets hit barriers
    for (const barrier of state.barriers) {
      const segW = BARRIER_WIDTH / BARRIER_SEGMENTS_X;
      const segH = BARRIER_HEIGHT / BARRIER_SEGMENTS_Y;
      for (let sy = 0; sy < BARRIER_SEGMENTS_Y; sy++) {
        for (let sx = 0; sx < BARRIER_SEGMENTS_X; sx++) {
          if (!barrier.segments[sy][sx]) continue;
          const segBox: AABB = {
            x: barrier.position.x + sx * segW,
            y: barrier.position.y + sy * segH,
            width: segW,
            height: segH,
          };
          if (aabbCollide(bBox, segBox)) {
            barrier.segments[sy][sx] = false;
            toRemove.add(bullet.id);
          }
        }
      }
    }
  }

  state.bullets = state.bullets.filter((b) => !toRemove.has(b.id));
}

/** Move the alien swarm */
function updateAliens(state: GameState, dt: number): void {
  state.alienMoveTimer += dt * 1000;
  if (state.alienMoveTimer < state.alienMoveInterval) return;
  state.alienMoveTimer = 0;

  const aliveAliens = state.aliens.filter((a) => a.alive);
  if (aliveAliens.length === 0) return;

  // Toggle animation frame
  for (const alien of aliveAliens) {
    alien.animFrame = alien.animFrame === 0 ? 1 : 0;
  }

  // Find extreme positions
  const minX = Math.min(...aliveAliens.map((a) => a.position.x));
  const maxX = Math.max(...aliveAliens.map((a) => a.position.x + ALIEN_WIDTH));
  const stepX = 12 * state.alienDirection;

  let shouldDescend = false;
  if (state.alienDirection === 1 && maxX + stepX > CANVAS_WIDTH - 20) {
    shouldDescend = true;
  } else if (state.alienDirection === -1 && minX + stepX < 20) {
    shouldDescend = true;
  }

  if (shouldDescend) {
    state.alienDirection = state.alienDirection === 1 ? -1 : 1;
    for (const alien of aliveAliens) {
      alien.position.y += ALIEN_DESCEND_STEP;
    }
    state.alienDescendAmount += ALIEN_DESCEND_STEP;
  } else {
    for (const alien of aliveAliens) {
      alien.position.x += stepX;
    }
  }
}

/** Update UFO */
function updateUFO(state: GameState, dt: number): void {
  const config = DIFFICULTY_CONFIGS[state.difficulty];

  if (!state.ufo.active) {
    state.ufoTimer += dt;
    if (Math.random() < config.ufoFrequency * (dt * 1000)) {
      const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
      state.ufo.active = true;
      state.ufo.direction = dir;
      state.ufo.position.x = dir === 1 ? -UFO_WIDTH : CANVAS_WIDTH;
      state.ufo.position.y = 30;
      state.ufo.points =
        UFO_MIN_POINTS +
        Math.floor(Math.random() * ((UFO_MAX_POINTS - UFO_MIN_POINTS) / 50)) * 50;
    }
  } else {
    state.ufo.position.x += UFO_SPEED * state.ufo.direction * dt;
    if (state.ufo.position.x > CANVAS_WIDTH + UFO_WIDTH || state.ufo.position.x < -UFO_WIDTH) {
      state.ufo.active = false;
    }
  }
}

/** Update particles */
function updateParticles(state: GameState, dt: number): void {
  for (const p of state.particles) {
    p.position.x += p.velocity.x * dt;
    p.position.y += p.velocity.y * dt;
    p.velocity.y += 100 * dt; // gravity
    p.life += dt;
    p.alpha = 1 - p.life / p.maxLife;
  }
  state.particles = state.particles.filter((p) => p.life < p.maxLife);
}

/** Check win/lose conditions */
function checkEndConditions(state: GameState): void {
  const aliveAliens = state.aliens.filter((a) => a.alive);

  // All aliens dead → victory
  if (aliveAliens.length === 0) {
    state.phase = "victory";
    return;
  }

  // Aliens reached the player's row
  const maxAlienY = Math.max(...aliveAliens.map((a) => a.position.y + ALIEN_HEIGHT));
  if (maxAlienY >= state.player.position.y) {
    state.phase = "gameover";
    return;
  }

  // Player out of lives
  if (state.player.lives <= 0) {
    state.phase = "gameover";
  }
}

/** Master update function — call once per frame */
export function updateGameState(
  state: GameState,
  inputLeft: boolean,
  inputRight: boolean,
  inputFire: boolean,
  dt: number
): GameState {
  if (state.phase !== "playing") return state;

  const newState = { ...state };

  updatePlayer(newState, inputLeft, inputRight, dt);
  if (inputFire) firePlayerBullet(newState);

  // Alien shooting
  const config = DIFFICULTY_CONFIGS[newState.difficulty];
  newState.shootTimer += dt * 1000;
  if (newState.shootTimer >= config.alienShootInterval) {
    newState.shootTimer = 0;
    fireAlienBullet(newState);
  }

  updateAliens(newState, dt);
  updateUFO(newState, dt);
  updateBullets(newState, dt);
  updateParticles(newState, dt);
  checkEndConditions(newState);

  return newState;
}

/** Advance to next level */
export function advanceLevel(state: GameState): GameState {
  const config = DIFFICULTY_CONFIGS[state.difficulty];
  const newLevel = state.level + 1;
  const speedMultiplier = Math.max(0.4, 1 - (newLevel - 1) * 0.1);
  return {
    ...state,
    phase: "playing",
    level: newLevel,
    aliens: createAliens(),
    bullets: [],
    barriers: createBarriers(config.barrierCount),
    ufo: { active: false, position: { x: -60, y: 40 }, direction: 1, points: 100 },
    particles: [],
    alienDirection: 1,
    alienMoveTimer: 0,
    alienMoveInterval: config.alienMoveInterval * speedMultiplier,
    alienDescendAmount: 0,
    ufoTimer: 0,
    shootTimer: 0,
    player: {
      ...state.player,
      position: { x: CANVAS_WIDTH / 2 - 20, y: CANVAS_HEIGHT - 60 },
    },
  };
}
