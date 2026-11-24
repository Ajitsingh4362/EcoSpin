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
 * Source: EcoSpin's printed Terms & Conditions (18 points, back of the receipt book),
 * the front of the receipt, and the printed price lists. Wording lightly edited for clarity only.
 */

const LAST_UPDATED = "23 November 2026";
const COMPLAINTS = "8657422355";

type Section = { id: string; title: string; points: string[] };

const sections: Section[] = [
  {
    id: "orders",
    title: "Orders, pickup & delivery",
    points: [
      "Free pickup and delivery is available on orders of at least 7 garments or a bill of ₹700.",
      "Dry cleaning orders need a minimum of 7 garments or a bill of ₹1,000.",
      "Please examine every garment thoroughly before handing it over. EcoSpin is not responsible for loss of or damage to valuables left in the garments.",
      "The receipt given at pickup is to verify the quantity received. The kind of garment and the process it needs are confirmed at our process centre.",
      "Both stores are closed on Fridays. The Kharghar store is open from 9:00 am to 9:00 pm.",
    ],
  },
  {
    id: "pricing",
    title: "Prices & charges",
    points: [
      "Prices are per piece as shown on our price list and are the same at both stores.",
      "Garments not on the price list are charged in proportion to a similar listed item.",
      "Children’s garments (up to 10 years) are charged at approximately 70% of the adult price.",
      "Clothes are returned folded as standard. Packing on hangers is charged extra.",
      "Sofa cleaning at home has minimum charges: ₹800 for a 1-seater visit and ₹1,000 for a 2-seater visit.",
      "Refer a friend to EcoSpin and get an extra discount — ask at the store.",
      "These terms and the price list may change without prior notice.",
    ],
  },
  {
    id: "turnaround",
    title: "Delivery time & express service",
    points: [
      "Normal delivery is within 96 hours (4 days) of pickup. Orders through the Thane store take up to 5 working days.",
      "Express delivery within 24 hours of pickup is charged 50% extra, and same-day delivery is charged 100% extra. No discount applies to express orders.",
      "EcoSpin accepts no liability for delays caused by reasons beyond our control.",
    ],
  },
  {
    id: "care",
    title: "Cleaning & garment care",
    points: [
      "Our team is highly skilled and understands fabric, and we use hi-tech machines and eco-friendly solvents, detergents and chemicals. Even so, EcoSpin does not guarantee stain removal, or against damage caused while removing a stain.",
      "EcoSpin does not guarantee against colour bleeding. Colour fastness depends on the quality of the fabric and dyeing by the manufacturer; we clean and serve your garments skilfully and technically.",
      "Damage to old, long-stored or fragile garments is not EcoSpin’s responsibility.",
      "Our experts decide whether a garment is dry cleaned or wet cleaned, based on the fabric and the manufacturer’s instructions.",
      "Any damage that occurs while following the manufacturer’s care label instructions is not the responsibility of EcoSpin.",
      "Innerwear is cleaned separately and steamed to refresh the fibres, but may not be ironed.",
      "EcoSpin reserves the right to refuse service for any garment.",
    ],
  },
  {
    id: "claims",
    title: "Claims & compensation",
    points: [
      "Please check all garments at the time of delivery. Any loss or damage must be reported within 24 hours of receiving the garments, along with a copy of the bill.",
      "If a garment is misplaced or damaged, our liability is 5 to 10 times the billing price of that garment, subject to the approval of the laundry manager.",
      "EcoSpin is not responsible for loss of or damage to clothing caused by fire, theft, accidents or other causes beyond our control.",
      `For any problem or complaint, contact us on ${"8657 422 355"} with the bill copy of the garment and our invoice, and our team will do the needful.`,
    ],
  },
  {
    id: "unclaimed",
    title: "Uncollected garments",
    points: [
      "EcoSpin is not responsible for garments that are not collected or called for within 7 days of the pickup date.",
      "Unclaimed garments are kept safely for a maximum of 30 days, after which EcoSpin is not responsible for them.",
      "A safe-keeping charge of ₹5 per piece per day applies from 15 days after the delivery date.",
    ],
  },
  {
    id: "general",
    title: "General",
    points: [
      "By booking a pickup, handing over garments or signing our receipt, you confirm that you have read, understood and agree to these terms.",
      "Any unresolved dispute will be settled legally under the applicable jurisdiction.",
    ],
  },
];

const keyPoints = [
  "Free pickup on 7+ garments or ₹700+",
  "Normal delivery in 96 hours (4 days)",
  "Express: 24 hours +50%, same day +100%",
  "Empty pockets — we can’t be responsible for valuables",
  "Report any problem within 24 hours, with your bill",
  "Unclaimed clothes kept up to 30 days",
];

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
          <section data-reveal="up" aria-labelledby="key-points" className="rounded-[2rem] bg-gradient-to-br from-purple to-purple-bright p-6 text-white shadow-[0_30px_60px_-30px_rgba(92,35,123,0.7)] md:p-8">
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
              <h2 data-reveal="mask" id={`${s.id}-title`} className="display flex items-baseline gap-4 text-4xl text-purple md:text-5xl">
                <span className="text-purple/30 tabular-nums">{i + 1}</span>
                {s.title}
              </h2>
              <ol className="mt-6 space-y-4">
                {s.points.map((p, j) => (
                  <li key={j} className="flex gap-4 leading-relaxed text-ink/80">
                    <span className="shrink-0 pt-0.5 text-sm font-semibold text-purple/60 tabular-nums">
                      {i + 1}.{j + 1}
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ol>
            </section>
          ))}

          {/* Contact */}
          <section className="mt-6 rounded-[2rem] bg-lavender p-6 md:p-8">
            <h2 className="display text-3xl text-purple">Questions or a complaint?</h2>
            <p className="mt-2 text-ink/75">
              Call or WhatsApp{" "}
              <a href={`https://wa.me/91${COMPLAINTS}`} className="font-semibold text-purple underline underline-offset-4">
                {formatPhone(COMPLAINTS)}
              </a>{" "}
              with your bill copy, or call either store.
            </p>
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
