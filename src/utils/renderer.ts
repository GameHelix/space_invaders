import type { GameState } from "@/types/game";
import {
  PLAYER_WIDTH, PLAYER_HEIGHT, ALIEN_WIDTH, ALIEN_HEIGHT,
  UFO_WIDTH, UFO_HEIGHT, BULLET_WIDTH, BULLET_HEIGHT,
  BARRIER_WIDTH, BARRIER_HEIGHT, BARRIER_SEGMENTS_X, BARRIER_SEGMENTS_Y,
  COLORS,
} from "@/constants/game";

/** Draw neon glow effect */
function withGlow(
  ctx: CanvasRenderingContext2D,
  color: string,
  blur: number,
  fn: () => void
): void {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  fn();
  ctx.restore();
}

/** Draw the player ship */
function drawPlayer(ctx: CanvasRenderingContext2D, state: GameState): void {
  const { position, isInvincible } = state.player;
  if (isInvincible && Math.floor(Date.now() / 100) % 2 === 0) return; // Blink

  ctx.save();
  ctx.translate(position.x, position.y);

  withGlow(ctx, COLORS.player, 20, () => {
    ctx.fillStyle = COLORS.player;
    ctx.strokeStyle = COLORS.player;
    ctx.lineWidth = 2;

    // Ship body
    ctx.beginPath();
    ctx.moveTo(PLAYER_WIDTH / 2, 0);
    ctx.lineTo(PLAYER_WIDTH, PLAYER_HEIGHT);
    ctx.lineTo(0, PLAYER_HEIGHT);
    ctx.closePath();
    ctx.fill();

    // Cannon
    ctx.fillRect(PLAYER_WIDTH / 2 - 3, -8, 6, 10);

    // Engine exhaust
    ctx.fillStyle = COLORS.neonOrange;
    ctx.shadowColor = COLORS.neonOrange;
    ctx.shadowBlur = 15;
    ctx.fillRect(8, PLAYER_HEIGHT, 8, 4);
    ctx.fillRect(PLAYER_WIDTH - 16, PLAYER_HEIGHT, 8, 4);
  });

  ctx.restore();
}

/** Draw alien (two animation frames) */
function drawAlien(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  type: string,
  frame: 0 | 1
): void {
  const color =
    type === "small"
      ? COLORS.alienSmall
      : type === "medium"
      ? COLORS.alienMedium
      : COLORS.alienLarge;

  withGlow(ctx, color, 15, () => {
    ctx.fillStyle = color;
    ctx.save();
    ctx.translate(x, y);

    if (type === "small") {
      // Top row alien - looks like classic space invader top
      if (frame === 0) {
        // Body
        ctx.fillRect(8, 4, 16, 12);
        // Head
        ctx.fillRect(12, 0, 8, 4);
        // Legs
        ctx.fillRect(4, 14, 6, 6);
        ctx.fillRect(22, 14, 6, 6);
        // Antennae
        ctx.fillRect(6, 2, 4, 2);
        ctx.fillRect(22, 2, 4, 2);
        // Eyes
        ctx.fillStyle = COLORS.background;
        ctx.fillRect(12, 6, 4, 4);
        ctx.fillRect(18, 6, 4, 4);
      } else {
        ctx.fillRect(8, 4, 16, 12);
        ctx.fillRect(12, 0, 8, 4);
        ctx.fillRect(2, 12, 6, 8);
        ctx.fillRect(24, 12, 6, 8);
        ctx.fillRect(8, 2, 4, 2);
        ctx.fillRect(20, 2, 4, 2);
        ctx.fillStyle = COLORS.background;
        ctx.fillRect(11, 6, 4, 4);
        ctx.fillRect(17, 6, 4, 4);
      }
    } else if (type === "medium") {
      // Middle rows alien - crab-like
      if (frame === 0) {
        ctx.fillRect(4, 6, 24, 10);
        ctx.fillRect(0, 10, 4, 6);
        ctx.fillRect(28, 10, 4, 6);
        ctx.fillRect(6, 0, 6, 6);
        ctx.fillRect(20, 0, 6, 6);
        ctx.fillRect(4, 16, 8, 6);
        ctx.fillRect(20, 16, 8, 6);
        ctx.fillStyle = COLORS.background;
        ctx.fillRect(8, 8, 4, 4);
        ctx.fillRect(20, 8, 4, 4);
      } else {
        ctx.fillRect(4, 6, 24, 10);
        ctx.fillRect(0, 8, 6, 6);
        ctx.fillRect(26, 8, 6, 6);
        ctx.fillRect(6, 0, 6, 6);
        ctx.fillRect(20, 0, 6, 6);
        ctx.fillRect(6, 16, 8, 6);
        ctx.fillRect(18, 16, 8, 6);
        ctx.fillStyle = COLORS.background;
        ctx.fillRect(9, 8, 4, 4);
        ctx.fillRect(19, 8, 4, 4);
      }
    } else {
      // Bottom rows alien - squid-like
      if (frame === 0) {
        ctx.fillRect(2, 4, 28, 14);
        ctx.fillRect(0, 12, 32, 4);
        ctx.fillRect(4, 0, 8, 6);
        ctx.fillRect(20, 0, 8, 6);
        ctx.fillRect(0, 18, 6, 6);
        ctx.fillRect(10, 18, 6, 6);
        ctx.fillRect(16, 18, 6, 6);
        ctx.fillRect(26, 18, 6, 6);
        ctx.fillStyle = COLORS.background;
        ctx.fillRect(8, 8, 6, 6);
        ctx.fillRect(18, 8, 6, 6);
      } else {
        ctx.fillRect(2, 4, 28, 14);
        ctx.fillRect(0, 12, 32, 4);
        ctx.fillRect(4, 0, 8, 6);
        ctx.fillRect(20, 0, 8, 6);
        ctx.fillRect(2, 18, 8, 6);
        ctx.fillRect(12, 18, 6, 6);
        ctx.fillRect(14, 18, 6, 6);
        ctx.fillRect(22, 18, 8, 6);
        ctx.fillStyle = COLORS.background;
        ctx.fillRect(7, 8, 6, 6);
        ctx.fillRect(19, 8, 6, 6);
      }
    }
    ctx.restore();
  });
}

