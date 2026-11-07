import type { ReactElement } from "react";

/*
 * Two-tone icons for the trust strip. Shapes carry the `ti-*` classes that globals.css animates
 * (fills cycle through the --c1..--c3 colours, strokes draw themselves, parts bob and spin).
 */

const NAVY = "#0a1a3f";

function Star({ x, y, delay }: { x: number; y: number; delay: string }) {
  return (
    <path
      className="ti-twinkle"
      style={{ animationDelay: delay }}
      d={`M${x} ${y - 5} L${x + 1.6} ${y - 1.6} L${x + 5} ${y} L${x + 1.6} ${y + 1.6} L${x} ${y + 5} L${x - 1.6} ${y + 1.6} L${x - 5} ${y} L${x - 1.6} ${y - 1.6} Z`}
      fill="#f9b21d"
    />
  );
}

function Shield() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" fill="none">
      <path
        className="ti-fill ti-pulse"
        d="M32 7 L53 14 V30 C53 43 44 52 32 57 C20 52 11 43 11 30 V14 Z"
        stroke={NAVY}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        className="ti-draw"
        d="M22 32 L29 39 L43 24"
        stroke={NAVY}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
      />
      <Star x={8} y={9} delay="0s" />
      <Star x={56} y={44} delay="0.9s" />
    </svg>
  );
}

function Diagnosis() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" fill="none">
      <circle className="ti-fill ti-pulse" cx="32" cy="32" r="22" stroke={NAVY} strokeWidth="3" />
      <path
        className="ti-draw"
        d="M13 34 H24 L29 21 L36 45 L41 34 H51"
        stroke={NAVY}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
      />
      <Star x={54} y={10} delay="0.3s" />
      <Star x={9} y={54} delay="1.1s" />
    </svg>
  );
}

function Speed() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" fill="none">
      <path
        className="ti-speed ti-speed--1"
        d="M4 24 H14"
        stroke={NAVY}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        className="ti-speed ti-speed--2"
        d="M2 34 H12"
        stroke={NAVY}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        className="ti-speed ti-speed--3"
        d="M6 44 H15"
        stroke={NAVY}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        className="ti-fill ti-bolt"
        d="M38 5 L17 35 H30 L26 59 L51 26 H37 Z"
        stroke={NAVY}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <Star x={54} y={12} delay="0.5s" />
    </svg>
  );
}

export const trustIcons: ReactElement[] = [
  <Shield key="s" />,
  <Diagnosis key="d" />,
  <Speed key="b" />,
];
