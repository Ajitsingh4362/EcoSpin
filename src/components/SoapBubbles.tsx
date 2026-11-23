"use client";

import { useState } from "react";

type Props = { count?: number; className?: string };

/** Iridescent soap bubbles that float up. Hover or tap one to pop it. */
export function SoapBubbles({ count = 12, className = "" }: Props) {
  const [gen, setGen] = useState<number[]>(() => Array(count).fill(0));
  const [popped, setPopped] = useState<Set<number>>(new Set());

  const pop = (i: number, el: HTMLElement) => {
    if (popped.has(i)) return;
    const host = el.parentElement!;
    const b = el.getBoundingClientRect();
    const hb = host.getBoundingClientRect();
    for (let k = 0; k < 8; k++) {
      const d = document.createElement("span");
      const a = (k / 8) * Math.PI * 2;
      d.className = "droplet";
      d.style.left = `${b.left - hb.left + b.width / 2}px`;
      d.style.top = `${b.top - hb.top + b.height / 2}px`;
      d.style.setProperty("--x", `${Math.cos(a) * b.width * 0.8}px`);
      d.style.setProperty("--y", `${Math.sin(a) * b.width * 0.8}px`);
      d.addEventListener("animationend", () => d.remove());
      host.appendChild(d);
    }
    setPopped((p) => new Set(p).add(i));
    // A fresh bubble rises again after a moment.
    window.setTimeout(() => {
      setPopped((p) => {
        const n = new Set(p);
        n.delete(i);
        return n;
      });
      setGen((g) => g.map((v, j) => (j === i ? v + 1 : v)));
    }, 1600);
  };

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {gen.map((g, i) => {
        const size = 26 + ((i * 37) % 70);
        return (
          <span
            key={`${i}-${g}`}
            className={`soap ${popped.has(i) ? "popped" : ""}`}
            data-cursor="Pop!"
            onPointerEnter={(e) => e.pointerType === "mouse" && pop(i, e.currentTarget)}
            onPointerDown={(e) => pop(i, e.currentTarget)}
            style={
              {
                left: `${(i * 61) % 96}%`,
                width: size,
                height: size,
                "--t": `${12 + (i % 5) * 3}s`,
                "--delay": `${-((i * 2.3) % 14)}s`,
                "--sway": `${((i % 2 ? 1 : -1) * (20 + (i * 13) % 50))}px`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
