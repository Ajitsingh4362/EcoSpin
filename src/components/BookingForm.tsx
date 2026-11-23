"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { WhatsAppIcon } from "./icons";
import { stores, waHref, formatPhone, telHref } from "@/data/site";

const serviceOptions = ["Dry cleaning", "Laundry", "Steam pressing", "Bridal / ethnic wear", "Curtains / carpets", "Sofa cleaning at home", "Shoes / soft toys"];
const slots = ["Morning (10 am – 1 pm)", "Afternoon (1 pm – 4 pm)", "Evening (4 pm – 8 pm)"];

const field = "mt-1.5 w-full rounded-xl border border-lilac bg-white px-4 py-3 outline-none focus:border-purple";
const label = "block text-sm font-semibold text-ink";

export function BookingForm() {
  const [storeSlug, setStoreSlug] = useState<string>(stores[0].slug);
  const [error, setError] = useState("");
  const store = stores.find((s) => s.slug === storeSlug)!;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const phone = String(fd.get("phone") || "").replace(/\D/g, "");
    if (phone.length < 10) {
      setError("Enter a 10-digit mobile number so we can confirm the pickup.");
      return;
    }
    setError("");
    const picked = fd.getAll("services").join(", ") || "Not sure yet";
    const lines = [
      `Hi EcoSpin ${store.area}, I’d like to book a free pickup.`,
      ``,
      `Name: ${fd.get("name")}`,
      `Mobile: ${phone}`,
      `Address: ${fd.get("address")}`,
      `Pickup date: ${fd.get("date") || "Any day"}`,
      `Time: ${fd.get("slot")}`,
      `Services: ${picked}`,
      fd.get("notes") ? `Notes: ${fd.get("notes")}` : "",
    ].filter((l, i) => l !== "" || i === 1);
    window.open(waHref(store.whatsapp, lines.join("\n")), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <fieldset>
        <legend className={label}>Nearest store</legend>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {stores.map((s) => (
            <label
              key={s.slug}
              className="cursor-pointer rounded-2xl border border-lilac p-4 has-[:checked]:border-purple has-[:checked]:bg-lavender has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-purple-bright"
            >
              <input
                type="radio"
                name="store"
                value={s.slug}
                checked={storeSlug === s.slug}
                onChange={() => setStoreSlug(s.slug)}
                className="sr-only"
              />
              <span className="display block text-2xl text-purple">{s.area}</span>
              <span className="text-sm text-muted">Closed {s.closedOn}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className={label}>
          Your name
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className={label}>
          Mobile number
          <input name="phone" required type="tel" inputMode="numeric" autoComplete="tel" className={field} />
        </label>
      </div>

      <label className={label}>
        Pickup address
        <textarea name="address" required rows={3} autoComplete="street-address" className={field} />
      </label>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className={label}>
          Pickup date
          <input
            name="date"
            type="date"
            className={field}
            onFocus={(e) => (e.currentTarget.min = new Date().toISOString().slice(0, 10))}
          />
        </label>
        <label className={label}>
          Preferred time
          <select name="slot" className={field} defaultValue={slots[0]}>
            {slots.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      <fieldset>
        <legend className={label}>What should we pick up?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {serviceOptions.map((s) => (
            <label
              key={s}
              className="cursor-pointer rounded-full border border-lilac px-4 py-2 text-sm font-medium has-[:checked]:border-purple has-[:checked]:bg-purple has-[:checked]:text-white has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-purple-bright"
            >
              <input type="checkbox" name="services" value={s} className="sr-only" />
              {s}
            </label>
          ))}
        </div>
      </fieldset>

      <label className={label}>
        Anything else? <span className="font-normal text-muted">(optional)</span>
        <textarea name="notes" rows={2} placeholder="e.g. 2 sarees, 1 blanket, stain on a white shirt" className={field} />
      </label>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-eco px-7 py-3.5 font-semibold text-white hover:brightness-110"
        >
          <WhatsAppIcon className="size-5" /> Send pickup request on WhatsApp
        </button>
        <p className="w-full text-xs text-muted">
          By booking you agree to our{" "}
          <Link href="/terms" className="font-semibold text-purple underline underline-offset-2">
            terms &amp; conditions
          </Link>
          .
        </p>
        <p className="text-sm text-muted">
          Or call{" "}
          <a href={telHref(store.call)} className="font-semibold text-purple underline underline-offset-4">
            {formatPhone(store.call)}
          </a>
        </p>
      </div>
    </form>
  );
}
