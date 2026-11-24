import Link from "next/link";
import { formatPhone, inr } from "@/data/site";
import { fmtDate, todayYmd } from "../lib/calc";
import type { Order } from "../types";
import { StatusBadge } from "./StatusBadge";

export function OrderRow({ order }: { order: Order }) {
  const open = order.status !== "delivered" && order.status !== "cancelled";
  const overdue = open && order.dueDate < todayYmd();
  return (
    <li>
      <Link
        href={`/admin/order?id=${order.id}`}
        className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-4 py-3 hover:bg-lavender/50 @2xl:grid-cols-[110px_minmax(0,1fr)_130px_110px_auto]"
      >
        <span className="order-1 display text-xl leading-none text-purple-deep @2xl:order-none">{order.orderNo}</span>
        <span className="order-3 col-span-2 min-w-0 @2xl:order-none @2xl:col-span-1">
          <span className="block truncate font-semibold">{order.customerName}</span>
          <span className="block text-sm text-muted">
            <span className="whitespace-nowrap">{formatPhone(order.customerPhone)}</span> · {order.pieces} pcs
          </span>
        </span>
        <span className={`order-4 text-sm @2xl:order-none ${overdue ? "font-bold text-red-600" : "text-muted"}`}>
          {open ? (overdue ? "Overdue " : "Due ") : ""}
          {fmtDate(open ? order.dueDate : order.createdAt)}
        </span>
        <span className="order-5 text-right text-sm @2xl:order-none">
          <span className="font-semibold">{inr(order.total)}</span>
          {order.balance > 0 && order.status !== "cancelled" && (
            <span className="block text-xs font-semibold text-red-600">{inr(order.balance)} due</span>
          )}
        </span>
        <span className="order-2 justify-self-end @2xl:order-none">
          <StatusBadge status={order.status} />
        </span>
      </Link>
    </li>
  );
}

export function OrderList({ orders, empty }: { orders: Order[]; empty: React.ReactNode }) {
  if (!orders.length) return <div className="px-4 py-8 text-center text-sm text-muted">{empty}</div>;
  return <ul className="@container divide-y divide-lilac/50">{orders.map((o) => <OrderRow key={o.id} order={o} />)}</ul>;
}
