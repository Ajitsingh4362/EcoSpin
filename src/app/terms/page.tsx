import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { stores, formatPhone, telHref } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms & conditions",
  description:
    "Terms and conditions for EcoSpin dry cleaning, laundry, steam pressing, pickup & delivery and sofa cleaning in Thane and Kharghar.",
};

/*
 * NOTE FOR OWNER — please review before relying on these terms.
 * Points marked [CONFIRM] are standard dry-cleaning practice that EcoSpin should confirm or change:
 * claim window, compensation limit, unclaimed-garment period, payment modes and jurisdiction.
 * Everything else comes from the printed price lists.
 */

const LAST_UPDATED = "23 November 2026";

type Section = { id: string; title: string; points: string[] };

const sections: Section[] = [
  {
    id: "orders",
    title: "Orders, pickup & delivery",
    points: [
      "Pickup and delivery are free within our service areas in Thane, Mulund and Navi Mumbai.",
      "Dry cleaning orders need a minimum of 7 garments or a bill of ₹1,000.",
      "Please make sure someone is available at the address during the agreed pickup and delivery time. If no one is available, we will reschedule to the next available slot.",
      "Both stores are closed on Fridays. No pickups or deliveries happen on Fridays.",
      "An order is confirmed once our team has collected the garments and issued a receipt or order number. Please keep it until delivery.",
    ],
  },
  {
    id: "pricing",
    title: "Prices & payment",
    points: [
      "Prices are per piece as shown on our price list and are the same at both stores.",
      "Garments not on the price list are charged in proportion to a similar listed item. We will tell you the price before cleaning.",
      "Children’s garments (up to 10 years) are charged at approximately 70% of the adult price.",
      "Heavily embellished, designer or unusually large items may be charged more than the listed price. We will inform you before processing.",
      "No service tax/GST is charged as of now. If tax becomes applicable, it will be added to the bill as per law.",
      "Payment is due on delivery or collection, by cash or UPI. [CONFIRM]",
      "Prices may change from time to time. The rate at the time your order is placed applies.",
    ],
  },
  {
    id: "turnaround",
    title: "Turnaround & express service",
    points: [
      "Regular turnaround is 5 working days for orders from the Thane store and 4 working days for orders from the Kharghar store.",
      "Express service: same-day delivery at 100% extra and next-day delivery at 50% extra, subject to availability and the type of garment.",
      "Delivery dates are estimates. Delays can happen due to the nature of the stain or fabric, festivals, holidays or circumstances beyond our control, and we will keep you informed.",
    ],
  },
  {
    id: "care",
    title: "Garment inspection & care",
    points: [
      "Please empty all pockets before handing over garments. EcoSpin is not responsible for cash, jewellery, documents, pens or other items left in pockets, or for damage they cause.",
      "Tell us about stains, existing damage, loose buttons or special instructions at the time of pickup. We inspect every piece at the first QC check and note anything we find.",
      "We follow the manufacturer’s care label. Where there is no care label, we use the method we judge safest, at the customer’s risk.",
      "We make every effort to remove stains, but some stains — especially old, set-in or previously treated ones — may not come out completely without damaging the fabric.",
      "Normal wear from cleaning, such as slight fading, minor shrinkage within the fabric’s natural limit, or loosening of weak stitching, is not considered damage.",
      "We are not responsible for damage to buttons, sequins, beads, zari, prints, linings or trims that are not suitable for cleaning, or for colour bleeding of fabrics that are not colourfast.",
      "We may refuse to clean any garment we believe cannot be cleaned safely.",
    ],
  },
  {
    id: "claims",
    title: "Claims & compensation",
    points: [
      "Please check your garments at the time of delivery. Any complaint must be reported to the store within 48 hours of delivery, with the garment and its EcoSpin tag. [CONFIRM]",
      "If a garment is damaged or lost due to our negligence, our liability is limited to a maximum of 10 times the cleaning charge of that garment. [CONFIRM]",
      "If you are not happy with the cleaning, we will re-process the garment free of charge once, provided it is reported within the claim period.",
      "No claim will be accepted once the garment has been worn, washed or altered after delivery.",
    ],
  },
  {
    id: "unclaimed",
    title: "Uncollected garments",
    points: [
      "Garments not collected or accepted for delivery within 30 days of the due date may attract a storage charge. [CONFIRM]",
      "Garments not collected within 90 days of the due date may be donated or disposed of, and no claim will be accepted after that. [CONFIRM]",
    ],
  },
  {
    id: "home",
    title: "Sofa & home cleaning",
    points: [
      "Sofa cleaning is done at your home. Minimum charges apply: ₹800 for a 1-seater visit and ₹1,000 for a 2-seater visit.",
      "Please provide access to water and electricity, and clear the area around the sofa before our team arrives.",
      "Drying time depends on fabric and weather. Please avoid using the sofa until it is fully dry.",
    ],
  },
  {
    id: "general",
    title: "General",
    points: [
      "By booking a pickup, dropping garments at a store or using our services, you agree to these terms.",
      "EcoSpin may update these terms at any time. The version on this page at the time of your order applies.",
      "Any dispute is subject to the jurisdiction of the courts in Thane, Maharashtra. [CONFIRM]",
    ],
  },
];

