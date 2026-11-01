
"use client";

import { useState } from "react";
import type { Order, OrderStatus } from "@/lib/orders";

export interface OrderFormValues {
  customerName: string;
  phone: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  status?: OrderStatus;
}

interface OrderFormProps {
  order: Order | null;
  saving: boolean;
  onSubmit: (values: OrderFormValues) => Promise<void>;
  onCancel: () => void;
}

export default function OrderForm({
  order,
  saving,
  onSubmit,
  onCancel,
}: OrderFormProps) {
 const [customerName, setCustomerName] = useState(
  order?.customerName ?? ""
);

const [phone, setPhone] = useState(
  order?.phone ?? ""
);

const [productName, setProductName] = useState(
  order?.productName ?? ""
);

const [quantity, setQuantity] = useState(
  String(order?.quantity ?? 1)
);

const [unitPrice, setUnitPrice] = useState(
  String(order?.unitPrice ?? 0)
);

const [status, setStatus] = useState<OrderStatus>(
  order?.status ?? "Pending"
);

  const quantityNumber = Number(quantity);
  const priceNumber = Number(unitPrice);

  const previewTotal =
    Number.isFinite(quantityNumber) && Number.isFinite(priceNumber)
      ? (Math.round(priceNumber * 100) * quantityNumber) / 100
      : 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit({
      customerName: customerName.trim(),
      phone: phone.trim(),
      productName: productName.trim(),
      quantity: quantityNumber,
      unitPrice: priceNumber,
      ...(order ? { status } : {}),
    });
  }

  const fieldClass =
    "mt-1.5 w-full rounded-xl border border-[#E4D7C9] bg-[#FCFAF7] px-4 py-3 text-sm text-[#302822] outline-none transition placeholder:text-[#A99B90] focus:border-[#A77754] focus:ring-2 focus:ring-[#A77754]/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-[#292420]">
          {order ? "Edit order" : "Create a new order"}
        </h2>
        <p className="mt-1 text-sm text-[#817267]">
          {order
            ? "Update the details of this candle order."
            : "Add a customer order to your workspace."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-[#57483D]">
          Customer name
          <input
            required
            maxLength={120}
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            placeholder="e.g. Demo Sara"
            className={fieldClass}
          />
        </label>

        <label className="block text-sm font-medium text-[#57483D]">
          Phone number
          <input
            required
            type="tel"
            maxLength={40}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="e.g. 03 123 456"
            className={fieldClass}
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-[#57483D]">
        Candle / product
        <input
          required
          maxLength={120}
          value={productName}
          onChange={(event) => setProductName(event.target.value)}
          placeholder="e.g. Vanilla Candle"
          className={fieldClass}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-[#57483D]">
          Quantity
          <input
            required
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            className={fieldClass}
          />
        </label>

        <label className="block text-sm font-medium text-[#57483D]">
          Unit price ($)
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={unitPrice}
            onChange={(event) => setUnitPrice(event.target.value)}
            className={fieldClass}
          />
        </label>
      </div>

      {order && (
        <label className="block text-sm font-medium text-[#57483D]">
          Status
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as OrderStatus)
            }
            className={fieldClass}
          >
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Delivered">Delivered</option>
          </select>
        </label>
      )}

      <div className="flex items-center justify-between rounded-2xl bg-[#F6EDE2] p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#957358]">
            Estimated total
          </p>
          <p className="mt-1 text-xs text-[#817267]">
            Final total is calculated by the server.
          </p>
        </div>
        <p className="text-2xl font-bold text-[#6C4535]">
          ${Number.isFinite(previewTotal) ? previewTotal.toFixed(2) : "0.00"}
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-xl border border-[#E2D3C5] px-5 py-3 text-sm font-semibold text-[#6C4535] hover:bg-[#FAF4ED] disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[#6C4535] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#553629] disabled:cursor-wait disabled:opacity-60"
        >
          {saving ? "Saving..." : order ? "Save changes" : "Create order"}
        </button>
      </div>
    </form>
  );
}
