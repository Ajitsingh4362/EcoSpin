"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { WhatsAppIcon } from "./icons";
import { stores, waHref } from "@/data/site";

/** Floating button: lets the customer choose which store to message. */
export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 md:right-6 md:bottom-6">
      {open && (
        <div role="dialog" aria-label="Choose a store" className="w-64 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-lilac">
          <p className="text-sm font-semibold text-ink">Message which store?</p>
          <ul className="mt-3 space-y-2">
            {stores.map((s) => (
              <li key={s.slug}>
                <a
                  href={waHref(s.whatsapp, "Hi EcoSpin, I’d like to book a pickup.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl bg-lavender px-4 py-3 text-sm font-semibold text-purple hover:bg-lilac/60"
                >
                  {s.area}
                  <WhatsAppIcon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="grid size-14 place-items-center rounded-full bg-eco text-white shadow-lg hover:brightness-110"
      >
        {open ? <X className="size-6" /> : <WhatsAppIcon className="size-7" />}
        <span className="sr-only">{open ? "Close" : "Chat on WhatsApp"}</span>
      </button>
    </div>
  );
}
