import { statusLabel } from "../config";
import type { OrderStatus } from "../types";

const tone: Record<OrderStatus, string> = {
  received: "bg-lavender text-purple ring-lilac",
  processing: "bg-amber-50 text-amber-800 ring-amber-200",
  ready: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  delivered: "bg-zinc-100 text-zinc-600 ring-zinc-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${tone[status]}`}>
      {statusLabel[status]}
    </span>
  );
}
