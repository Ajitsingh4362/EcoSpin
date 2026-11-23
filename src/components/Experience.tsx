"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

declare global {
  interface Window {
    ecoLenis?: Lenis;
  }
}

/** Site-wide motion: smooth scrolling, scroll reveals, bubble cursor and magnetic buttons. */
export function Experience() {
  const pathname = usePathname();

  /* ---------- Smooth scroll + intro flag ---------- */
  useEffect(() => {
    try {
      sessionStorage.setItem("ecospin-intro", "1");
    } catch {}
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: { offset: -90 },
      autoRaf: true,
    });
    window.ecoLenis = lenis;
    return () => {
      lenis.destroy();
      window.ecoLenis = undefined;
    };
  }, []);

  /* ---------- Back to top on navigation ---------- */
  useEffect(() => {
    if (!window.location.hash) window.ecoLenis?.scrollTo(0, { immediate: true });
  }, [pathname]);

  /* ---------- Scroll reveals ---------- */
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    // Fully clipped elements never report as intersecting, so masked items are watched via their parent.
    const targets = new Map<Element, HTMLElement[]>();
    els.forEach((el) => {
      const t = el.dataset.reveal === "mask" || el.dataset.reveal === "img" ? (el.parentElement ?? el) : el;
      targets.set(t, [...(targets.get(t) ?? []), el]);
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            targets.get(e.target)?.forEach((el) => el.classList.add("is-in"));
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    targets.forEach((_, t) => io.observe(t));
    return () => io.disconnect();
  }, [pathname]);

  /* ---------- Bubble cursor + magnetic elements (mouse only) ---------- */
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = document.createElement("div");
    dot.className = "cursor-bubble";
    dot.setAttribute("aria-hidden", "true");
    document.body.appendChild(dot);

    let x = -100,
      y = -100,
      cx = -100,
      cy = -100,
      raf = 0;
    let magnet: HTMLElement | null = null;

    const loop = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      dot.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement;
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      const interactive = t.closest("a,button,label,input,select,textarea,[role=tab]");
      dot.textContent = labelled?.dataset.cursor ?? "";
      dot.classList.toggle("has-label", !!labelled);
      dot.classList.toggle("is-hover", !labelled && !!interactive);

      const m = t.closest<HTMLElement>("[data-magnetic]");
      if (magnet && magnet !== m) {
        magnet.style.transform = "";
        magnet = null;
      }
      if (m) {
        magnet = m;
        const b = m.getBoundingClientRect();
        const dx = (e.clientX - (b.left + b.width / 2)) * 0.25;
        const dy = (e.clientY - (b.top + b.height / 2)) * 0.35;
        m.style.transform = `translate(${dx}px,${dy}px)`;
      }
    };
    const onDown = (e: PointerEvent) => {
      const r = document.createElement("span");
      r.className = "cursor-ripple";
      r.style.left = `${e.clientX}px`;
      r.style.top = `${e.clientY}px`;
      r.addEventListener("animationend", () => r.remove());
      document.body.appendChild(r);
    };
    const onLeave = () => {
      x = y = -100;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      dot.remove();
    };
  }, []);

  return null;
}
