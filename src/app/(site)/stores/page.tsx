import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { StoreCard } from "@/components/StoreCard";
import { stores } from "@/data/site";

export const metadata: Metadata = {
  title: "Our stores — Thane (W) and Kharghar",
  description:
    "EcoSpin stores at Dongari Pada, G B Road, Thane (W) and Sector 20, Kharghar, Navi Mumbai. Free pickup and delivery. Closed on Fridays.",
};

export default function StoresPage() {
  return (
    <>
      <PageHero
        title="Our stores"
        intro="Two stores, one owner and one central cleaning unit — so you get the same care and the same prices wherever you drop off."
      />
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-2 md:py-20">
        {stores.map((s, i) => (
          <div key={s.slug} data-reveal="up" style={{ "--d": `${i * 150}ms` } as React.CSSProperties}>
            <StoreCard store={s} withMap />
          </div>
        ))}
      </div>
      <p data-reveal="up" className="mx-auto max-w-6xl px-5 pb-20 text-ink/75">
        We pick up and deliver across Thane, Mulund and Navi Mumbai. Not sure which store is closer? Message either one
        and we’ll sort it out.
      </p>
    </>
  );
}
