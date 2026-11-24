// Counter settings. Change these numbers here; nothing else needs to change.

import type { OrderStatus, PaymentMode, Speed } from "./types";

export const adminConfig = {
  /** Extra charge per piece when packed on hangers. Set your real rate. */
  hangerChargePerPiece: 10,

  /**
   * How WhatsApp messages are sent.
   * "link" = opens WhatsApp (app or WhatsApp Web) with the message typed; staff presses Send. Free.
   * "api"  = sent automatically through a paid WhatsApp Business API provider. See docs/ADMIN.md.
   */
  whatsappMode: "link" as "link" | "api",

  /** Open the print dialog for the receipt as soon as an order is saved. */
  autoPrintOnSave: true,

  /** Short terms printed at the bottom of every receipt. */
  receiptTerms: [
    "Please check garments at delivery. Report loss or damage within 24 hours with this receipt.",
    "Stain removal and colour fastness are not guaranteed.",
    "Not responsible for valuables left in garments.",
    "Closed on Fridays.",
  ],
  complaintsPhone: "8657422355",
};

export const speeds: { id: Speed; label: string; extra: number }[] = [
  { id: "regular", label: "Regular", extra: 0 },
  { id: "next", label: "Next day +50%", extra: 0.5 },
  { id: "same", label: "Same day +100%", extra: 1 },
];

export const statusFlow: OrderStatus[] = ["received", "processing", "ready", "delivered"];

export const statusLabel: Record<OrderStatus, string> = {
  received: "Received",
  processing: "In process",
  ready: "Ready",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const paymentLabel: Record<PaymentMode, string> = { cash: "Cash", upi: "UPI", card: "Card" };
