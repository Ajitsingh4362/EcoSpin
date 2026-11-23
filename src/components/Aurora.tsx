/** Slow-moving blurred colour fields used behind light sections. */
export function Aurora({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`aurora pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <span className="top-[-20%] left-[45%] size-[38rem] bg-[#c9a8e6]" />
      <span className="top-[30%] left-[-10%] size-[30rem] bg-[#e9d8f7]" />
      <span className="right-[-10%] bottom-[-25%] size-[28rem] bg-[#b8f5c6]" />
    </div>
  );
}
