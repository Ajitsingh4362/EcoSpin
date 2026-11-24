// Temporary database: keeps everything in this browser (localStorage).
// Data stays on this one device/browser only. Replace with Supabase for real use (docs/ADMIN.md).

import { computeTotals, dueDateFor, getStore } from "../lib/calc";
import type { Customer, CustomerSummary, Order, OrderStatus } from "../types";
import type { AdminRepo, OrderFilter } from "./repo";

const KEY = "ecospin-admin-v1";
const EVENT = "ecospin-admin-change";

type DB = { customers: Customer[]; orders: Order[]; counters: Record<string, number> };

const empty = (): DB => ({ customers: [], orders: [], counters: {} });

function load(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty(), ...JSON.parse(raw) } : empty();
  } catch {
    return empty();
  }
}

function save(db: DB) {
  localStorage.setItem(KEY, JSON.stringify(db));
  window.dispatchEvent(new Event(EVENT));
}

const uid = () => crypto.randomUUID();
const now = () => new Date().toISOString();

function matches(o: Order, f: OrderFilter) {
  if (f.storeSlug && o.storeSlug !== f.storeSlug) return false;
  if (f.customerId && o.customerId !== f.customerId) return false;
  if (f.status === "open" && (o.status === "delivered" || o.status === "cancelled")) return false;
  if (f.status && f.status !== "open" && o.status !== f.status) return false;
  if (f.search) {
    const q = f.search.trim().toLowerCase();
    if (q && !`${o.orderNo} ${o.customerName} ${o.customerPhone}`.toLowerCase().includes(q)) return false;
  }
  return true;
}

function update(id: string, fn: (o: Order) => Order): Order {
  const db = load();
  const i = db.orders.findIndex((o) => o.id === id);
  if (i < 0) throw new Error("Order not found");
  db.orders[i] = fn(db.orders[i]);
  save(db);
  return db.orders[i];
}

export const localRepo: AdminRepo = {
  async listOrders(filter = {}) {
    return load()
      .orders.filter((o) => matches(o, filter))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getOrder(id) {
    return load().orders.find((o) => o.id === id) ?? null;
  },

  async createOrder(input) {
    const db = load();
    const at = now();

    // Customer: reuse by phone, refresh name/address.
    let customer = db.customers.find((c) => c.phone === input.customer.phone);
    if (customer) {
      customer.name = input.customer.name;
      if (input.customer.address) customer.address = input.customer.address;
    } else {
      customer = { id: uid(), ...input.customer, notes: "", createdAt: at };
      db.customers.push(customer);
    }

    const store = getStore(input.storeSlug);
    const next = (db.counters[input.storeSlug] ?? 0) + 1;
    db.counters[input.storeSlug] = next;

    const totals = computeTotals(input.items, input.speed, input.packing, input.discount);
    const payments = input.advance && input.advance.amount > 0
      ? [{ id: uid(), amount: Math.min(input.advance.amount, totals.total), mode: input.advance.mode, at }]
      : [];
    const paid = payments.reduce((n, p) => n + p.amount, 0);

    const order: Order = {
      id: uid(),
      orderNo: `${store.orderPrefix}-${String(next).padStart(4, "0")}`,
      storeSlug: input.storeSlug,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: input.customer.address,
      items: input.items.map((i) => ({ ...i, id: uid() })),
      ...totals,
      speed: input.speed,
      packing: input.packing,
      homeDelivery: input.homeDelivery,
      paid,
      balance: totals.total - paid,
      status: "received",
      note: input.note,
      createdAt: at,
      dueDate: dueDateFor(input.storeSlug, input.speed),
      deliveredAt: null,
      payments,
      history: [{ status: "received", at }],
    };
    db.orders.push(order);
    save(db);
    return order;
  },

  async setStatus(id, status: OrderStatus) {
    return update(id, (o) => ({
      ...o,
      status,
      deliveredAt: status === "delivered" ? now() : o.deliveredAt,
      history: [...o.history, { status, at: now() }],
    }));
  },

  async addPayment(id, amount, mode) {
    return update(id, (o) => {
      const amt = Math.max(0, Math.min(Math.round(amount), o.balance));
      const paid = o.paid + amt;
      return { ...o, paid, balance: o.total - paid, payments: [...o.payments, { id: uid(), amount: amt, mode, at: now() }] };
    });
  },

  async findCustomerByPhone(phone) {
    return load().customers.find((c) => c.phone === phone) ?? null;
  },

  async listCustomers(search = "") {
    const db = load();
    const q = search.trim().toLowerCase();
    return db.customers
      .filter((c) => !q || `${c.name} ${c.phone}`.toLowerCase().includes(q))
      .map((c): CustomerSummary => {
        const mine = db.orders.filter((o) => o.customerId === c.id && o.status !== "cancelled");
        return {
          ...c,
          orders: mine.length,
          spent: mine.reduce((n, o) => n + o.total, 0),
          due: mine.reduce((n, o) => n + o.balance, 0),
          lastOrderAt: mine.map((o) => o.createdAt).sort().at(-1) ?? null,
        };
      })
      .sort((a, b) => (b.lastOrderAt ?? "").localeCompare(a.lastOrderAt ?? ""));
  },

  subscribe(onChange) {
    const onStorage = (e: StorageEvent) => e.key === KEY && onChange();
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onStorage); // other tabs
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  },
};
