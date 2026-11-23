"use client";

import { useEffect, useRef } from "react";

/* Garment silhouettes, each drawn around (0,0), roughly 80 units tall. */
const garments = [
  { // shirt
    fill: "#ffffff",
    d: "M-30,-30 L-12,-36 L0,-24 L12,-36 L30,-30 L44,-8 L30,0 L28,36 L-28,36 L-30,0 L-44,-8 Z",
    extra: "M0,-24 L0,36 M-12,-36 L-4,-20 M12,-36 L4,-20",
  },
  { // t-shirt
    fill: "#c9a8e6",
    d: "M-28,-30 L-12,-34 Q0,-24 12,-34 L28,-30 L42,-10 L28,-2 L26,34 L-26,34 L-28,-2 L-42,-10 Z",
    extra: "",
  },
  { // sock
    fill: "#1ba636",
    d: "M-10,-36 L10,-36 L10,8 Q12,28 -4,32 L-28,34 Q-38,32 -34,20 Q-30,12 -16,12 L-10,6 Z",
    extra: "M-10,-28 L10,-28 M-10,-22 L10,-22",
  },
  { // trousers
    fill: "#2b3a67",
    d: "M-22,-36 L22,-36 L26,36 L8,36 L0,-6 L-8,36 L-26,36 Z",
    extra: "M-22,-30 L22,-30",
  },
  { // towel
    fill: "#f2c14e",
    d: "M-30,-24 L30,-24 L30,24 L-30,24 Z",
    extra: "M-30,-14 L30,-14 M-30,14 L30,14",
  },
  { // kurta
    fill: "#ff8fa3",
    d: "M-22,-36 L-8,-38 L0,-30 L8,-38 L22,-36 L40,-18 L28,-10 L26,40 L-26,40 L-28,-10 L-40,-18 Z",
    extra: "M0,-30 L0,-8",
  },
];

const placements = garments.map((_, i) => ({
  base: (i / garments.length) * Math.PI * 2,
  radius: 92 + (i % 3) * 26,
  spin: 0.6 + (i % 4) * 0.35,
  scale: 0.85 + (i % 3) * 0.15,
}));

const holes: { x: number; y: number }[] = [];
for (let ring = 1; ring <= 4; ring++) {
  const r = ring * 46;
  const count = ring * 9;
  for (let k = 0; k < count; k++) {
    const a = (k / count) * Math.PI * 2;
    holes.push({ x: 250 + Math.cos(a) * r, y: 250 + Math.sin(a) * r });
  }
}

