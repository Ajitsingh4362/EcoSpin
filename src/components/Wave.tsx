/** Animated water edge between two sections. `top` is the colour above, `bottom` the colour below. */
export function Wave({ top, bottom }: { top: string; bottom: string }) {
  const path = (y: number, amp: number) => {
    let d = `M0,${y}`;
    for (let i = 0; i < 8; i++) {
      const x = i * 300;
      d += ` Q${x + 75},${y - amp} ${x + 150},${y} Q${x + 225},${y + amp} ${x + 300},${y}`;
    }
    return d + " L2400,120 L0,120 Z";
  };
  return (
    <div aria-hidden="true" className="relative -mb-px h-14 overflow-hidden md:h-20" style={{ background: top }}>
      <svg viewBox="0 0 2400 120" preserveAspectRatio="none" className="wave-b absolute inset-y-0 left-0 h-full w-[200%] opacity-40">
        <path d={path(56, 26)} fill={bottom} />
      </svg>
      <svg viewBox="0 0 2400 120" preserveAspectRatio="none" className="wave-a absolute inset-y-0 left-0 h-full w-[200%]">
        <path d={path(70, 18)} fill={bottom} />
      </svg>
    </div>
  );
}
