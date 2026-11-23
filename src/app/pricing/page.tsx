import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { PriceTable } from "@/components/PriceTable";
import { BagBuilder } from "@/components/BagBuilder";
import { priceNotes } from "@/data/site";

export const metadata: Metadata = {
  title: "Price list — dry cleaning, laundry & steam pressing",
  description:
    "EcoSpin price list for gentlemen, ladies and household items. Shirts from ₹140, sarees from ₹370, steam pressing from ₹45. Same rates in Thane and Kharghar.",
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        title="Price list"
        intro="Per-piece prices, the same at our Thane and Kharghar stores. Pickup and delivery are free."
      />
      <div className="mx-auto grid max-w-6xl gap-14 px-5 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0">
          <PriceTable />
        </div>
        <aside className="self-start rounded-3xl bg-lavender p-6 lg:sticky lg:top-28">
          <h2 className="display text-3xl text-purple">Good to know</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink/80">
            {priceNotes.map((n) => (
              <li key={n} className="border-l-2 border-purple pl-3">
                {n}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-ink/70">
            Prices are subject to our{" "}
            <Link href="/terms" className="font-semibold text-purple underline underline-offset-4">
              terms &amp; conditions
            </Link>
            .
          </p>
        </aside>
      </div>
      <section className="bg-lavender">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <h2 className="display text-5xl text-purple md:text-6xl">Fill your bag. See your bill.</h2>
          <p className="mt-4 max-w-xl text-ink/75">Add items to get an instant estimate, then send the list to the store on WhatsApp.</p>
          <div className="mt-10">
            <BagBuilder />
          </div>
        </div>
      </section>
    </>
  );
}
