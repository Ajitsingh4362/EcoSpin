import { Stripes } from "./Stripes";

export function PageHero({ title, intro }: { title: string; intro?: string }) {
  return (
    <section className="relative overflow-hidden bg-lavender">
      <Stripes widths={[70, 58, 46]} className="absolute top-8 -right-20 w-[28rem] text-purple/15" />
      <div className="relative mx-auto max-w-6xl px-5 py-14 md:py-20">
        <h1 className="display max-w-3xl text-[clamp(3rem,8vw,5.5rem)] text-purple">{title}</h1>
        {intro && <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/80">{intro}</p>}
      </div>
    </section>
  );
}
