import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { LogoHi } from "@/components/Logo";
import { processSteps, strengths } from "@/data/site";

export const metadata: Metadata = {
  title: "About EcoSpin",
  description:
    "EcoSpin is an advanced dry cleaning and laundry service following European standards, with a central processing unit in Thane serving Thane, Mulund and Navi Mumbai.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="More than cleaning and ironing"
        intro="EcoSpin is a modern dry cleaning and laundry service that treats your clothes using the principles of textile care and the instructions on each brand’s care label."
      />

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.2fr_1fr] md:py-24">
        <div className="space-y-5 text-lg leading-relaxed text-ink/80">
          <p>
            We follow a high-tech model of laundry, with standard operating procedures in line with European standards.
            Our team of experienced professionals has worked in laundries in India and abroad, including five-star hotel
            laundries.
          </p>
          <p>
            All cleaning happens at our own Central Processing Unit in Thane, equipped with European technology,
            American machines and laundry management software. Every order follows the same twelve-step process
            under one roof, with three separate quality checks.
          </p>
          <p>
            Today we serve customers in Thane, Mulund and Navi Mumbai through two stores — Dongari Pada in Thane (W)
            and Sector 20 in Kharghar — with free pickup and delivery from both.
          </p>
          <LogoHi className="h-10 w-auto pt-4 text-purple" />
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl md:aspect-auto">
          <Image
            src="/images/team.webp"
            alt="Two EcoSpin team members in business suits"
            fill
            sizes="(min-width: 768px) 26rem, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="bg-lavender">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h2 className="display text-5xl text-purple">Our strengths</h2>
            <ul className="mt-8 space-y-5">
              {strengths.map((s) => (
                <li key={s.title}>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-1 text-ink/75">{s.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="display text-5xl text-purple">Our process</h2>
            <ol className="mt-8 space-y-3">
              {processSteps.map((s, i) => (
                <li key={s} className="flex items-baseline gap-4 border-b border-lilac pb-3">
                  <span className="display w-8 text-2xl text-purple/50">{i + 1}</span>
                  <span className="font-medium">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
