type Props = { widths?: number[]; className?: string; animate?: boolean };

/** Decorative stacked bars taken from the EcoSpin logo mark. */
export function Stripes({ widths = [100, 88, 74, 58], className = "", animate = false }: Props) {
  return (
    <div aria-hidden="true" className={`stripes ${animate ? "stripes-animate" : ""} ${className}`}>
      {widths.map((w, i) => (
        <span key={i} style={{ width: `${w}%`, marginLeft: `${i * 4}%` }} />
      ))}
    </div>
  );
}
