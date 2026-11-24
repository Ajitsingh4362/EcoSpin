// Shapes of everything the admin panel stores.
// The same shapes map 1:1 to the Supabase tables in supabase/schema.sql.

export type StoreSlug = "thane" | "kharghar";

export type OrderStatus = "received" | "processing" | "ready" | "delivered" | "cancelled";

export type ServiceMode = "dc" | "press"; // dry clean / wash, or steam press only

export type PaymentMode = "cash" | "upi" | "card";

export type Speed = "regular" | "next" | "same";

export type Packing = "fold" | "hanger";

export type Customer = {
  id: string;
  name: string;
  phone: string; // 10 digits, no +91
  address: string;
  notes: string;
  createdAt: string; // ISO
};

export type OrderItem = {
  id: string;
  name: string; // "Shirt / T-shirt"
  category: string; // "gentlemen" | "ladies" | "household" | "custom"
  mode: ServiceMode;
  price: number; // per piece, in rupees
  qty: number;
  note: string; // colour / brand / damage, optional
};

export type Payment = {
  id: string;
  amount: number;
  mode: PaymentMode;
  at: string; // ISO
};

export type StatusChange = { status: OrderStatus; at: string };

export type Order = {
  id: string;
  orderNo: string; // "KH-0012"
  storeSlug: StoreSlug;
  customerId: string;
  // Snapshot of the customer at order time, so old receipts never change.
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  pieces: number;
  speed: Speed;
  packing: Packing;
  homeDelivery: boolean;
  subtotal: number;
  expressCharge: number;
  hangerCharge: number;
  discount: number;
  total: number;
  paid: number;
  balance: number;
  status: OrderStatus;
  note: string;
  createdAt: string; // ISO
  dueDate: string; // YYYY-MM-DD
  deliveredAt: string | null;
  payments: Payment[];
  history: StatusChange[];
};

export type NewOrderInput = {
  storeSlug: StoreSlug;
  customer: { name: string; phone: string; address: string };
  items: Omit<OrderItem, "id">[];
  speed: Speed;
  packing: Packing;
  homeDelivery: boolean;
  discount: number;
  advance: { amount: number; mode: PaymentMode } | null;
  note: string;
};

export type CustomerSummary = Customer & {
  orders: number;
  spent: number;
  due: number;
  lastOrderAt: string | null;
};
