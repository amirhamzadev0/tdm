"use client";

import { useEffect, useRef, type ElementType } from "react";

export type MagneticSegment = { text: string; className?: string } | { lineBreak: true };

interface MagneticTextProps {
  as?: ElementType;
  className?: string;
  /** Plain text, or use `segments` for line breaks and highlighted parts. */
  text?: string;
  segments?: MagneticSegment[];
  /** With `text`, colours the last word amber so headings read white + amber. */
  accentLastWord?: boolean;
  /** Distance in px within which letters react to the pointer. */
  radius?: number;
  /** Maximum pull in px. */
  strength?: number;
}

const EASING = 0.14;

function splitForAccent(text: string, accentLastWord?: boolean): MagneticSegment[] {
  if (!accentLastWord) return [{ text }];
  const trimmed = text.trimEnd();
  const split = trimmed.lastIndexOf(" ");
  if (split === -1) return [{ text: trimmed, className: "magnetic-accent" }];
  return [
    { text: trimmed.slice(0, split + 1) },
    { text: trimmed.slice(split + 1), className: "magnetic-accent" },
  ];
}

/**
 * Heading whose letters are drawn toward the mouse pointer and spring back when it
 * leaves. Real text stays in the DOM (via aria-label) so it reads normally to assistive tech.
 */
export function MagneticText({
  as: Tag = "h1",
  className,
  text,
  segments,
  accentLastWord,
  radius = 150,
  strength = 14,
}: MagneticTextProps) {
  const rootRef = useRef<HTMLElement>(null);
  const parts: MagneticSegment[] = segments ?? splitForAccent(text ?? "", accentLastWord);
  const label = parts
    .map((part) => ("text" in part ? part.text : " "))
    .join("")
    .replace(/\s+/g, " ")
    .trim();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const letters = Array.from(root.querySelectorAll<HTMLElement>("[data-letter]"));
    const current = letters.map(() => ({ x: 0, y: 0 }));
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;

    const tick = () => {
      frame = 0;
      let moving = false;

      letters.forEach((letter, index) => {
        const state = current[index];
        if (!state) return;
        const rect = letter.getBoundingClientRect();
        // Un-apply the current offset to find the letter's resting centre.
        const baseX = rect.left + rect.width / 2 - state.x;
        const baseY = rect.top + rect.height / 2 - state.y;

        let targetX = 0;
        let targetY = 0;
        if (pointer) {
          const dx = pointer.x - baseX;
          const dy = pointer.y - baseY;
          const distance = Math.hypot(dx, dy);
          if (distance < radius && distance > 0.001) {
            const pull = (1 - distance / radius) ** 2 * strength;
            targetX = (dx / distance) * pull;
            targetY = (dy / distance) * pull;
          }
        }

        state.x += (targetX - state.x) * EASING;
        state.y += (targetY - state.y) * EASING;
        if (Math.abs(targetX - state.x) > 0.05 || Math.abs(targetY - state.y) > 0.05) {
          moving = true;
        }
        letter.style.transform =
          Math.abs(state.x) < 0.02 && Math.abs(state.y) < 0.02
            ? ""
            : `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, 0)`;
      });

      if (moving || pointer) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = root.getBoundingClientRect();
      const near =
        event.clientX > box.left - radius &&
        event.clientX < box.right + radius &&
        event.clientY > box.top - radius &&
        event.clientY < box.bottom + radius;
      pointer = near ? { x: event.clientX, y: event.clientY } : null;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      pointer = null;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [radius, strength]);

  return (
    <Tag ref={rootRef} className={className} aria-label={label}>
      {parts.map((part, partIndex) => {
        if ("lineBreak" in part) return <br key={partIndex} aria-hidden="true" />;

        // Split into words (kept unbreakable) and spaces so wrapping still works.
        const tokens = part.text.split(/(\s+)/).filter((token) => token !== "");
        return (
          <span key={partIndex} className={part.className} aria-hidden="true">
            {tokens.map((token, tokenIndex) =>
              /^\s+$/.test(token) ? (
                token
              ) : (
                <span key={tokenIndex} className="magnetic-word">
                  {Array.from(token).map((character, characterIndex) => (
                    <span key={characterIndex} data-letter className="magnetic-letter">
                      {character}
                    </span>
                  ))}
                </span>
              ),
            )}
          </span>
        );
      })}
    </Tag>
  );
}
