import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { services } from "@/data/site";

export const metadata: Metadata = {
  title: "Services — dry cleaning, laundry, steam pressing, curtains & carpets",
  description:
    "Dry cleaning, laundry, steam pressing, bridal wear, curtains, carpets, sofa cleaning at home, shoes and soft toys. Free pickup in Thane and Kharghar.",
};

const photos: Record<string, { src: string; alt: string }> = {
  "dry-cleaning": { src: "/images/suit.webp", alt: "A dry-cleaned suit and tie" },
  laundry: { src: "/images/folded-linen.webp", alt: "A stack of freshly washed, folded towels" },
  "steam-pressing": { src: "/images/garments.webp", alt: "Pressed shirts on hangers" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Everything we clean"
        intro="One central unit in Thane, professional machines and a process for every fabric. Pickup and delivery are free from both stores."
      />
      <div className="mx-auto max-w-6xl divide-y divide-lilac px-5">
        {services.map((s) => {
          const photo = photos[s.slug];
          return (
            <section key={s.slug} id={s.slug} className="grid scroll-mt-24 gap-8 py-16 md:grid-cols-[1.3fr_1fr] md:py-20">
              <div>
                <h2 className="display text-5xl text-purple">{s.title}</h2>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/80">{s.detail}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {s.covers.map((c) => (
                    <li key={c} className="rounded-full bg-lavender px-4 py-1.5 text-sm font-medium text-purple">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              {photo ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl md:aspect-auto">
                  <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 26rem, 100vw" className="object-cover" />
                </div>
              ) : (
                <div className="self-end">
                  <Link href="/pricing" className="font-semibold text-purple underline decoration-2 underline-offset-4">
                    See prices for {s.title.toLowerCase()}
                  </Link>
                </div>
              )}
            </section>
          );
        })}
      </div>
      <section className="bg-purple text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-5 py-14">
          <h2 className="display text-4xl md:text-5xl">Ready for a pickup?</h2>
          <Link href="/book" className="rounded-full bg-white px-7 py-3.5 font-semibold text-purple hover:bg-lavender">
            Book free pickup
          </Link>
        </div>
      </section>
    </>
  );
}
