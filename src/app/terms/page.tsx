import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Terms & conditions",
  description: "Terms and conditions for EcoSpin dry cleaning, laundry and pickup services.",
};

// NOTE FOR OWNER: points 1–5 come from the printed price list. Please review and add any other terms
// (damage/loss liability, unclaimed garments, payment) before going live.
const terms = [
  "A minimum of 7 garments or a ₹1,000 bill applies to dry cleaning orders.",
  "Regular turnaround is 5 working days at the Thane store and 4 working days at the Kharghar store.",
  "Express service is charged at 100% extra for same-day delivery and 50% extra for next-day delivery, subject to availability.",
  "Children’s garments (up to 10 years) are charged at approximately 70% of the adult price.",
  "Garments not on the price list are charged in proportion to a similar listed item.",
  "Pickup and delivery are free. Both stores are closed on Fridays.",
  "We follow each garment’s care label. Please point out stains, damage or special instructions when you hand over your order.",
  "Prices are subject to change; the rate at the time of order applies.",
];

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms & conditions" />
      <ol className="mx-auto max-w-3xl list-decimal space-y-4 px-5 py-14 pl-10 text-lg leading-relaxed text-ink/80 marker:font-semibold marker:text-purple md:py-20">
        {terms.map((t) => (
          <li key={t} className="pl-2">
            {t}
          </li>
        ))}
      </ol>
    </>
  );
}
