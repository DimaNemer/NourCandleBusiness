
"use client";

import type { Order, OrderStatus } from "@/lib/orders";

interface OrderCardProps {
  order: Order;
  busy: boolean;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
  onStatusChange: (order: Order, status: OrderStatus) => void;
}

const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-amber-50 text-amber-800 ring-amber-200",
  Preparing: "bg-orange-50 text-orange-800 ring-orange-200",
  Delivered: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};

export default function OrderCard({
  order,
  busy,
  onEdit,
  onDelete,
  onStatusChange,
}: OrderCardProps) {
  return (
    <article className="rounded-2xl border border-[#E9DED2] bg-white p-5 shadow-[0_8px_30px_rgba(66,45,29,0.04)] transition-shadow hover:shadow-[0_12px_35px_rgba(66,45,29,0.09)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A17A5C]">
            Customer
          </p>
          <h3 className="mt-1 break-words text-lg font-semibold text-[#292420]">
            {order.customerName}
          </h3>
          <p className="mt-1 break-all text-sm text-[#807267]">
            {order.phone}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusStyles[order.status]}`}
        >
          {order.status}
        </span>
      </div>

      <div className="my-5 h-px bg-[#F0E9E1]" />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-[#8A7D72]">Product</p>
          <p className="mt-1 font-medium text-[#352B26]">
            {order.productName}
          </p>
        </div>

        <div>
          <p className="text-xs text-[#8A7D72]">Quantity</p>
          <p className="mt-1 font-medium text-[#352B26]">
            {order.quantity}
          </p>
        </div>

        <div>
          <p className="text-xs text-[#8A7D72]">Unit price</p>
          <p className="mt-1 font-medium text-[#352B26]">
            ${order.unitPrice.toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-xs text-[#8A7D72]">Order total</p>
          <p className="mt-1 text-xl font-bold text-[#6C4535]">
            ${order.total.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-[#F0E9E1] pt-4">
        <label
          htmlFor={`status-${order.id}`}
          className="mb-2 block text-xs font-medium text-[#77685D]"
        >
          Update status
        </label>

        <select
          id={`status-${order.id}`}
          value={order.status}
          disabled={busy}
          onChange={(event) =>
            onStatusChange(order, event.target.value as OrderStatus)
          }
          className="w-full rounded-xl border border-[#E5D8CA] bg-[#FCFAF7] px-3 py-2.5 text-sm text-[#352B26] outline-none focus:border-[#A77754] focus:ring-2 focus:ring-[#A77754]/20 disabled:opacity-60"
        >
          <option value="Pending">Pending</option>
          <option value="Preparing">Preparing</option>
          <option value="Delivered">Delivered</option>
        </select>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onEdit(order)}
            className="flex-1 rounded-xl border border-[#E2D3C5] px-4 py-2.5 text-sm font-semibold text-[#6C4535] transition hover:bg-[#FAF4ED] disabled:opacity-50"
          >
            Edit order
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={() => onDelete(order)}
            className="rounded-xl border border-red-100 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
