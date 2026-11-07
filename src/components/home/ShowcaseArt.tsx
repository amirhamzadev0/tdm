import type { ReactElement } from "react";

/*
 * Product illustrations for the home category cards. Each one is drawn as inline SVG so it stays
 * sharp at any size. Parts that carry `sa-*` classes are animated from globals.css (spinning fans,
 * cycling RGB, drawing rings, floating earbuds).
 */

const DARK = "#0b0d12";

/** Rear view of a flagship phone. */
function Phone() {
  return (
    <svg viewBox="0 0 200 410" aria-hidden="true">
      <defs>
        <linearGradient id="ph-frame" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f1eeea" />
          <stop offset=".45" stopColor="#8f8c8a" />
          <stop offset="1" stopColor="#d9d5d1" />
        </linearGradient>
        <linearGradient id="ph-back" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5d6275" />
          <stop offset=".6" stopColor="#262932" />
          <stop offset="1" stopColor="#474c5c" />
        </linearGradient>
        <linearGradient id="ph-gloss" x1="0" y1="0" x2=".8" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".38" />
          <stop offset=".42" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ph-cam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7a8094" />
          <stop offset="1" stopColor="#2b2e38" />
        </linearGradient>
        <radialGradient id="ph-lens" cx=".35" cy=".35" r=".8">
          <stop offset="0" stopColor="#7983a8" />
          <stop offset=".28" stopColor="#1b1d27" />
          <stop offset="1" stopColor="#040406" />
        </radialGradient>
      </defs>
      <rect x="0" y="108" width="5" height="30" rx="2" fill="#a9a6a3" />
      <rect x="0" y="150" width="5" height="46" rx="2" fill="#a9a6a3" />
      <rect x="195" y="150" width="5" height="64" rx="2" fill="#a9a6a3" />
      <rect x="3" y="3" width="194" height="404" rx="42" fill="url(#ph-frame)" />
      <rect x="8" y="8" width="184" height="394" rx="37" fill="url(#ph-back)" />
      <rect x="8" y="8" width="184" height="394" rx="37" fill="url(#ph-gloss)" />
      <rect
        x="20"
        y="20"
        width="104"
        height="108"
        rx="30"
        fill="url(#ph-cam)"
        stroke="#ffffff30"
        strokeWidth="1.5"
      />
      {[
        [51, 51],
        [51, 97],
        [97, 74],
      ].map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r="21" fill="#171920" stroke="#9aa0b066" strokeWidth="2" />
          <circle cx={cx} cy={cy} r="16" fill="url(#ph-lens)" />
          <circle cx={cx - 5} cy={cy - 5} r="3.2" fill="#fff" opacity=".55" />
          <circle cx={cx + 4} cy={cy + 5} r="1.6" fill="#8fb3ff" opacity=".6" />
        </g>
      ))}
      <circle cx="104" cy="38" r="6" fill="#f6ebcb" />
      <circle cx="104" cy="112" r="3.2" fill={DARK} />
      <circle cx="100" cy="258" r="24" fill="#ffffff1c" />
      <circle cx="100" cy="258" r="24" fill="none" stroke="#ffffff26" strokeWidth="1.5" />
    </svg>
  );
}

