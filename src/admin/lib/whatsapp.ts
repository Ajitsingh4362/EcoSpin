// WhatsApp messages to the customer.
// Today: "link" mode opens WhatsApp with the message ready; staff presses Send (free).
// Later: switch adminConfig.whatsappMode to "api" and build /api/whatsapp — see docs/ADMIN.md.

import { formatPhone, inr, waHref } from "@/data/site";
import { adminConfig, speeds } from "../config";
import type { Order } from "../types";
import { fmtDate, getStore } from "./calc";

export type MessageKind = "order-received" | "order-ready" | "payment-reminder";

export function buildMessage(order: Order, kind: MessageKind): string {
  const store = getStore(order.storeSlug);
  const hello = `Hello ${order.customerName.split(" ")[0]},`;
  const sign = `— EcoSpin Dry-Cleaners, ${store.area}\n📞 ${formatPhone(store.call)}`;

  if (kind === "order-ready") {
    return [
      hello,
      ``,
      `Your clothes are ready! ✨`,
      `Order *${order.orderNo}* (${order.pieces} pcs)`,
      order.balance > 0 ? `Amount to pay: *${inr(order.balance)}*` : `Fully paid ✅`,
      order.homeDelivery
        ? `We will deliver them to you shortly.`
        : `Please collect them from our store (closed on ${store.closedOn}s).`,
      ``,
      sign,
    ].join("\n");
  }

  if (kind === "payment-reminder") {
    return [hello, ``, `A gentle reminder: ${inr(order.balance)} is pending for order *${order.orderNo}*.`, ``, sign].join(
      "\n",
    );
  }

  const rows = order.items.map(
    (i) => `• ${i.name}${i.mode === "press" ? " (press)" : ""} × ${i.qty} = ${inr(i.qty * i.price)}`,
  );
  return [
    hello,
    ``,
    `Thank you for choosing EcoSpin! 🧺 We have received your order.`,
    ``,
    `*Order ${order.orderNo}* (${order.pieces} pcs)`,
    ...rows,
    order.expressCharge ? `Express (${speeds.find((s) => s.id === order.speed)!.label}): ${inr(order.expressCharge)}` : "",
    order.hangerCharge ? `Hanger packing: ${inr(order.hangerCharge)}` : "",
    order.discount ? `Discount: −${inr(order.discount)}` : "",
    `*Total: ${inr(order.total)}*`,
    order.paid ? `Paid: ${inr(order.paid)}, balance: ${inr(order.balance)}` : "",
    ``,
    `Ready by: *${fmtDate(order.dueDate)}*`,
    ``,
    `Complaints: ${formatPhone(adminConfig.complaintsPhone)}`,
    sign,
  ]
    .filter((l, i, a) => l !== "" || a[i - 1] !== "")
    .join("\n");
}

export function messageLink(order: Order, kind: MessageKind) {
  return waHref(order.customerPhone, buildMessage(order, kind));
}

/**
 * Opens a tab synchronously (inside the click), so the browser doesn't block it as a pop-up
 * even when saving to a remote database takes a moment. Call `.go(order, kind)` once saved.
 */
export function prepareWhatsAppTab() {
  if (adminConfig.whatsappMode !== "link") {
    return { go: (o: Order, k: MessageKind) => void sendViaApi(o, k), close() {} };
  }
  const tab = window.open("about:blank", "_blank");
  return {
    go(order: Order, kind: MessageKind) {
      const url = messageLink(order, kind);
      if (tab && !tab.closed) tab.location.href = url;
      else window.open(url, "_blank", "noopener,noreferrer");
    },
    close() {
      tab?.close();
    },
  };
}

/** Paid WhatsApp Business API. Build this route on the server — never put API keys in the browser. */
async function sendViaApi(order: Order, kind: MessageKind) {
  await fetch("/api/whatsapp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId: order.id, kind }),
  });
}
