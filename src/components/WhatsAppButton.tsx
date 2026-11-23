"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { WhatsAppIcon } from "./icons";
import { stores, waHref } from "@/data/site";

/** Floating button: lets the customer choose which store to message. */
export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 md:right-6 md:bottom-6">
      {open && (
        <div role="dialog" aria-label="Choose a store" className="w-64 origin-bottom-right animate-[pop-in_.35s_cubic-bezier(.2,.8,.2,1)] rounded-3xl bg-white/90 p-4 shadow-2xl ring-1 ring-lilac backdrop-blur-xl">
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
        className="pulse-ring relative isolate grid size-14 place-items-center rounded-full bg-eco text-white shadow-[0_14px_30px_-10px_rgba(27,166,54,0.8)] transition-transform hover:scale-110"
      >
        {open ? <X className="size-6" /> : <WhatsAppIcon className="size-7" />}
        <span className="sr-only">{open ? "Close" : "Chat on WhatsApp"}</span>
      </button>
    </div>
  );
}
