import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { BookingForm } from "@/components/BookingForm";
import { priceNotes } from "@/data/site";

export const metadata: Metadata = {
  title: "Book a free pickup",
  description: "Book a free laundry and dry cleaning pickup from EcoSpin in Thane, Mulund or Kharghar over WhatsApp.",
};

export default function BookPage() {
  return (
    <>
      <PageHero
        title="Book a free pickup"
        intro="Fill this in and it opens WhatsApp with your request ready to send to the store. We’ll reply to confirm a time."
      />
      <div className="mx-auto grid max-w-6xl gap-14 px-5 py-14 md:py-20 lg:grid-cols-[1fr_18rem]">
        <BookingForm />
        <aside className="self-start rounded-3xl bg-lavender p-6">
          <h2 className="display text-3xl text-purple">Before you book</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink/80">
            {priceNotes.slice(0, 2).concat(priceNotes[4]).map((n) => (
              <li key={n} className="border-l-2 border-purple pl-3">
                {n}
              </li>
            ))}
            <li className="border-l-2 border-purple pl-3">Both stores are closed on Fridays.</li>
          </ul>
        </aside>
      </div>
    </>
  );
}
