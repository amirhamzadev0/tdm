"use client";

import { useEffect, useRef } from "react";

interface StarGridProps {
  /** Distance between dots in px. Must match the grid lines in globals.css. */
  cell?: number;
  /** Share of dots that are "active" (brighter) at any moment. */
  activeRatio?: number;
  /** How often the active dots are re-picked, in ms. */
  duration?: number;
  /** How long a featured dot (with a ring) stays featured, in ms. */
  featureDuration?: number;
  /** Share of dots that are featured at any moment. */
  featureRatio?: number;
}

const BASE = "255, 255, 255";
const FEATURE_COLORS = ["38, 181, 216", "249, 178, 29"];

/**
 * Twinkling dot grid painted on a canvas that fills its (positioned) parent.
 * Most dots are faint, a random share glow brighter, and a few are featured with
 * a ring. Everything eases in and out so it reads as a slow flow of light.
 */
export function StarGrid({
  cell = 48,
  activeRatio = 0.1,
  duration = 160,
  featureDuration = 1500,
  featureRatio = 0.018,
}: StarGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !parent || !context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cols = 0;
    let rows = 0;
    let level = new Float32Array(0); // 0..1 brightness of an active dot
    let feature = new Float32Array(0); // 0..1 strength of a featured dot
    let active = new Uint8Array(0);
    let featured: { index: number; until: number; color: string }[] = [];
    let featuredColor: string[] = [];
    let lastPick = 0;
    let frame = 0;
    let visible = true;
    let ratio = 1;

    const resize = () => {
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      cols = Math.ceil(width / cell);
      rows = Math.ceil(height / cell);
      level = new Float32Array(cols * rows);
      feature = new Float32Array(cols * rows);
      active = new Uint8Array(cols * rows);
      featuredColor = new Array<string>(cols * rows).fill(FEATURE_COLORS[0]);
      featured = [];
      draw(performance.now(), false);
    };

    const pick = (now: number) => {
      const total = cols * rows;
      active.fill(0);
      const activeCount = Math.round(total * activeRatio);
      for (let i = 0; i < activeCount; i += 1) {
        active[Math.floor(Math.random() * total)] = 1;
      }

      featured = featured.filter((item) => item.until > now);
      const wanted = Math.max(1, Math.round(total * featureRatio));
      while (featured.length < wanted) {
        const index = Math.floor(Math.random() * total);
        if (featured.some((item) => item.index === index)) continue;
        const color = FEATURE_COLORS[Math.floor(Math.random() * FEATURE_COLORS.length)];
        // Stagger expiry so featured dots do not all vanish together.
        const until = now + featureDuration * (0.6 + Math.random() * 0.8);
        featured.push({ index, until, color });
        featuredColor[index] = color;
      }
    };

    const draw = (now: number, animate: boolean) => {
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, canvas.width / ratio, canvas.height / ratio);

      if (animate && now - lastPick >= duration) {
        lastPick = now;
        pick(now);
      }
      const featuredNow = new Set(featured.map((item) => item.index));

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const index = row * cols + col;
          const x = col * cell + cell / 2;
          const y = row * cell + cell / 2;

          if (animate) {
            level[index] += ((active[index] ? 1 : 0) - level[index]) * 0.12;
            feature[index] += ((featuredNow.has(index) ? 1 : 0) - feature[index]) * 0.06;
          }

          const glow = level[index];
          const ring = feature[index];

          context.beginPath();
          context.fillStyle = `rgba(${BASE}, ${0.12 + glow * 0.3})`;
          context.arc(x, y, 1.4 + glow * 0.8, 0, Math.PI * 2);
          context.fill();

          if (ring > 0.02) {
            const color = featuredColor[index];
            context.beginPath();
            context.fillStyle = `rgba(${color}, ${ring})`;
            context.arc(x, y, 2.2 + ring * 0.6, 0, Math.PI * 2);
            context.fill();

            context.beginPath();
            context.strokeStyle = `rgba(${color}, ${ring * 0.55})`;
            context.lineWidth = 1;
            context.arc(x, y, 4 + ring * 8, 0, Math.PI * 2);
            context.stroke();
          }
        }
      }
    };

    const loop = (now: number) => {
      draw(now, true);
      frame = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    };

    const start = () => {
      if (!frame && !reduceMotion) frame = requestAnimationFrame(loop);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) start();
    });
    intersectionObserver.observe(parent);

    const onVisibility = () => {
      if (!document.hidden) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    start();

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [cell, activeRatio, duration, featureDuration, featureRatio]);

  return <canvas ref={canvasRef} className="star-grid" aria-hidden="true" />;
}