/** Gaming laptop with a cycling RGB keyboard. */
function Laptop() {
  const rows = [0, 1, 2, 3];
  return (
    <svg viewBox="0 0 380 270" aria-hidden="true">
      <defs>
        <linearGradient id="lt-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff5ad8" />
          <stop offset=".5" stopColor="#7a3cff" />
          <stop offset="1" stopColor="#2a6bff" />
        </linearGradient>
        <linearGradient id="lt-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a4e5e" />
          <stop offset="1" stopColor="#1b1c24" />
        </linearGradient>
        <radialGradient id="lt-sun" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="1" stopColor="#ff9a5a" />
        </radialGradient>
        <clipPath id="lt-clip">
          <rect x="48" y="16" width="284" height="154" rx="6" />
        </clipPath>
      </defs>
      <ellipse cx="190" cy="248" rx="170" ry="14" fill="#a76bd0" opacity=".45" />
      <rect
        x="40"
        y="8"
        width="300"
        height="170"
        rx="12"
        fill="#12131a"
        stroke="#454959"
        strokeWidth="2"
      />
      <g clipPath="url(#lt-clip)">
        <rect x="48" y="16" width="284" height="154" fill="url(#lt-screen)" />
        <circle cx="190" cy="92" r="30" fill="url(#lt-sun)" />
        <polygon
          points="48,170 48,120 100,84 150,128 205,70 262,126 332,92 332,170"
          fill="#1a0f3d"
        />
        <polygon points="48,170 48,140 120,118 190,150 260,122 332,146 332,170" fill="#0b0720" />
        <text x="58" y="34" fontSize="11" fontWeight="700" fill="#fff" opacity=".85">
          FPS 144
        </text>
        <polygon points="48,16 150,16 90,170 48,170" fill="#fff" opacity=".07" />
      </g>
      <rect x="18" y="178" width="344" height="7" rx="3" fill="#0d0e12" />
      <path
        d="M18 185 H362 L378 228 Q381 240 366 240 H14 Q-1 240 2 228 Z"
        fill="url(#lt-base)"
        stroke="#5a5f72"
        strokeWidth="1.5"
      />
      <path d="M36 193 H344 L357 228 H23 Z" fill="#090a0f" />
      <g className="sa-rgb">
        {rows.map((row) => {
          const y = 195 + row * 8.2;
          const shift = (y - 193) / 35;
          const left = 36 - 13 * shift;
          const right = 344 + 13 * shift;
          const count = 14;
          const width = (right - left) / count;
          return Array.from({ length: count }, (_, index) => (
            <rect
              key={`${row}-${index}`}
              x={left + index * width + 1}
              y={y}
              width={width - 2}
              height="6.4"
              rx="1.4"
              fill={`hsl(${(index * 26 + row * 30) % 360} 90% 60%)`}
            />
          ));
        })}
      </g>
      <rect x="160" y="230" width="60" height="5" rx="2.5" fill="#2a2d3a" />
    </svg>
  );
}

/** Gaming tower with spinning RGB fans. */
function Tower() {
  const fans = [78, 160, 242];
  const blades = Array.from({ length: 7 }, (_, index) => index * (360 / 7));
  return (
    <svg viewBox="0 0 230 380" aria-hidden="true">
      <defs>
        <linearGradient id="pc-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0d2c3a" />
          <stop offset="1" stopColor="#05080d" />
        </linearGradient>
        <linearGradient id="pc-case" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2b3342" />
          <stop offset=".5" stopColor="#0e1219" />
          <stop offset="1" stopColor="#262d3b" />
        </linearGradient>
        <radialGradient id="pc-halo" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#18e0ff" stopOpacity=".55" />
          <stop offset="1" stopColor="#18e0ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="115" cy="190" rx="115" ry="185" fill="url(#pc-halo)" />
      <rect
        x="22"
        y="6"
        width="186"
        height="352"
        rx="18"
        fill="url(#pc-case)"
        stroke="#3a4356"
        strokeWidth="2"
      />
      <rect x="30" y="14" width="170" height="336" rx="11" fill="url(#pc-glass)" />
      <g className="sa-rgb">
        {fans.map((cy) => (
          <g key={cy} transform={`translate(80 ${cy})`}>
            <circle r="36" fill="#0a0e14" stroke="#18e0ff" strokeWidth="3.5" />
            <circle r="30" fill="none" stroke="#ff3df0" strokeWidth="2" opacity=".85" />
            <g className="sa-spin">
              {blades.map((angle) => (
                <path
                  key={angle}
                  d="M0 -5 C10 -9 22 -22 15 -28 C7 -32 -2 -17 0 -5Z"
                  fill="#1d2a38"
                  stroke="#18e0ff"
                  strokeWidth="1"
                  transform={`rotate(${angle})`}
                />
              ))}
            </g>
            <circle r="6" fill="#18e0ff" />
          </g>
        ))}
        <rect x="170" y="26" width="6" height="250" rx="3" fill="#ff3df0" />
        <rect
          x="38"
          y="290"
          width="154"
          height="36"
          rx="8"
          fill="#12161e"
          stroke="#18e0ff"
          strokeWidth="2"
        />
        <rect x="46" y="316" width="138" height="4" rx="2" fill="#ff3df0" />
        <circle cx="70" cy="304" r="9" fill="#05080d" stroke="#18e0ff" strokeWidth="1.5" />
        <circle cx="116" cy="304" r="9" fill="#05080d" stroke="#18e0ff" strokeWidth="1.5" />
      </g>
      <polygon points="30,14 120,14 60,350 30,350" fill="#fff" opacity=".06" />
      <rect x="40" y="356" width="26" height="9" rx="3" fill="#1a1f29" />
      <rect x="164" y="356" width="26" height="9" rx="3" fill="#1a1f29" />
    </svg>
  );
}

function gearPoints(radius: number, teeth: number) {
  const points: string[] = [];
  for (let index = 0; index < teeth * 4; index += 1) {
    const angle = (index / (teeth * 4)) * Math.PI * 2;
    const outer = index % 4 === 1 || index % 4 === 2;
    const r = outer ? radius + 7 : radius;
    points.push(`${(Math.cos(angle) * r).toFixed(1)},${(Math.sin(angle) * r).toFixed(1)}`);
  }
  return points.join(" ");
}

function Screwdriver({
  x,
  y,
  angle,
  from,
  to,
}: {
  x: number;
  y: number;
  angle: number;
  from: string;
  to: string;
}) {
  const id = `sd-${from.slice(1)}`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={from} />
          <stop offset=".5" stopColor={to} />
          <stop offset="1" stopColor={from} />
        </linearGradient>
      </defs>
      <rect x="-13" y="0" width="26" height="76" rx="12" fill={`url(#${id})`} />
      {[14, 26, 38, 50].map((offset) => (
        <rect key={offset} x="-13" y={offset} width="26" height="3" fill="#00000026" />
      ))}
      <rect x="-9" y="74" width="18" height="10" rx="3" fill="#7d8491" />
      <rect x="-3.5" y="82" width="7" height="82" fill="#cdd2da" />
      <rect x="-1" y="82" width="2.5" height="82" fill="#fff" opacity=".7" />
      <polygon points="-3.5,164 3.5,164 1.5,172 -1.5,172" fill="#8b929e" />
    </g>
  );
}

