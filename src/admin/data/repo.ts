// The ONE contract between the screens and the database.
// Screens only ever call these functions. To move from this device's storage to Supabase,
// write a second implementation of AdminRepo (see docs/ADMIN.md) and switch it in ./index.ts.

import type { Customer, CustomerSummary, NewOrderInput, Order, OrderStatus, PaymentMode, StoreSlug } from "../types";

export type OrderFilter = {
  storeSlug?: StoreSlug;
  status?: OrderStatus | "open"; // "open" = not delivered and not cancelled
  search?: string; // order no, name or phone
  customerId?: string;
};

export interface AdminRepo {
  listOrders(filter?: OrderFilter): Promise<Order[]>;
  getOrder(id: string): Promise<Order | null>;
  createOrder(input: NewOrderInput): Promise<Order>;
  setStatus(id: string, status: OrderStatus): Promise<Order>;
  addPayment(id: string, amount: number, mode: PaymentMode): Promise<Order>;

  findCustomerByPhone(phone: string): Promise<Customer | null>;
  listCustomers(search?: string): Promise<CustomerSummary[]>;

  /** Called whenever data changes, so open screens refresh. Returns an unsubscribe function. */
  subscribe(onChange: () => void): () => void;
}
