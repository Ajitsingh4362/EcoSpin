import { MapPin, Phone, Clock } from "lucide-react";
import { WhatsAppIcon } from "./icons";
import { type Store, formatPhone, telHref, waHref, mapsHref, mapsEmbed } from "@/data/site";

export function StoreCard({ store, withMap = false }: { store: Store; withMap?: boolean }) {
  return (
    <article id={store.slug} className="group scroll-mt-28 overflow-hidden rounded-[2rem] border border-lilac bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_40px_70px_-35px_rgba(92,35,123,0.55)]">
      {withMap && (
        <iframe
          title={`Map of ${store.name}`}
          src={mapsEmbed(store.mapQuery)}
          className="h-64 w-full border-0 grayscale-[30%]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}
      <div className="p-6 md:p-8">
        <p className="text-sm font-semibold text-eco">Free pickup &amp; delivery</p>
        <h3 className="display mt-1 text-4xl text-purple">{store.area}</h3>

        <address className="mt-4 flex gap-3 not-italic leading-relaxed text-ink/80">
          <MapPin className="mt-1 size-5 shrink-0 text-purple" aria-hidden="true" />
          <span>
            {store.address.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </span>
        </address>

        <p className="mt-3 flex gap-3 text-ink/80">
          <Clock className="mt-0.5 size-5 shrink-0 text-purple" aria-hidden="true" />
          <span>
            {store.hours ? `${store.hours} · ` : "Open all week except "}
            {store.hours ? `Closed ${store.closedOn}` : `${store.closedOn}`}
            <span className="block text-sm text-muted">Regular turnaround: {store.turnaround}</span>
          </span>
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={telHref(store.call)}
            data-magnetic
            className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple to-purple-bright px-5 py-3 font-semibold text-white"
          >
            <Phone className="size-4" aria-hidden="true" /> {formatPhone(store.call)}
          </a>
          <a
            href={waHref(store.whatsapp, "Hi EcoSpin, I’d like to book a pickup.")}
            target="_blank"
            rel="noopener noreferrer"
            data-magnetic
            className="btn-shine inline-flex items-center gap-2 rounded-full bg-eco px-5 py-3 font-semibold text-white"
          >
            <WhatsAppIcon className="size-4" /> WhatsApp
          </a>
          <a
            href={mapsHref(store.mapQuery)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold text-purple ring-1 ring-lilac hover:bg-lavender"
          >
            Directions
          </a>
        </div>
      </div>
    </article>
  );
}
