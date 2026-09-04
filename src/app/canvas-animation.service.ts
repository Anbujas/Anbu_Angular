import { Injectable } from '@angular/core';
import type { AnimationKey } from './portfolio.service';

type DrawFn = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;

const BLUE = '#3b82f6';
const BLUE_LIGHT = '#93c5fd';
const TEAL = '#0D6E6E';
const TEAL_LIGHT = '#5eead4';
const EMERALD = '#10b981';
const MUTED = 'rgba(147, 197, 253, 0.35)';

/** t is seconds elapsed, looping per-animation on whatever period reads best. */
const DRAWERS: Record<AnimationKey, DrawFn> = {
  'files-scan': (ctx, w, h, t) => {
    const cycle = 3;
    const p = (t % cycle) / cycle;
    const trackY = h * 0.28;
    ctx.strokeStyle = MUTED;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.8);
    ctx.lineTo(w, h * 0.8);
    ctx.stroke();

    // progress fill under the track
    ctx.fillStyle = 'rgba(59,130,246,.25)';
    ctx.fillRect(0, h * 0.78, w * p, 3);

    const fileCount = 4;
    for (let i = 0; i < fileCount; i++) {
      const offset = i / fileCount;
      const localP = (p + offset) % 1;
      const x = -14 + localP * (w + 14);
      ctx.fillStyle = i % 2 === 0 ? BLUE : TEAL;
      ctx.globalAlpha = 0.9;
      ctx.fillRect(x, trackY, 12, 14);
      ctx.fillStyle = 'rgba(255,255,255,.85)';
      ctx.fillRect(x + 2, trackY + 3, 8, 1.4);
      ctx.fillRect(x + 2, trackY + 6, 8, 1.4);
      ctx.fillRect(x + 2, trackY + 9, 5, 1.4);
      ctx.globalAlpha = 1;
    }
  },

  dashboard: (ctx, w, h, t) => {
    const cycle = 4;
    const p = (t % cycle) / cycle;
    const baseY = h * 0.92;
    const barCount = 5;
    const barW = w * 0.065;
    const gap = (w * 0.42 - barCount * barW) / (barCount - 1);
    const targets = [0.35, 0.55, 0.4, 0.7, 0.8];

    for (let i = 0; i < barCount; i++) {
      const x = w * 0.04 + i * (barW + gap);
      const growEnd = 0.15 + i * 0.09;
      const growP = Math.min(1, p / growEnd);
      const height = targets[i] * h * 0.8 * growP;
      ctx.fillStyle = i === barCount - 1 ? BLUE : BLUE_LIGHT;
      ctx.fillRect(x, baseY - height, barW, height);
    }

    // line chart on the right half
    const lineStartX = w * 0.52;
    const pts = [
      [0, 0.7],
      [0.25, 0.4],
      [0.5, 0.55],
      [0.75, 0.15],
      [1, 0.05],
    ];
    const drawP = Math.min(1, p / 0.7);
    ctx.strokeStyle = TEAL_LIGHT;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) {
      const segStart = i / (pts.length - 1);
      if (segStart > drawP) break;
      const [fx, fy] = pts[i];
      const x = lineStartX + fx * (w * 0.44);
      const y = h * 0.1 + fy * (h * 0.55);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // incrementing counter, 0 -> 100
    const count = Math.round(Math.min(1, p / 0.85) * 100);
    ctx.font = '700 10px "Space Grotesk", sans-serif';
    ctx.fillStyle = EMERALD;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(`${count}%`, w - 4, 2);
  },

  'progress-fill': (ctx, w, h, t) => {
    const cycle = 3;
    const p = (t % cycle) / cycle;
    const barH = h * 0.26;
    const y = h * 0.16;
    const radius = barH / 2;

    ctx.strokeStyle = MUTED;
    ctx.lineWidth = 1;
    roundRect(ctx, 2, y, w - 4, barH, radius);
    ctx.stroke();

    const fillW = Math.max(radius * 2, (w - 4) * p);
    const grad = ctx.createLinearGradient(0, 0, fillW, 0);
    grad.addColorStop(0, BLUE);
    grad.addColorStop(1, TEAL);
    ctx.fillStyle = grad;
    roundRect(ctx, 2, y, fillW, barH, radius);
    ctx.fill();

    // shimmer highlight sweeping across the fill
    const shimmerX = ((t * 60) % (w + 30)) - 30;
    ctx.save();
    roundRect(ctx, 2, y, fillW, barH, radius);
    ctx.clip();
    const shimmerGrad = ctx.createLinearGradient(shimmerX, 0, shimmerX + 24, 0);
    shimmerGrad.addColorStop(0, 'rgba(255,255,255,0)');
    shimmerGrad.addColorStop(0.5, 'rgba(255,255,255,.35)');
    shimmerGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = shimmerGrad;
    ctx.fillRect(shimmerX, y, 24, barH);
    ctx.restore();

    ctx.fillStyle = '#e1e8f0';
    ctx.font = '600 9px "Space Grotesk", sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(p * 100)}%`, w - 6, y + barH / 2);

    // "2h -> 45m" label, with a small pop as the bar completes
    const nearComplete = p > 0.92;
    const pop = nearComplete ? 1 + Math.sin(((p - 0.92) / 0.08) * Math.PI) * 0.12 : 1;
    ctx.save();
    ctx.translate(2, y + barH + 12);
    ctx.scale(pop, pop);
    ctx.fillStyle = nearComplete ? EMERALD : 'rgba(225,232,240,.7)';
    ctx.font = '700 9px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('2h → 45m', 0, 0);
    ctx.restore();
  },

  'globe-orbit': (ctx, w, h, t) => {
    const cx = w / 2;
    const cy = h / 2;
    const r = h * 0.36;
    const rotationSpeed = (Math.PI * 2) / 5; // one full revolution every 5s

    ctx.strokeStyle = BLUE_LIGHT;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // "latitude" arcs, slowly squashing/unsquashing to read as a Y-axis rotation
    const squash = 0.5 + Math.sin(t * rotationSpeed) * 0.15;
    for (const ry of [0.35, 0.65]) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * squash, r * ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(147,197,253,.4)';
      ctx.stroke();
    }

    const dots = 3;
    for (let i = 0; i < dots; i++) {
      const angle = t * rotationSpeed * 1.6 + (i * Math.PI * 2) / dots;
      const orbitRx = r * 1.55;
      const orbitRy = r * 0.55;
      const x = cx + Math.cos(angle) * orbitRx;
      const y = cy + Math.sin(angle) * orbitRy;
      const behind = Math.sin(angle) < 0;
      ctx.fillStyle = behind ? 'rgba(94,234,212,.5)' : TEAL_LIGHT;
      ctx.beginPath();
      ctx.arc(x, y, behind ? 2 : 3, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  'row-sync': (ctx, w, h, t) => {
    const cycle = 3.5;
    const rows = 3;
    const rowH = h / (rows + 1);
    for (let i = 0; i < rows; i++) {
      const offset = i * 0.28;
      const localT = (t + offset) % cycle;
      const p = Math.min(1, localT / (cycle * 0.6));
      const y = rowH * (i + 0.7);
      const x = -w * 0.15 + p * (w * 1.05);

      ctx.fillStyle = 'rgba(59,130,246,.16)';
      ctx.fillRect(4, y - 5, w - 8, 10);

      ctx.fillStyle = BLUE_LIGHT;
      ctx.fillRect(Math.max(4, Math.min(x, w - 26)), y - 4, 18, 8);

      if (p >= 0.97) {
        ctx.strokeStyle = EMERALD;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(w - 16, y);
        ctx.lineTo(w - 12, y + 4);
        ctx.lineTo(w - 6, y - 5);
        ctx.stroke();
      }
    }
  },

  typing: (ctx, w, h, t) => {
    const text = 'Variance: +2.4% (analyst voice)';
    const cycle = 4;
    const typeWindow = 3;
    const local = t % cycle;
    const charCount = Math.floor(Math.min(1, local / typeWindow) * text.length);
    const shown = text.slice(0, charCount);

    ctx.font = '600 10px "Space Grotesk", monospace';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillStyle = TEAL_LIGHT;
    ctx.fillText(shown, 6, h / 2);

    const cursorVisible = Math.floor(t * 2) % 2 === 0;
    if (cursorVisible && local < cycle - 0.2) {
      const textW = ctx.measureText(shown).width;
      ctx.fillStyle = BLUE_LIGHT;
      ctx.fillRect(6 + textW + 2, h * 0.22, 2, h * 0.56);
    }
  },

  'sql-morph': (ctx, w, h, t) => {
    const cycle = 3;
    const p = (t % cycle) / cycle;
    const boxW = w * 0.28;
    const boxH = h * 0.5;
    const y = (h - boxH) / 2;
    const leftX = 4;
    const rightX = w - boxW - 4;
    const pulse = 0.6 + Math.sin(t * 2.4) * 0.4; // 0.2 - 1.0 glow pulse

    ctx.font = '700 8px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.save();
    ctx.shadowColor = BLUE;
    ctx.shadowBlur = 4 + pulse * 4;
    ctx.strokeStyle = BLUE;
    ctx.lineWidth = 1.4;
    roundRect(ctx, leftX, y, boxW, boxH, 4);
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = BLUE_LIGHT;
    ctx.fillText('ORACLE', leftX + boxW / 2, y + boxH / 2);

    ctx.save();
    ctx.shadowColor = TEAL;
    ctx.shadowBlur = 4 + pulse * 4;
    ctx.strokeStyle = TEAL;
    roundRect(ctx, rightX, y, boxW, boxH, 4);
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = TEAL_LIGHT;
    ctx.fillText('TRINO', rightX + boxW / 2, y + boxH / 2);

    // particles flowing left -> right, colour shifting blue -> teal along the way
    const particles = 4;
    for (let i = 0; i < particles; i++) {
      const offset = i / particles;
      const localP = (p + offset) % 1;
      const x = leftX + boxW + localP * (rightX - leftX - boxW);
      const mix = localP;
      ctx.fillStyle = mix < 0.5 ? BLUE_LIGHT : TEAL_LIGHT;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(x, h / 2, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.strokeStyle = 'rgba(147,197,253,.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(leftX + boxW + 2, h / 2);
    ctx.lineTo(rightX - 2, h / 2);
    ctx.stroke();
  },

  'circle-grow': (ctx, w, h, t) => {
    const cycle = 4;
    const p = (t % cycle) / cycle;
    const cx = w / 2;
    const cy = h / 2;
    const maxR = h * 0.42;
    const growP = Math.min(1, p / 0.65);
    const r = maxR * growP;

    ctx.strokeStyle = TEAL_LIGHT;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    const dots = 6;
    const appearFrom = 0.35;
    const fadeWindow = 0.15;
    for (let i = 0; i < dots; i++) {
      const dotThreshold = appearFrom + (i / dots) * (1 - appearFrom);
      if (p < dotThreshold) continue;
      const fadeP = Math.min(1, (p - dotThreshold) / fadeWindow);
      const angle = (i / dots) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * (maxR + 6);
      const y = cy + Math.sin(angle) * (maxR + 6);
      ctx.globalAlpha = fadeP;
      ctx.fillStyle = BLUE_LIGHT;
      ctx.beginPath();
      ctx.arc(x, y, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  },

  'compare-sync': (ctx, w, h, t) => {
    const cycle = 3;
    const p = (t % cycle) / cycle;
    const uatY = h * 0.24;
    const prodY = h * 0.72;
    const labelW = 30;
    const barsX = labelW + 4;
    const barsWidth = w - barsX - 4;
    const segments = 6;
    const segW = barsWidth / segments;
    const mismatchIndex = 3;
    const revealCount = Math.floor(p * (segments + 1));

    ctx.font = '700 7px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = BLUE_LIGHT;
    ctx.fillText('UAT', 2, uatY);
    ctx.fillStyle = TEAL_LIGHT;
    ctx.fillText('PROD', 2, prodY);

    for (let i = 0; i < segments; i++) {
      if (i >= revealCount) continue;
      const x = barsX + i * segW;
      const isMismatch = i === mismatchIndex;

      ctx.fillStyle = isMismatch ? '#f87171' : 'rgba(94,234,212,.55)';
      ctx.fillRect(x, uatY - 4, segW - 3, 8);
      ctx.fillStyle = isMismatch ? '#f87171' : 'rgba(147,197,253,.55)';
      ctx.fillRect(x, prodY - 4, segW - 3, 8);

      if (isMismatch) {
        ctx.strokeStyle = '#f87171';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 1, uatY - 7, segW - 1, prodY - uatY + 14);
      }
    }
  },

  'tableau-build': (ctx, w, h, t) => {
    const cycle = 3.5;
    const p = (t % cycle) / cycle;
    const cols = 3;
    const rows = 2;
    const gap = 4;
    const tileW = (w - gap * (cols + 1)) / cols;
    const tileH = (h - gap * (rows + 1)) / rows;
    const tiles = cols * rows;

    for (let i = 0; i < tiles; i++) {
      const appearAt = (i / tiles) * 0.75;
      if (p < appearAt) continue;
      const localP = Math.min(1, (p - appearAt) / 0.15);
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = gap + col * (tileW + gap);
      const y = gap + row * (tileH + gap);
      const scale = 0.7 + 0.3 * localP;

      ctx.save();
      ctx.globalAlpha = localP;
      ctx.translate(x + tileW / 2, y + tileH / 2);
      ctx.scale(scale, scale);
      ctx.translate(-tileW / 2, -tileH / 2);

      ctx.fillStyle = 'rgba(59,130,246,.16)';
      ctx.fillRect(0, 0, tileW, tileH);
      ctx.strokeStyle = BLUE_LIGHT;
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, tileW, tileH);

      const glyphColor = i % 2 === 0 ? TEAL_LIGHT : BLUE_LIGHT;
      ctx.fillStyle = glyphColor;
      ctx.strokeStyle = glyphColor;
      if (i % 3 === 0) {
        ctx.fillRect(tileW * 0.2, tileH * 0.5, tileW * 0.14, tileH * 0.35);
        ctx.fillRect(tileW * 0.45, tileH * 0.3, tileW * 0.14, tileH * 0.55);
        ctx.fillRect(tileW * 0.7, tileH * 0.45, tileW * 0.14, tileH * 0.4);
      } else if (i % 3 === 1) {
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(tileW * 0.15, tileH * 0.6);
        ctx.lineTo(tileW * 0.4, tileH * 0.35);
        ctx.lineTo(tileW * 0.65, tileH * 0.5);
        ctx.lineTo(tileW * 0.85, tileH * 0.2);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(tileW * 0.5, tileH * 0.5, Math.min(tileW, tileH) * 0.22, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  },
};

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

@Injectable({ providedIn: 'root' })
export class CanvasAnimationService {
  /** Starts a looping requestAnimationFrame draw on `canvas`. Returns a stop function. */
  start(canvas: HTMLCanvasElement, key: AnimationKey): () => void {
    const ctx = canvas.getContext('2d');
    const draw = DRAWERS[key];
    if (!ctx || !draw) {
      return () => {};
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    let frameId: number;

    const resize = () => {
      width = canvas.clientWidth || width;
      height = canvas.clientHeight || height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    resizeObserver?.observe(canvas);

    let start: number | null = null;
    const tick = (timestamp: number) => {
      if (start === null) {
        start = timestamp;
      }
      const t = (timestamp - start) / 1000;
      ctx.clearRect(0, 0, width, height);
      draw(ctx, width, height, t);
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
    };
  }
}