const keyPoints = [
  "Minimum 7 garments or ₹1,000 for dry cleaning",
  "Turnaround: Thane 5, Kharghar 4 working days",
  "Express: same day +100%, next day +50%",
  "Empty pockets and point out stains at pickup",
  "Report any problem within 48 hours of delivery",
  "Stores closed on Fridays",
];

// The [CONFIRM] markers are for the owner only; never show them on the live page.
const clean = (t: string) => t.replace(/\s*\[CONFIRM\]/g, "");

export default function TermsPage() {
  return (
    <>
      <PageHero
        title="Terms & conditions"
        intro="The fine print, in plain language. Please read it before booking — and ask either store if anything is unclear."
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 md:py-20 lg:grid-cols-[16rem_minmax(0,1fr)]">
        {/* Contents */}
        <nav aria-label="On this page" className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm font-semibold text-muted">On this page</p>
          <ol className="mt-3 space-y-1">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="flex gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink/80 hover:bg-lavender hover:text-purple"
                >
                  <span className="w-4 text-purple/50 tabular-nums">{i + 1}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
          <p className="mt-6 px-3 text-xs text-muted">Last updated: {LAST_UPDATED}</p>
        </nav>

        <div className="min-w-0">
          {/* Summary */}
          <section aria-labelledby="key-points" className="rounded-[2rem] bg-purple-deep p-6 text-white md:p-8">
            <h2 id="key-points" className="display text-4xl">The short version</h2>
            <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {keyPoints.map((k) => (
                <li key={k} className="flex gap-3 text-white/85">
                  <span className="mt-2 size-2 shrink-0 rounded-full bg-mint" aria-hidden="true" />
                  {k}
                </li>
              ))}
            </ul>
          </section>

          {/* Sections */}
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-28 border-b border-lilac py-10 last:border-b-0">
              <h2 id={`${s.id}-title`} className="display flex items-baseline gap-4 text-4xl text-purple md:text-5xl">
                <span className="text-purple/30 tabular-nums">{i + 1}</span>
                {s.title}
              </h2>
              <ol className="mt-6 space-y-4">
                {s.points.map((p, j) => (
                  <li key={j} className="flex gap-4 leading-relaxed text-ink/80">
                    <span className="shrink-0 pt-0.5 text-sm font-semibold text-purple/60 tabular-nums">
                      {i + 1}.{j + 1}
                    </span>
                    <span>{clean(p)}</span>
                  </li>
                ))}
              </ol>
            </section>
          ))}

          {/* Contact */}
          <section className="mt-6 rounded-[2rem] bg-lavender p-6 md:p-8">
            <h2 className="display text-3xl text-purple">Questions about these terms?</h2>
            <p className="mt-2 text-ink/75">Call either store — we’re happy to explain.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {stores.map((st) => (
                <a
                  key={st.slug}
                  href={telHref(st.call)}
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-purple ring-1 ring-lilac hover:ring-purple"
                >
                  {st.area.split(",")[0]}: {formatPhone(st.call)}
                </a>
              ))}
              <Link href="/pricing" className="rounded-full px-5 py-3 text-sm font-semibold text-purple underline underline-offset-4">
                See the price list
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
