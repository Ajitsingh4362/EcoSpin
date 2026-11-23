"use client";

import { useEffect, useRef } from "react";
import { processSteps } from "@/data/site";

const details = [
  "We collect from your door, or you drop off at either store.",
  "Every piece is inspected for stains, tears and loose buttons.",
  "Your order is logged in our laundry software.",
  "Each garment gets its own tag so nothing gets mixed up.",
  "Sorted by fabric, colour and the right cleaning process.",
  "Spots are treated by hand before any machine touches them.",
  "European and American machines, treated water, German chemicals.",
  "Checked again — anything not perfect goes back for another round.",
  "Steam-pressed to a crisp finish, without shine marks.",
  "One last look under good light before it’s packed.",
  "Folded or hung, and packed to stay fresh and dust-free.",
  "Back at your door, or ready for pickup at the store.",
];

const tagColours = ["#ffffff", "#f3edf8", "#ffffff", "#e9fbe9"];

export function Conveyor() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const track = trackRef.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let distance = 0;
    let lastX = 0;
    let swing = 0;
    let raf = 0;

    const measure = () => {
      distance = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.height = `${window.innerHeight + distance}px`;
    };

    const tick = () => {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const x = -progress * distance;
      track.style.transform = `translate3d(${x}px,0,0)`;

      // Garments swing back as the rail moves, then settle.
      const v = x - lastX;
      lastX = x;
      swing += (Math.max(-14, Math.min(14, v * 0.6)) - swing) * 0.15;
      if (!reduce) track.style.setProperty("--swing", `${swing.toFixed(2)}deg`);

      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
      if (dayRef.current) dayRef.current.textContent = String(1 + Math.round(progress * 4));
      raf = requestAnimationFrame(tick);
    };

    measure();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-purple-deep text-white" aria-labelledby="process-title">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-5 pt-24 md:pt-28">
          <h2 id="process-title" className="display text-5xl md:text-7xl">
            From your door, down our line, and back.
          </h2>
          <p className="mt-4 max-w-xl text-white/70">
            Twelve steps and three quality checks at our Thane unit. Keep scrolling to send your clothes down the line.
          </p>
        </div>

        <div className="relative mt-auto mb-10 md:mb-14">
          {/* Rail */}
          <div className="absolute top-0 right-0 left-0 h-3 bg-gradient-to-b from-[#d9cbe8] to-[#7d6a92] shadow-[0_6px_12px_rgba(0,0,0,0.4)]" />
          <ol ref={trackRef} className="relative flex w-max gap-6 pr-[20vw] pl-5 will-change-transform md:gap-10 md:pl-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))]">
            {processSteps.map((step, i) => {
              const qc = step.toLowerCase().includes("qc");
              return (
                <li key={step} className="conveyor-item flex w-60 shrink-0 flex-col items-center md:w-72">
                  {/* Hanger hook */}
                  <svg viewBox="0 0 60 70" className="-mt-3 h-14 w-12" aria-hidden="true">
                    <path d="M30,6 a8,8 0 1 1 8,8 L30,18 L30,30 L4,64 L56,64 L30,30" fill="none" stroke="#c9b8db" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
                  </svg>
                  <div
                    className="relative -mt-1 w-full rounded-2xl p-6 text-ink shadow-[0_24px_40px_-16px_rgba(0,0,0,0.6)]"
                    style={{ background: tagColours[i % tagColours.length] }}
                  >
                    <span className="absolute top-3 left-1/2 size-3 -translate-x-1/2 rounded-full bg-purple-deep/80" aria-hidden="true" />
                    <span className="display block pt-2 text-6xl text-purple/25">{i + 1}</span>
                    <h3 className="display mt-1 text-3xl text-purple">{step}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/70">{details[i]}</p>
                    {qc && (
                      <span className="absolute top-5 right-4 rotate-12 rounded-md border-2 border-eco px-2 py-0.5 text-xs font-extrabold text-eco">
                        QC PASSED
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Day progress */}
          <div className="mx-auto mt-10 flex max-w-6xl items-center gap-5 px-5">
            <span className="display shrink-0 text-2xl text-mint">
              Day <span ref={dayRef}>1</span>
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
              <div ref={barRef} className="h-full origin-left rounded-full bg-mint" style={{ transform: "scaleX(0)" }} />
            </div>
            <span className="shrink-0 text-sm text-white/60">Delivered by day 4–5</span>
          </div>
        </div>
      </div>
    </section>
  );
}
