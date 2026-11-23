"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

const W = 400;
const H = 440;

/* Stains are drawn inside the shirt body only. Deterministic so server and client agree. */
function paintStains(ctx: CanvasRenderingContext2D) {
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, W, H);

  const blob = (x: number, y: number, r: number, color: string, alpha: number) => {
    const g = ctx.createRadialGradient(x, y, r * 0.15, x, y, r);
    g.addColorStop(0, `rgba(${color},${alpha})`);
    g.addColorStop(0.7, `rgba(${color},${alpha * 0.75})`);
    g.addColorStop(1, `rgba(${color},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };

  // Coffee spill
  const coffee = "120,72,30";
  [
    [170, 230, 62],
    [205, 262, 48],
    [140, 268, 34],
    [228, 222, 26],
    [186, 300, 22],
  ].forEach(([x, y, r]) => blob(x, y, r, coffee, 0.85));
  // Splash drops
  [
    [262, 196, 9],
    [276, 252, 7],
    [112, 214, 8],
    [246, 318, 6],
    [128, 316, 10],
  ].forEach(([x, y, r]) => blob(x, y, r, coffee, 0.9));
  // Coffee ring
  ctx.strokeStyle = "rgba(95,55,20,0.55)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(168, 232, 58, 0.3, Math.PI * 1.9);
  ctx.stroke();

  // Curry stain near the pocket
  const curry = "214,150,20";
  [
    [278, 156, 24],
    [296, 172, 16],
    [266, 176, 12],
  ].forEach(([x, y, r]) => blob(x, y, r, curry, 0.8));

  // Ink line from a leaky pen
  ctx.strokeStyle = "rgba(40,60,160,0.75)";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(250, 340);
  ctx.quadraticCurveTo(270, 360, 300, 352);
  ctx.stroke();
  blob(300, 352, 11, "40,60,160", 0.8);
}

function dirtAmount(ctx: CanvasRenderingContext2D) {
  const { data } = ctx.getImageData(0, 0, W, H);
  let sum = 0;
  for (let i = 3; i < data.length; i += 4 * 8) sum += data[i];
  return sum;
}

export function StainWipe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const foamRef = useRef<HTMLDivElement>(null);
  const startDirt = useRef(1);
  const strokes = useRef(0);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [clean, setClean] = useState(0);
  const [done, setDone] = useState(false);
  const [touched, setTouched] = useState(false);

  const reset = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    paintStains(ctx);
    startDirt.current = dirtAmount(ctx);
    setClean(0);
    setDone(false);
    setTouched(false);
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    paintStains(ctx);
    startDirt.current = dirtAmount(ctx);
  }, []);

  const toCanvas = (e: React.PointerEvent) => {
    const b = canvasRef.current!.getBoundingClientRect();
    return { x: ((e.clientX - b.left) / b.width) * W, y: ((e.clientY - b.top) / b.height) * H };
  };

  const spawnFoam = (e: React.PointerEvent) => {
    const host = foamRef.current;
    if (!host || Math.random() > 0.45) return;
    const b = host.getBoundingClientRect();
    const s = document.createElement("span");
    const size = 8 + Math.random() * 18;
    s.className = "foam";
    s.style.cssText = `left:${e.clientX - b.left - size / 2}px;top:${e.clientY - b.top - size / 2}px;width:${size}px;height:${size}px;--dx:${(Math.random() - 0.5) * 60}px`;
    s.addEventListener("animationend", () => s.remove());
    host.appendChild(s);
  };

  const scrub = (e: React.PointerEvent) => {
    if (done || e.buttons === 0 && e.pointerType === "mouse") return;
    const ctx = canvasRef.current?.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const p = toCanvas(e);
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 46;
    ctx.beginPath();
    ctx.moveTo(last.current?.x ?? p.x, last.current?.y ?? p.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    spawnFoam(e);
    if (!touched) setTouched(true);

    if (++strokes.current % 6 === 0) {
      const pct = Math.round((1 - dirtAmount(ctx) / startDirt.current) * 100);
      setClean(pct);
      if (pct >= 92) {
        ctx.clearRect(0, 0, W, H);
        setClean(100);
        setDone(true);
      }
    }
  };

  return (
    <div className="grid items-center gap-10 md:grid-cols-[1fr_1.1fr]">
      <div>
        <h2 data-reveal="mask" className="display text-5xl text-purple md:text-7xl">Go on, get that stain out.</h2>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/75">
          Coffee, curry, a leaky pen — rub the shirt with your finger or mouse. In real life, our stain team
          pre-treats every spot by hand before your clothes go into the machine.
        </p>
        <div className="mt-8 max-w-sm">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-muted">Stain removed</span>
            <span className="display text-4xl text-purple tabular-nums" aria-live="polite">
              {clean}%
            </span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-lilac/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple to-eco transition-[width] duration-300"
              style={{ width: `${clean}%` }}
            />
          </div>
          {done && (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <p className="display text-3xl text-eco">Shine naturally. ✨</p>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-purple ring-1 ring-lilac hover:bg-lavender"
              >
                <RotateCcw className="size-4" /> Spill it again
              </button>
            </div>
          )}
        </div>
      </div>

      <div data-reveal="pop" className="relative mx-auto w-full max-w-md">
        <div className={`absolute inset-6 rounded-full bg-purple/20 blur-3xl transition-opacity duration-700 ${done ? "opacity-100" : "opacity-0"}`} />
        <div className="relative rounded-[2.5rem] bg-lavender p-6">
          {/* Hanger */}
          <svg viewBox="0 0 400 60" className="mx-auto -mb-2 w-1/2" aria-hidden="true">
            <path d="M200,8 a10,10 0 1 1 10,10 L200,22 L60,56 L340,56 L200,22" fill="none" stroke="#7d6a92" strokeWidth="5" strokeLinejoin="round" />
          </svg>
          <div className="relative">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full drop-shadow-xl" aria-hidden="true">
              <path
                d="M120,20 L160,8 Q200,40 240,8 L280,20 L380,90 L340,170 L310,150 L310,430 L90,430 L90,150 L60,170 L20,90 Z"
                fill="#ffffff"
                stroke="#d9c8e8"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path d="M160,8 L200,56 L240,8" fill="#f3edf8" stroke="#d9c8e8" strokeWidth="3" strokeLinejoin="round" />
              <path d="M200,56 L200,430" stroke="#e7dcf1" strokeWidth="3" />
              {[100, 160, 220, 280, 340, 400].map((y) => (
                <circle key={y} cx="210" cy={y} r="5" fill="#e7dcf1" />
              ))}
              <path d="M250,130 L300,130 L300,190 Q275,198 250,190 Z" fill="none" stroke="#e7dcf1" strokeWidth="3" />
            </svg>
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              onPointerDown={(e) => {
                last.current = null;
                scrub(e);
              }}
              onPointerMove={scrub}
              onPointerUp={() => (last.current = null)}
              onPointerLeave={() => (last.current = null)}
              className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
              data-cursor="Rub!"
              role="img"
              aria-label="A white shirt with coffee, curry and ink stains. Rub to clean it."
            />
            <div ref={foamRef} className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true" />
            {!touched && (
              <div className="pointer-events-none absolute top-[52%] left-[42%] flex -translate-x-1/2 items-center gap-2 rounded-full bg-purple-deep px-4 py-2 text-sm font-semibold text-white shadow-lg" aria-hidden="true">
                <span className="relative flex size-3">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-75" />
                  <span className="relative inline-flex size-3 rounded-full bg-mint" />
                </span>
                Rub here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
