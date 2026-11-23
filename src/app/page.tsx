import Image from "next/image";
import Link from "next/link";
import { Check, Phone } from "lucide-react";
import { Stripes } from "@/components/Stripes";
import { StoreCard } from "@/components/StoreCard";
import { services, strengths, processSteps, stores, priceList, inr, formatPhone, telHref } from "@/data/site";

const popular = [
  ["gentlemen", "Shirt / T-shirt"],
  ["gentlemen", "Coat / Blazer"],
  ["ladies", "Saree"],
  ["ladies", "Ornamental Lehanga"],
  ["gentlemen", "Sherwani (Designer)"],
  ["household", "Blanket Double"],
] as const;

export default function Home() {
  const popularRows = popular.map(([cat, item]) => {
    const row = priceList.find((c) => c.slug === cat)!.rows.find((r) => r.item === item)!;
    return { ...row, cat };
  });

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-lavender">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pt-12 pb-16 md:grid-cols-[1.15fr_1fr] md:pt-20 md:pb-24">
          <div className="relative z-10">
            <p className="font-semibold text-purple">Advance dry-cleaners in Thane &amp; Kharghar</p>
            <h1 className="display mt-4 text-[clamp(3.6rem,10vw,7.5rem)] text-purple">
              You leave it.
              <br />
              We clean it.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/80">
              Dry cleaning, laundry and steam pressing on European and American machines — picked up from your door
              and delivered back fresh, free of charge.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/book"
                className="rounded-full bg-purple px-7 py-3.5 font-semibold text-white hover:bg-purple-deep"
              >
                Book free pickup
              </Link>
              <Link
                href="/pricing"
                className="rounded-full bg-white px-7 py-3.5 font-semibold text-purple ring-1 ring-lilac hover:ring-purple"
              >
                See the price list
              </Link>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-2 gap-6 border-t border-lilac pt-6">
              {stores.map((s) => (
                <div key={s.slug}>
                  <dt className="text-sm text-muted">{s.area}</dt>
                  <dd>
                    <a
                      href={telHref(s.call)}
                      className="display mt-1 inline-flex items-center gap-2 text-2xl text-purple hover:text-purple-deep md:text-3xl"
                    >
                      <Phone className="size-5" aria-hidden="true" />
                      {formatPhone(s.call)}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <Stripes
              animate
              widths={[95, 85, 72, 58, 44]}
              className="absolute -top-6 -left-10 w-[115%] text-purple/90 md:-left-16"
            />
            <div className="relative ml-auto aspect-[5/4] w-full md:aspect-[4/5] max-w-md overflow-hidden rounded-[2rem] [clip-path:polygon(10%_0,100%_0,100%_100%,0_100%)]">
              <Image
                src="/images/suit.webp"
                alt="A freshly pressed suit with a crisp white shirt and silk tie"
                fill
                priority
                sizes="(min-width: 768px) 28rem, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="display text-5xl text-purple md:text-6xl">What we clean</h2>
            <p className="mt-5 max-w-sm leading-relaxed text-ink/75">
              Everyday office wear to wedding lehengas, curtains to sneakers. Each piece is checked against its care
              label before we choose how to clean it.
            </p>
            <div className="relative mt-8 hidden aspect-[3/4] max-w-sm overflow-hidden rounded-3xl md:block">
              <Image
                src="/images/garments.webp"
                alt="EcoSpin staff hanging freshly cleaned shirts on a rail"
                fill
                sizes="24rem"
                className="object-cover"
              />
            </div>
          </div>

          <ul className="divide-y divide-lilac border-y border-lilac">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services#${s.slug}`} className="group block py-6">
                  <h3 className="display text-3xl text-ink group-hover:text-purple md:text-4xl">{s.title}</h3>
                  <p className="mt-2 max-w-xl leading-relaxed text-ink/70">{s.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Why EcoSpin ---------- */}
      <section className="relative overflow-hidden bg-purple text-white">
        <Stripes widths={[60, 50, 40]} className="absolute top-10 -right-24 w-[34rem] text-white/10" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
          <h2 className="display max-w-2xl text-5xl md:text-6xl">Premium quality, at a local price</h2>
          <p className="mt-5 max-w-xl leading-relaxed text-white/80">
            Our team brings experience from laundries in India and abroad, including five-star hotels. All cleaning
            happens at our own central processing unit in Thane, under one roof.
          </p>
          <ul className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {strengths.map((s) => (
              <li key={s.title} className="flex gap-4">
                <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-eco">
                  <Check className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">{s.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Process ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <h2 className="display text-5xl text-purple md:text-6xl">Twelve steps, three quality checks</h2>
        <p className="mt-5 max-w-xl leading-relaxed text-ink/75">
          Every order follows the same process at our Thane unit, from the moment we collect it to the day it comes
          back to you.
        </p>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-lilac bg-lilac sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => {
            const isQc = step.toLowerCase().includes("qc");
            return (
              <li key={step} className={`flex flex-col gap-3 p-6 ${isQc ? "bg-lavender" : "bg-white"}`}>
                <span className="display text-4xl text-purple/35">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-semibold text-ink">{step}</span>
                {i === 0 && <span className="text-sm font-semibold text-eco">Day 1</span>}
                {i === processSteps.length - 1 && <span className="text-sm font-semibold text-eco">Day 4–5</span>}
              </li>
            );
          })}
        </ol>
      </section>

      {/* ---------- Price teaser ---------- */}
      <section className="bg-lavender">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[1fr_1.2fr] md:py-28">
          <div>
            <h2 className="display text-5xl text-purple md:text-6xl">Clear prices, per piece</h2>
            <p className="mt-5 max-w-sm leading-relaxed text-ink/75">
              Same rates at both stores. Steam pressing only is priced separately — see the full list for 70+ items.
            </p>
            <Link
              href="/pricing"
              className="mt-8 inline-block rounded-full bg-purple px-7 py-3.5 font-semibold text-white hover:bg-purple-deep"
            >
              View full price list
            </Link>
          </div>
          <table className="w-full self-start text-left">
            <caption className="sr-only">Popular dry cleaning prices</caption>
            <thead>
              <tr className="border-b-2 border-purple text-sm text-muted">
                <th scope="col" className="py-3 font-medium">Garment</th>
                <th scope="col" className="py-3 text-right font-medium">Dry clean</th>
              </tr>
            </thead>
            <tbody>
              {popularRows.map((r) => (
                <tr key={r.item} className="border-b border-lilac">
                  <th scope="row" className="py-4 font-medium">{r.item}</th>
                  <td className="display py-4 text-right text-3xl text-purple">{inr(r.dc!)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------- Stores ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <h2 className="display text-5xl text-purple md:text-6xl">Two stores, one standard</h2>
        <p className="mt-5 max-w-xl leading-relaxed text-ink/75">
          Drop in at either store, or call and we’ll pick up from your door. Both stores are closed on Fridays.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {stores.map((s) => (
            <StoreCard key={s.slug} store={s} />
          ))}
        </div>
      </section>
    </>
  );
}
