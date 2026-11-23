import { Stripes } from "./Stripes";

/** Inner-page header: dark, with a slowly turning drum porthole on the right. */
export function PageHero({ title, intro }: { title: string; intro?: string }) {
  return (
    <section className="relative overflow-hidden bg-purple-deep text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50rem_30rem_at_85%_40%,rgba(123,52,166,0.55),transparent_60%)]"
      />
      <div aria-hidden="true" className="absolute top-1/2 -right-24 hidden size-[30rem] -translate-y-1/2 md:block">
        <div className="absolute inset-0 rounded-full border-[18px] border-white/10" />
        <div className="porthole-spin absolute inset-10 rounded-full border-2 border-dashed border-white/15" />
        <div className="porthole-spin-rev absolute inset-24 rounded-full border border-white/10" />
      </div>
      <div className="relative mx-auto max-w-6xl px-5 py-16 md:py-24">
        <Stripes widths={[100, 80, 60]} className="mb-6 w-16 text-mint" />
        <h1 className="display max-w-3xl text-[clamp(3rem,8vw,6rem)]">{title}</h1>
        {intro && <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">{intro}</p>}
      </div>
    </section>
  );
}
