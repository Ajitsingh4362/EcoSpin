import { Aurora } from "./Aurora";
import { SoapBubbles } from "./SoapBubbles";
import { Stripes } from "./Stripes";
import { Wave } from "./Wave";

/** Light inner-page header with aurora colour, floating bubbles and a slowly turning porthole. */
export function PageHero({ title, intro }: { title: string; intro?: string }) {
  return (
    <>
      <section className="relative overflow-hidden bg-[#f7f2fb]">
        <Aurora />
        <SoapBubbles count={7} />
        <div aria-hidden="true" className="absolute top-1/2 -right-28 hidden size-[30rem] -translate-y-1/2 md:block">
          <div className="absolute inset-0 rounded-full border-[18px] border-purple/10" />
          <div className="porthole-spin absolute inset-10 rounded-full border-2 border-dashed border-purple/20" />
          <div className="porthole-spin-rev absolute inset-24 rounded-full border border-purple/15" />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 pt-36 pb-14 md:pt-44 md:pb-20">
          <Stripes widths={[100, 80, 60]} className="mb-6 w-16 text-purple" animate />
          <h1 data-reveal="mask" className="display max-w-3xl text-[clamp(3rem,8vw,6rem)] text-purple">
            {title}
          </h1>
          {intro && (
            <p data-reveal="up" style={{ "--d": "150ms" } as React.CSSProperties} className="mt-5 max-w-xl text-lg leading-relaxed text-ink/75">
              {intro}
            </p>
          )}
        </div>
      </section>
      <Wave top="#f7f2fb" bottom="#ffffff" />
    </>
  );
}