export function HeroDrum() {
  const drumRef = useRef<SVGGElement>(null);
  const garmentRefs = useRef<(SVGGElement | null)[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let angle = 0;
    let velocity = reduce ? 0 : 0.9; // degrees per frame
    const base = reduce ? 0 : 0.9;
    let dragging = false;
    let lastPointerAngle = 0;
    let lastScroll = window.scrollY;
    let raf = 0;

    const render = () => {
      if (!dragging) {
        velocity += (base - velocity) * 0.02; // ease back to cruising speed
        angle += velocity;
      }
      drumRef.current?.setAttribute("transform", `rotate(${angle} 250 250)`);
      const rad = (angle * Math.PI) / 180;
      placements.forEach((p, i) => {
        const el = garmentRefs.current[i];
        if (!el) return;
        const a = p.base + rad;
        // Items ride up the drum wall, then tumble back toward the centre at the top.
        const lift = Math.max(0, -Math.sin(a));
        const r = p.radius - lift * 46;
        const x = 250 + Math.cos(a) * r;
        const y = 250 + Math.sin(a) * r + lift * 30;
        el.setAttribute("transform", `translate(${x} ${y}) rotate(${angle * p.spin + i * 40}) scale(${p.scale})`);
      });
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const onScroll = () => {
      const dy = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      if (!reduce) velocity = Math.max(-25, Math.min(25, velocity + dy * 0.08));
    };

    const svg = svgRef.current!;
    const pointerAngle = (e: PointerEvent) => {
      const b = svg.getBoundingClientRect();
      return (Math.atan2(e.clientY - (b.top + b.height / 2), e.clientX - (b.left + b.width / 2)) * 180) / Math.PI;
    };
    const down = (e: PointerEvent) => {
      dragging = true;
      lastPointerAngle = pointerAngle(e);
      svg.setPointerCapture(e.pointerId);
      svg.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const a = pointerAngle(e);
      let d = a - lastPointerAngle;
      if (d > 180) d -= 360;
      if (d < -180) d += 360;
      angle += d;
      velocity = d;
      lastPointerAngle = a;
    };
    const up = () => {
      dragging = false;
      svg.style.cursor = "grab";
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    svg.addEventListener("pointerdown", down);
    svg.addEventListener("pointermove", move);
    svg.addEventListener("pointerup", up);
    svg.addEventListener("pointercancel", up);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      svg.removeEventListener("pointerdown", down);
      svg.removeEventListener("pointermove", move);
      svg.removeEventListener("pointerup", up);
      svg.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[34rem]">
      {/* Machine body */}
      <div className="relative aspect-[5/6] rounded-[2.5rem] bg-gradient-to-b from-[#f7f3fb] to-[#ddd0ea] p-[7%] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] ring-1 ring-white/60">
        {/* control strip */}
        <div className="mb-[6%] flex items-center justify-between">
          <div className="flex gap-2" aria-hidden="true">
            <span className="block h-3 w-10 rounded-full bg-purple/80" />
            <span className="block h-3 w-6 rounded-full bg-purple/30" />
          </div>
          <div className="flex items-center gap-2 rounded-full bg-purple-deep px-3 py-1 text-[0.7rem] font-semibold text-mint">
            <span className="size-1.5 animate-pulse rounded-full bg-mint" />
            ECO CYCLE
          </div>
          <div className="flex gap-2" aria-hidden="true">
            <span className="block size-6 rounded-full bg-gradient-to-br from-white to-[#b9a7cc] shadow-inner" />
            <span className="block size-6 rounded-full bg-gradient-to-br from-white to-[#b9a7cc] shadow-inner" />
          </div>
        </div>

        <svg
          ref={svgRef}
          viewBox="0 0 500 500"
          className="w-full touch-pan-y select-none"
          style={{ cursor: "grab" }}
          role="img"
          aria-label="A washing machine drum full of tumbling clothes. Drag to spin it."
        >
          <defs>
            <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.45" stopColor="#cbbfd8" />
              <stop offset="1" stopColor="#7d6a92" />
            </linearGradient>
            <radialGradient id="glass" cx="0.5" cy="0.45" r="0.6">
              <stop offset="0" stopColor="#5a2a7c" />
              <stop offset="1" stopColor="#1b0827" />
            </radialGradient>
            <clipPath id="porthole">
              <circle cx="250" cy="250" r="196" />
            </clipPath>
          </defs>

          <circle cx="250" cy="250" r="246" fill="url(#ring)" />
          <circle cx="250" cy="250" r="226" fill="#1c0b27" />
          <circle cx="250" cy="250" r="214" fill="none" stroke="#3a1c4f" strokeWidth="8" />

          <g clipPath="url(#porthole)">
            <rect x="0" y="0" width="500" height="500" fill="url(#glass)" />
            <g ref={drumRef}>
              {holes.map((h, i) => (
                <circle key={i} cx={h.x} cy={h.y} r="3.2" fill="#ffffff" opacity="0.08" />
              ))}
              {[0, 120, 240].map((a) => (
                <rect
                  key={a}
                  x="238"
                  y="40"
                  width="24"
                  height="46"
                  rx="8"
                  fill="#ffffff"
                  opacity="0.12"
                  transform={`rotate(${a} 250 250)`}
                />
              ))}
            </g>

            {garments.map((g, i) => (
              <g
                key={i}
                ref={(el) => {
                  garmentRefs.current[i] = el;
                }}
              >
                <path d={g.d} fill={g.fill} stroke="rgba(0,0,0,0.25)" strokeWidth="2" strokeLinejoin="round" />
                {g.extra && <path d={g.extra} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" />}
              </g>
            ))}

            {/* Water */}
            <g className="drum-water">
              <path
                d="M-500,360 Q-437,340 -375,360 T-250,360 T-125,360 T0,360 T125,360 T250,360 T375,360 T500,360 T625,360 T750,360 L750,520 L-500,520 Z"
                fill="#a77bd1"
                opacity="0.35"
              />
            </g>
            <g className="drum-water drum-water-2">
              <path
                d="M-500,378 Q-437,362 -375,378 T-250,378 T-125,378 T0,378 T125,378 T250,378 T375,378 T500,378 T625,378 T750,378 L750,520 L-500,520 Z"
                fill="#c9a8e6"
                opacity="0.3"
              />
            </g>

            {/* Bubbles */}
            {Array.from({ length: 14 }).map((_, i) => (
              <circle
                key={i}
                className="drum-bubble"
                cx={90 + ((i * 37) % 320)}
                cy={460}
                r={4 + (i % 4) * 3}
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.55"
                strokeWidth="2"
                style={{ animationDelay: `${(i * 0.43) % 5}s`, animationDuration: `${4 + (i % 3)}s` }}
              />
            ))}

            {/* Glass reflection */}
            <path d="M110,170 A170,170 0 0 1 250,80" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="16" strokeLinecap="round" fill="none" />
            <path d="M100,215 A170,170 0 0 1 106,192" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="16" strokeLinecap="round" fill="none" />
          </g>

          {/* Door handle */}
          <rect x="474" y="210" width="20" height="80" rx="10" fill="#8f7aa6" />
        </svg>
      </div>
      <p className="mt-4 text-center text-sm text-white/60" aria-hidden="true">
        Psst — grab the drum and give it a spin
      </p>
    </div>
  );
}