/** Circuit board with precision screwdrivers. */
function Tools() {
  return (
    <svg viewBox="0 0 360 280" aria-hidden="true">
      <defs>
        <linearGradient id="rp-board" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#12744a" />
          <stop offset="1" stopColor="#0a3f2a" />
        </linearGradient>
      </defs>
      <g transform="rotate(-9 150 150)">
        <rect
          x="52"
          y="52"
          width="208"
          height="176"
          rx="16"
          fill="url(#rp-board)"
          stroke="#06261a"
          strokeWidth="3"
        />
        <g stroke="#e8c867" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".85">
          <path d="M70 80 H92 V120" />
          <path d="M70 100 H80 V190 H120" />
          <path d="M150 70 H210 V96" />
          <path d="M150 190 H230 V150" />
          <path d="M96 200 V214 H190" />
          <path d="M230 120 H246" />
        </g>
        <rect
          x="88"
          y="78"
          width="56"
          height="56"
          rx="5"
          fill="#15171c"
          stroke="#3a3f4b"
          strokeWidth="1.5"
        />
        <rect x="96" y="88" width="24" height="3" rx="1.5" fill="#6d7484" />
        <rect x="96" y="96" width="36" height="3" rx="1.5" fill="#6d7484" />
        <circle cx="100" cy="122" r="3" fill="#6d7484" />
        <rect
          x="168"
          y="96"
          width="46"
          height="34"
          rx="4"
          fill="#15171c"
          stroke="#3a3f4b"
          strokeWidth="1.5"
        />
        <rect
          x="98"
          y="152"
          width="22"
          height="22"
          rx="3"
          fill="#1d9b58"
          stroke="#0a3f2a"
          strokeWidth="1.5"
        />
        <rect x="156" y="158" width="14" height="30" rx="2" fill="#2a2d36" />
        <rect x="178" y="166" width="38" height="20" rx="3" fill="#2a2d36" />
        {[
          [68, 66],
          [244, 66],
          [68, 212],
          [244, 212],
        ].map(([cx, cy]) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="5"
            fill="#0a3f2a"
            stroke="#e8c867"
            strokeWidth="2"
          />
        ))}
      </g>
      <Screwdriver x={206} y={-34} angle={26} from="#d9531a" to="#ffa14d" />
      <Screwdriver x={300} y={-4} angle={38} from="#1f56d6" to="#6fa0ff" />
      <g transform="translate(52 238)">
        <g className="sa-spin sa-spin--slow">
          <polygon points={gearPoints(24, 9)} fill="#9aa1ae" stroke="#4d5362" strokeWidth="2" />
          <circle r="9" fill="#2a2d36" />
        </g>
      </g>
      <g fill="#c4c9d2" stroke="#4d5362" strokeWidth="1.5">
        <circle cx="318" cy="230" r="8" />
        <circle cx="338" cy="214" r="6" />
      </g>
      <path d="M314 230 H322 M318 226 V234" stroke="#4d5362" strokeWidth="1.5" />
    </svg>
  );
}