/** Draw all aliens */
function drawAliens(ctx: CanvasRenderingContext2D, state: GameState): void {
  for (const alien of state.aliens) {
    if (!alien.alive) continue;
    drawAlien(ctx, alien.position.x, alien.position.y, alien.type, alien.animFrame);
  }
}

/** Draw UFO */
function drawUFO(ctx: CanvasRenderingContext2D, state: GameState): void {
  if (!state.ufo.active) return;
  const { position } = state.ufo;

  withGlow(ctx, COLORS.ufo, 25, () => {
    ctx.fillStyle = COLORS.ufo;
    ctx.save();
    ctx.translate(position.x, position.y);

    // UFO body (saucer shape)
    ctx.beginPath();
    ctx.ellipse(UFO_WIDTH / 2, UFO_HEIGHT * 0.6, UFO_WIDTH / 2, UFO_HEIGHT * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dome
    ctx.beginPath();
    ctx.ellipse(UFO_WIDTH / 2, UFO_HEIGHT * 0.3, UFO_WIDTH * 0.3, UFO_HEIGHT * 0.4, 0, Math.PI, 0);
    ctx.fill();

    // Windows
    ctx.fillStyle = COLORS.neonYellow;
    ctx.shadowColor = COLORS.neonYellow;
    ctx.shadowBlur = 10;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(UFO_WIDTH * 0.2 + i * UFO_WIDTH * 0.3, UFO_HEIGHT * 0.65, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });

  // Points label
  withGlow(ctx, COLORS.neonYellow, 10, () => {
    ctx.fillStyle = COLORS.neonYellow;
    ctx.font = "bold 12px 'Courier New'";
    ctx.textAlign = "center";
    ctx.fillText(`${state.ufo.points}`, position.x + UFO_WIDTH / 2, position.y - 6);
  });
}

/** Draw bullets */
function drawBullets(ctx: CanvasRenderingContext2D, state: GameState): void {
  for (const bullet of state.bullets) {
    const color = bullet.fromPlayer ? COLORS.playerBullet : COLORS.alienBullet;
    withGlow(ctx, color, 15, () => {
      ctx.fillStyle = color;
      if (bullet.fromPlayer) {
        ctx.fillRect(bullet.position.x, bullet.position.y, BULLET_WIDTH, BULLET_HEIGHT);
      } else {
        // Alien bullets are zigzag
        ctx.save();
        ctx.translate(bullet.position.x + BULLET_WIDTH / 2, bullet.position.y + BULLET_HEIGHT / 2);
        ctx.fillRect(-2, -6, 4, 12);
        ctx.restore();
      }
    });
  }
}

/** Draw barriers */
function drawBarriers(ctx: CanvasRenderingContext2D, state: GameState): void {
  const segW = BARRIER_WIDTH / BARRIER_SEGMENTS_X;
  const segH = BARRIER_HEIGHT / BARRIER_SEGMENTS_Y;

  for (const barrier of state.barriers) {
    withGlow(ctx, COLORS.barrier, 8, () => {
      ctx.fillStyle = COLORS.barrier;
      for (let sy = 0; sy < BARRIER_SEGMENTS_Y; sy++) {
        for (let sx = 0; sx < BARRIER_SEGMENTS_X; sx++) {
          if (!barrier.segments[sy][sx]) continue;
          ctx.fillRect(
            barrier.position.x + sx * segW,
            barrier.position.y + sy * segH,
            segW - 1,
            segH - 1
          );
        }
      }
    });
  }
}

/** Draw particles */
function drawParticles(ctx: CanvasRenderingContext2D, state: GameState): void {
  for (const p of state.particles) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    withGlow(ctx, p.color, 8, () => {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.position.x, p.position.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }
}

/** Draw HUD - score, lives, level */
function drawHUD(ctx: CanvasRenderingContext2D, state: GameState, width: number): void {
  ctx.font = "bold 16px 'Courier New'";

  // Score
  withGlow(ctx, COLORS.neonCyan, 10, () => {
    ctx.fillStyle = COLORS.neonCyan;
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${state.score.toString().padStart(6, "0")}`, 16, 24);
  });

  // High Score
  withGlow(ctx, COLORS.neonPink, 10, () => {
    ctx.fillStyle = COLORS.neonPink;
    ctx.textAlign = "center";
    ctx.fillText(`HI: ${state.highScore.toString().padStart(6, "0")}`, width / 2, 24);
  });

  // Level
  withGlow(ctx, COLORS.neonGreen, 10, () => {
    ctx.fillStyle = COLORS.neonGreen;
    ctx.textAlign = "right";
    ctx.fillText(`LVL: ${state.level}`, width - 16, 24);
  });

  // Lives
  withGlow(ctx, COLORS.player, 12, () => {
    ctx.fillStyle = COLORS.player;
    ctx.textAlign = "left";
    ctx.font = "14px 'Courier New'";
    ctx.fillText("LIVES:", 16, PLAYER_HEIGHT + 46);
    for (let i = 0; i < state.player.lives; i++) {
      ctx.save();
      ctx.translate(72 + i * 28, 34);
      ctx.fillStyle = COLORS.player;
      ctx.beginPath();
      ctx.moveTo(PLAYER_WIDTH * 0.4, 0);
      ctx.lineTo(PLAYER_WIDTH * 0.8, PLAYER_HEIGHT * 0.6);
      ctx.lineTo(0, PLAYER_HEIGHT * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  });

  // Ground line
  withGlow(ctx, COLORS.neonGreen, 4, () => {
    ctx.strokeStyle = COLORS.neonGreen;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 560);
    ctx.lineTo(width, 560);
    ctx.stroke();
  });
}

/** Draw starfield background */
let stars: { x: number; y: number; size: number; alpha: number }[] = [];
function ensureStars(width: number, height: number) {
  if (stars.length === 0) {
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5,
        alpha: 0.2 + Math.random() * 0.6,
      });
    }
  }
}

function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, width, height);

  ensureStars(width, height);
  for (const star of stars) {
    ctx.globalAlpha = star.alpha * (0.7 + 0.3 * Math.sin(Date.now() * 0.001 + star.x));
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(star.x, star.y, star.size, star.size);
  }
  ctx.globalAlpha = 1;
}

/** Draw pause overlay */
function drawPause(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.fillStyle = "rgba(5,5,16,0.7)";
  ctx.fillRect(0, 0, width, height);

  withGlow(ctx, COLORS.neonCyan, 30, () => {
    ctx.fillStyle = COLORS.neonCyan;
    ctx.font = "bold 48px 'Courier New'";
    ctx.textAlign = "center";
    ctx.fillText("PAUSED", width / 2, height / 2 - 20);
  });

  withGlow(ctx, COLORS.neonYellow, 10, () => {
    ctx.fillStyle = COLORS.neonYellow;
    ctx.font = "18px 'Courier New'";
    ctx.textAlign = "center";
    ctx.fillText("Press P to resume", width / 2, height / 2 + 30);
  });
}

/** Master render function */
export function renderGame(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  width: number,
  height: number
): void {
  drawBackground(ctx, width, height);
  drawBarriers(ctx, state);
  drawAliens(ctx, state);
  drawUFO(ctx, state);
  drawPlayer(ctx, state);
  drawBullets(ctx, state);
  drawParticles(ctx, state);
  drawHUD(ctx, state, width);

  if (state.phase === "paused") {
    drawPause(ctx, width, height);
  }
}
