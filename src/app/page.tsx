import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { HeroDrum } from "@/components/HeroDrum";
import { Marquee } from "@/components/Marquee";
import { StainWipe } from "@/components/StainWipe";
import { Conveyor } from "@/components/Conveyor";
import { BagBuilder } from "@/components/BagBuilder";
import { StoreCard } from "@/components/StoreCard";
import { Stripes } from "@/components/Stripes";
import { services, strengths, stores, formatPhone, telHref } from "@/data/site";

const promises = ["Treated water.", "German chemicals.", "European machines.", "Trained hands."];

export default function Home() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-purple-deep text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_40rem_at_80%_30%,rgba(123,52,166,0.55),transparent_60%),radial-gradient(40rem_30rem_at_0%_100%,rgba(27,166,54,0.18),transparent_60%)]"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pt-12 pb-16 md:grid-cols-[1.1fr_1fr] md:pt-16 md:pb-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-mint">
              <span className="size-2 rounded-full bg-mint" /> Free pickup &amp; delivery in Thane, Mulund &amp; Kharghar
            </p>
            <h1 className="display mt-6 text-[clamp(3.4rem,13vw,7rem)] whitespace-nowrap md:text-[clamp(4rem,7.4vw,7rem)]">
              <span className="headline-line">You leave it.</span>
              <span className="headline-line text-outline">We clean it.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/75">
              Premium dry cleaning and laundry on European and American machines — at a local price, from your door
              and back again.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#bag" className="rounded-full bg-mint px-7 py-3.5 font-semibold text-purple-deep hover:bg-white">
                Fill your laundry bag
              </Link>
              <Link href="/book" className="rounded-full px-7 py-3.5 font-semibold text-white ring-1 ring-white/30 hover:bg-white/10">
                Book free pickup
              </Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-2 gap-6 border-t border-white/15 pt-6">
              {stores.map((s) => (
                <div key={s.slug}>
                  <dt className="text-sm text-white/55">{s.area}</dt>
                  <dd>
                    <a href={telHref(s.call)} className="display mt-1 inline-flex items-center gap-2 text-2xl hover:text-mint md:text-3xl">
                      <Phone className="size-5" aria-hidden="true" />
                      {formatPhone(s.call)}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <HeroDrum />
        </div>
      </section>

      <Marquee />

      {/* ---------- Stain game ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <StainWipe />
      </section>

      {/* ---------- Why ---------- */}
      <section className="relative overflow-hidden bg-purple text-white">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 lg:block">
          <Image src="/images/machines.webp" alt="" fill sizes="33vw" className="object-cover opacity-30 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple to-transparent" />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
          <p className="font-semibold text-mint">Premium quality, at a local price</p>
          <ul className="mt-4" aria-label="What makes EcoSpin different">
            {promises.map((p, i) => (
              <li key={p} className={`display text-[clamp(3rem,9vw,7rem)] ${i % 2 ? "text-outline" : ""}`}>
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-14 grid gap-x-10 gap-y-6 border-t border-white/15 pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {strengths.map((s) => (
              <div key={s.title}>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/70">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1fr_1.3fr]">
          <div className="md:sticky md:top-28 md:self-start">
            <h2 className="display text-5xl text-purple md:text-7xl">Office shirts to wedding lehengas.</h2>
            <p className="mt-5 max-w-sm leading-relaxed text-ink/75">
              Each piece is checked against its care label before we choose how to clean it.
            </p>
            <div className="relative mt-8 hidden aspect-[4/5] max-w-sm overflow-hidden rounded-[2rem] md:block">
              <Image src="/images/garments.webp" alt="Freshly cleaned shirts on a rail" fill sizes="24rem" className="object-cover" />
            </div>
          </div>
          <ul className="border-t border-lilac">
            {services.map((s) => (
              <li key={s.slug} className="border-b border-lilac">
                <Link href={`/services#${s.slug}`} className="group flex items-start justify-between gap-6 py-7">
                  <div>
                    <h3 className="display text-4xl text-ink transition-colors group-hover:text-purple md:text-5xl">
                      {s.title}
                    </h3>
                    <p className="mt-2 max-w-lg leading-relaxed text-ink/70">{s.summary}</p>
                  </div>
                  <Stripes widths={[100, 80, 60]} className="mt-3 w-14 shrink-0 text-lilac transition-colors group-hover:text-purple" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Conveyor />

      {/* ---------- Bag builder ---------- */}
      <section id="bag" className="scroll-mt-20 bg-lavender">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <h2 className="display max-w-3xl text-5xl text-purple md:text-7xl">Fill your bag. See your bill.</h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/75">
            Add what you want cleaned and get an instant estimate — then send the whole list to the store on WhatsApp
            in one tap. Same prices at both stores.
          </p>
          <div className="mt-12">
            <BagBuilder />
          </div>
        </div>
      </section>

      {/* ---------- Stores ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <h2 className="display text-5xl text-purple md:text-7xl">Two stores. One standard.</h2>
        <p className="mt-5 max-w-xl leading-relaxed text-ink/75">
          Same owner, same central cleaning unit, same prices. Both stores are closed on Fridays.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {stores.map((s) => (
            <StoreCard key={s.slug} store={s} />
          ))}
        </div>
      </section>

      {/* ---------- Closing ---------- */}
      <section className="relative overflow-hidden bg-purple text-white">
        <Stripes widths={[100, 86, 70, 54]} className="absolute -right-10 bottom-10 w-[40rem] text-white/10" />
        <div className="relative mx-auto max-w-6xl px-5 py-24 md:py-32">
          <h2 className="display max-w-4xl text-[clamp(3rem,8vw,6.5rem)]">
            Your clothes need to look happy for you to feel happy.
          </h2>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/book" className="rounded-full bg-mint px-8 py-4 font-semibold text-purple-deep hover:bg-white">
              Book free pickup
            </Link>
            <Link href="/pricing" className="rounded-full px-8 py-4 font-semibold ring-1 ring-white/40 hover:bg-white/10">
              See all prices
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
