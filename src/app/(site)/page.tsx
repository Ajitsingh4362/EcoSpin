import Image from "next/image";
import Link from "next/link";
import { Phone, Truck, Sparkles, BadgeCheck } from "lucide-react";
import { HeroDrum } from "@/components/HeroDrum";
import { Marquee } from "@/components/Marquee";
import { StainWipe } from "@/components/StainWipe";
import { Conveyor } from "@/components/Conveyor";
import { BagBuilder } from "@/components/BagBuilder";
import { StoreCard } from "@/components/StoreCard";
import { Stripes } from "@/components/Stripes";
import { SoapBubbles } from "@/components/SoapBubbles";
import { Aurora } from "@/components/Aurora";
import { Wave } from "@/components/Wave";
import { services, strengths, stores, formatPhone, telHref } from "@/data/site";

const promises = ["Treated water.", "German chemicals.", "European machines.", "Trained hands."];
const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export default function Home() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-[#f7f2fb]">
        <Aurora />
        <SoapBubbles count={12} />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pt-32 pb-16 md:grid-cols-[1.1fr_1fr] md:pt-40 md:pb-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-sm font-semibold text-purple shadow-sm ring-1 ring-white backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-eco opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-eco" />
              </span>
              Free pickup &amp; delivery in Thane, Mulund &amp; Kharghar
            </p>
            <h1 className="display mt-6 text-[clamp(3.4rem,13vw,7rem)] whitespace-nowrap md:text-[clamp(4rem,7.4vw,7rem)]">
              <span className="headline-line text-purple">You leave it.</span>
              <span className="headline-line text-shimmer pb-2">We clean it.</span>
            </h1>
            <p data-reveal="up" style={d(200)} className="mt-6 max-w-md text-lg leading-relaxed text-ink/75">
              Premium dry cleaning and laundry on European and American machines — at a local price, from your door
              and back again.
            </p>
            <div data-reveal="up" style={d(320)} className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#bag"
                data-magnetic
                className="btn-shine rounded-full bg-gradient-to-r from-purple to-purple-bright px-7 py-4 font-semibold text-white"
              >
                Fill your laundry bag
              </Link>
              <Link
                href="/book"
                data-magnetic
                className="btn-shine rounded-full bg-white/80 px-7 py-4 font-semibold text-purple ring-1 ring-white backdrop-blur"
              >
                Book free pickup
              </Link>
            </div>
            <dl data-reveal="up" style={d(440)} className="mt-10 grid max-w-md grid-cols-2 gap-6 border-t border-lilac pt-6">
              {stores.map((s) => (
                <div key={s.slug}>
                  <dt className="text-sm text-muted">{s.area}</dt>
                  <dd>
                    <a href={telHref(s.call)} className="display mt-1 inline-flex items-center gap-2 text-2xl text-purple hover:text-eco md:text-3xl">
                      <Phone className="size-5" aria-hidden="true" />
                      {formatPhone(s.call)}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div data-reveal="pop" style={d(250)} className="relative">
            <HeroDrum />
            {/* Floating chips */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden sm:block">
              <span className="bob absolute top-[14%] -left-8 inline-flex items-center gap-2 rounded-2xl bg-white/85 px-4 py-2.5 text-sm font-semibold text-purple shadow-xl ring-1 ring-white backdrop-blur [--r:-4deg]">
                <Truck className="size-4 text-eco" /> Free pickup &amp; drop
              </span>
              <span className="bob bob-2 absolute top-[48%] -right-6 inline-flex items-center gap-2 rounded-2xl bg-white/85 px-4 py-2.5 text-sm font-semibold text-purple shadow-xl ring-1 ring-white backdrop-blur [--r:5deg]">
                <Sparkles className="size-4 text-eco" /> German chemicals
              </span>
              <span className="bob bob-3 absolute bottom-[16%] -left-4 inline-flex items-center gap-2 rounded-2xl bg-white/85 px-4 py-2.5 text-sm font-semibold text-purple shadow-xl ring-1 ring-white backdrop-blur [--r:-3deg]">
                <BadgeCheck className="size-4 text-eco" /> DLI, USA member
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 bg-gradient-to-b from-[#f7f2fb] to-white">
        <Marquee />
      </div>

      {/* ---------- Stain game ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <StainWipe />
      </section>

      {/* ---------- Why ---------- */}
      <Wave top="#ffffff" bottom="#5c237b" />
      <section className="relative overflow-hidden bg-gradient-to-br from-purple via-[#6a2a8e] to-purple-bright text-white">
        <SoapBubbles count={8} />
        <div className="absolute inset-y-0 right-0 hidden w-1/3 lg:block">
          <Image src="/images/machines.webp" alt="" fill sizes="33vw" className="object-cover opacity-30 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#6a2a8e] to-transparent" />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 py-16 md:py-24">
          <p data-reveal="up" className="font-semibold text-mint">Premium quality, at a local price</p>
          <ul className="mt-4" aria-label="What makes EcoSpin different">
            {promises.map((p, i) => (
              <li key={p} data-reveal="mask" style={d(i * 120)} className={`display text-[clamp(3rem,9vw,7rem)] ${i % 2 ? "text-outline" : ""}`}>
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-14 grid gap-x-10 gap-y-6 border-t border-white/20 pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {strengths.map((s, i) => (
              <div key={s.title} data-reveal="up" style={d((i % 3) * 100)}>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/75">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Wave top="#7b34a6" bottom="#ffffff" />

      {/* ---------- Services ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1fr_1.3fr]">
          <div className="md:sticky md:top-28 md:self-start">
            <h2 data-reveal="mask" className="display text-5xl text-purple md:text-7xl">Office shirts to wedding lehengas.</h2>
            <p data-reveal="up" className="mt-5 max-w-sm leading-relaxed text-ink/75">
              Each piece is checked against its care label before we choose how to clean it.
            </p>
            <div data-reveal="img" className="relative mt-8 hidden aspect-[4/5] max-w-sm overflow-hidden rounded-[2rem] md:block">
              <Image src="/images/garments.webp" alt="Freshly cleaned shirts on a rail" fill sizes="24rem" className="object-cover" />
            </div>
          </div>
          <ul className="border-t border-lilac">
            {services.map((s, i) => (
              <li key={s.slug} data-reveal="up" style={d(i * 60)} className="border-b border-lilac">
                <Link href={`/services#${s.slug}`} className="group relative flex items-start justify-between gap-6 overflow-hidden py-7">
                  <span aria-hidden="true" className="absolute inset-0 -z-10 origin-left scale-x-0 rounded-2xl bg-lavender transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-x-100" />
                  <div className="transition-transform duration-500 group-hover:translate-x-4">
                    <h3 className="display text-4xl text-ink transition-colors group-hover:text-purple md:text-5xl">{s.title}</h3>
                    <p className="mt-2 max-w-lg leading-relaxed text-ink/70">{s.summary}</p>
                  </div>
                  <Stripes widths={[100, 80, 60]} className="mt-3 mr-2 w-14 shrink-0 text-lilac transition-all duration-500 group-hover:translate-x-2 group-hover:text-purple" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Conveyor />

      {/* ---------- Bag builder ---------- */}
      <section id="bag" className="relative scroll-mt-20 overflow-hidden bg-lavender">
        <Aurora className="opacity-60" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
          <h2 data-reveal="mask" className="display max-w-3xl text-5xl text-purple md:text-7xl">Fill your bag. See your bill.</h2>
          <p data-reveal="up" className="mt-5 max-w-xl text-lg leading-relaxed text-ink/75">
            Add what you want cleaned and watch the bill update — then send the whole bag to the store on WhatsApp in
            one tap. Same prices at both stores.
          </p>
          <div data-reveal="up" style={d(150)} className="mt-12">
            <BagBuilder />
          </div>
        </div>
      </section>
      <Wave top="#f3edf8" bottom="#ffffff" />

      {/* ---------- Stores ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <h2 data-reveal="mask" className="display text-5xl text-purple md:text-7xl">Two stores. One standard.</h2>
        <p data-reveal="up" className="mt-5 max-w-xl leading-relaxed text-ink/75">
          Same owner, same central cleaning unit, same prices. Both stores are closed on Fridays.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {stores.map((s, i) => (
            <div key={s.slug} data-reveal="up" style={d(i * 150)}>
              <StoreCard store={s} />
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Closing ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-bright via-purple to-[#4a1b66] text-white">
        <SoapBubbles count={10} />
        <Stripes widths={[100, 86, 70, 54]} className="absolute -right-10 bottom-10 w-[40rem] text-white/10" />
        <div className="relative mx-auto max-w-6xl px-5 py-24 md:py-32">
          <h2 data-reveal="mask" className="display max-w-4xl text-[clamp(3rem,8vw,6.5rem)]">
            Your clothes need to look happy for you to feel happy.
          </h2>
          <div data-reveal="up" style={d(200)} className="mt-10 flex flex-wrap gap-3">
            <Link href="/book" data-magnetic className="btn-shine rounded-full bg-mint px-8 py-4 font-semibold text-purple-deep">
              Book free pickup
            </Link>
            <Link href="/pricing" data-magnetic className="btn-shine rounded-full px-8 py-4 font-semibold ring-1 ring-white/50">
              See all prices
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