/** Smartwatch with activity rings and an earbuds case. */
function Gear() {
  return (
    <svg viewBox="0 0 380 290" aria-hidden="true">
      <defs>
        <linearGradient id="ac-strap" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1f232d" />
          <stop offset=".5" stopColor="#3a4050" />
          <stop offset="1" stopColor="#1f232d" />
        </linearGradient>
        <linearGradient id="ac-case" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0f2f6" />
          <stop offset=".5" stopColor="#9aa0ac" />
          <stop offset="1" stopColor="#dfe2e8" />
        </linearGradient>
        <linearGradient id="ac-pod" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#cfd3dc" />
        </linearGradient>
      </defs>
      <rect x="116" y="0" width="68" height="76" rx="16" fill="url(#ac-strap)" />
      <rect x="116" y="188" width="68" height="100" rx="16" fill="url(#ac-strap)" />
      <rect x="198" y="96" width="9" height="28" rx="3" fill="#8f95a1" />
      <rect
        x="92"
        y="52"
        width="116"
        height="148"
        rx="38"
        fill="url(#ac-case)"
        stroke="#6c7280"
        strokeWidth="2"
      />
      <rect x="101" y="61" width="98" height="130" rx="31" fill="#05070b" />
      <text x="150" y="92" textAnchor="middle" fontSize="17" fontWeight="700" fill="#fff">
        10:09
      </text>
      <g transform="translate(150 140)" fill="none" strokeLinecap="round" strokeWidth="7">
        <g transform="rotate(-90)">
          <circle r="32" stroke="#ffffff14" />
          <circle
            r="32"
            stroke="#ff4d6d"
            pathLength="100"
            strokeDasharray="100"
            className="sa-ring"
          />
          <circle r="21" stroke="#ffffff14" />
          <circle
            r="21"
            stroke="#26e0a0"
            pathLength="100"
            strokeDasharray="100"
            className="sa-ring sa-ring--2"
          />
          <circle r="10" stroke="#ffffff14" />
          <circle
            r="10"
            stroke="#26b5d8"
            pathLength="100"
            strokeDasharray="100"
            className="sa-ring sa-ring--3"
          />
        </g>
      </g>
      <path d="M104 80 Q150 56 196 80" stroke="#fff" strokeWidth="2" fill="none" opacity=".25" />
      <g transform="translate(236 168)">
        <rect
          width="128"
          height="88"
          rx="38"
          fill="url(#ac-case)"
          stroke="#8a909c"
          strokeWidth="1.5"
        />
        <path d="M6 36 H122" stroke="#7d8390" strokeWidth="2" />
        <rect x="8" y="2" width="112" height="34" rx="30" fill="#ffffff" opacity=".55" />
        <circle cx="64" cy="58" r="4.5" fill="#26e0a0" />
      </g>
      <g className="sa-float">
        <g transform="translate(250 46) rotate(-18)">
          <rect
            x="-4.5"
            y="10"
            width="9"
            height="40"
            rx="4.5"
            fill="url(#ac-pod)"
            stroke="#aeb3be"
            strokeWidth="1"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="17"
            ry="21"
            fill="url(#ac-pod)"
            stroke="#aeb3be"
            strokeWidth="1"
          />
          <circle cx="0" cy="4" r="5" fill="#cfd3dc" />
        </g>
      </g>
      <g className="sa-float sa-float--2">
        <g transform="translate(320 78) rotate(16)">
          <rect
            x="-4.5"
            y="10"
            width="9"
            height="40"
            rx="4.5"
            fill="url(#ac-pod)"
            stroke="#aeb3be"
            strokeWidth="1"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="17"
            ry="21"
            fill="url(#ac-pod)"
            stroke="#aeb3be"
            strokeWidth="1"
          />
          <circle cx="0" cy="4" r="5" fill="#cfd3dc" />
        </g>
      </g>
    </svg>
  );
}

export const showcaseArt: Record<string, ReactElement> = {
  mobiles: <Phone />,
  laptops: <Laptop />,
  computers: <Tower />,
  repair: <Tools />,
  accessories: <Gear />,
};
