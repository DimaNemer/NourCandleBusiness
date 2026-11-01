
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Order, OrderStatus } from "@/lib/orders";
import OrderCard from "./OrderCard";
import OrderForm, { type OrderFormValues } from "./OrderForm";

type StatusFilter = "All" | OrderStatus;

async function readApiError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return data.error || `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

export default function OrderDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("All");

  const [formOpen, setFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);

  const loadOrders = useCallback(async () => {
    setError("");

    try {
      const response = await fetch("/api/orders", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      const data: Order[] = await response.json();
      setOrders(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadOrders();
  }, [loadOrders]);

  const counts = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((o) => o.status === "Pending").length,
      preparing: orders.filter((o) => o.status === "Preparing").length,
      delivered: orders.filter((o) => o.status === "Delivered").length,
    }),
    [orders]
  );

  const visibleOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        filter === "All" || order.status === filter;

      const matchesSearch =
        order.customerName.toLowerCase().includes(query) ||
        order.productName.toLowerCase().includes(query) ||
        order.phone.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, filter]);

  function openCreateForm() {
    setEditingOrder(null);
    setActionError("");
    setFormOpen(true);
  }

  function openEditForm(order: Order) {
    setEditingOrder(order);
    setActionError("");
    setFormOpen(true);
  }

  async function saveOrder(values: OrderFormValues) {
    setBusy(true);
    setActionError("");

    try {
      const url = editingOrder
        ? `/api/orders/${editingOrder.id}`
        : "/api/orders";

      const response = await fetch(url, {
        method: editingOrder ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      setFormOpen(false);
      setEditingOrder(null);
      await loadOrders();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Unable to save order."
      );
    } finally {
      setBusy(false);
    }
  }

  async function changeStatus(order: Order, status: OrderStatus) {
    setBusyId(order.id);
    setActionError("");

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      await loadOrders();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Unable to update status."
      );
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deletingOrder) return;

    setBusy(true);
    setActionError("");

    try {
      const response = await fetch(
        `/api/orders/${deletingOrder.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      setDeletingOrder(null);
      await loadOrders();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Unable to delete order."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#292420]">
      <header className="border-b border-white/10 bg-[#292420]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#45352B] text-2xl text-[#E9B37B]">
              ✦
            </div>
            <div>
              <p className="text-xl font-bold tracking-[0.12em] text-[#FFF8F0]">
                NOUR.
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#D6B79A]">
                Order Desk
              </p>
            </div>
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-[#F4E7D9]">
              Candle Studio
            </p>
            <p className="text-xs text-[#BCA695]">
              Made with care · Beirut
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8 sm:py-10">
     <section
  className="relative overflow-hidden rounded-[28px] bg-[#6C4535] bg-cover bg-center px-6 py-10 text-white sm:px-10 sm:py-14"
  style={{
    backgroundImage:
      "linear-gradient(90deg, rgba(41,36,32,0.95) 0%, rgba(41,36,32,0.75) 45%, rgba(41,36,32,0.15) 100%), url('/image/candle.png')",
  }}
>
          <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#B98560]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 right-28 h-64 w-64 rounded-full bg-[#E2AE76]/15 blur-3xl" />

          <div className="relative max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#E8C8AB]">
              The everyday workspace
            </p>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              A little more calm.
              <br />
              A lot more organized.
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#F2DFD0] sm:text-base">
              Every candle has a story. Keep every customer order
              beautifully organized, from the first request to delivery.
            </p>
          </div>
        </section>

        <section>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A17A5C]">
                Your workspace
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                Order overview
              </h2>
              <p className="mt-1 text-sm text-[#82746A]">
                A clear picture of everything in progress.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateForm}
              className="rounded-xl bg-[#6C4535] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#553629]"
            >
              + New order
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: "Total orders", value: counts.total, icon: "◈" },
              { label: "Pending", value: counts.pending, icon: "◷" },
              { label: "Preparing", value: counts.preparing, icon: "✧" },
              { label: "Delivered", value: counts.delivered, icon: "✓" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#E9DED2] bg-white p-5 shadow-[0_5px_25px_rgba(66,45,29,0.03)]"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F6EDE2] text-xl text-[#9A6B4A]">
                  {stat.icon}
                </div>
                <p className="text-3xl font-semibold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-[#82746A]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A17A5C]">
                Orders
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                Your order collection
              </h2>
              <p className="mt-1 text-sm text-[#82746A]">
                Find, update, and manage customer requests.
              </p>
            </div>
            <span className="text-sm text-[#82746A]">
              {visibleOrders.length} shown
            </span>
          </div>

          <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-[#E9DED2] bg-white p-4 sm:flex-row">
            <label className="flex-1">
              <span className="sr-only">Search orders</span>
              <input
                type="search"
                placeholder="Search by customer, phone, or candle..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-[#E5D8CA] bg-[#FCFAF7] px-4 py-3 text-sm outline-none placeholder:text-[#A99B90] focus:border-[#A77754] focus:ring-2 focus:ring-[#A77754]/20"
              />
            </label>

            <label>
              <span className="sr-only">Filter by status</span>
              <select
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as StatusFilter)
                }
                className="w-full rounded-xl border border-[#E5D8CA] bg-[#FCFAF7] px-4 py-3 text-sm outline-none focus:border-[#A77754] sm:min-w-44"
              >
                <option value="All">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Preparing">Preparing</option>
                <option value="Delivered">Delivered</option>
              </select>
            </label>
          </div>

          {actionError && !formOpen && !deletingOrder && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {actionError}
            </div>
          )}

          {loading ? (
            <div
              role="status"
              className="rounded-2xl border border-[#E9DED2] bg-white px-6 py-16 text-center text-[#82746A]"
            >
              Loading your orders...
            </div>
          ) : error ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-white px-6 py-14 text-center"
            >
              <h3 className="text-lg font-semibold">Couldn&apost load orders</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
              <button
                type="button"
                onClick={() => void loadOrders()}
                className="mt-5 rounded-xl bg-[#6C4535] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Try again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#DCCBBB] bg-white px-6 py-16 text-center">
              <div className="mb-4 text-4xl">✦</div>
              <h3 className="text-xl font-semibold">A fresh beginning</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#82746A]">
                Your order desk is ready. Create your first candle order
                to get started.
              </p>
              <button
                type="button"
                onClick={openCreateForm}
                className="mt-6 rounded-xl bg-[#6C4535] px-5 py-3 text-sm font-semibold text-white"
              >
                Create first order
              </button>
            </div>
          ) : visibleOrders.length === 0 ? (
            <div className="rounded-2xl border border-[#E9DED2] bg-white px-6 py-14 text-center">
              <h3 className="text-lg font-semibold">No matching orders</h3>
              <p className="mt-2 text-sm text-[#82746A]">
                Try another search or status filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilter("All");
                }}
                className="mt-4 text-sm font-semibold text-[#6C4535] underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  busy={busy || busyId === order.id}
                  onEdit={openEditForm}
                  onDelete={(selected) => {
                    setActionError("");
                    setDeletingOrder(selected);
                  }}
                  onStatusChange={changeStatus}
                />
              ))}
            </div>
          )}
        </section>

        <footer className="border-t border-[#E9DED2] pt-6 text-center text-xs text-[#9A8A7D]">
          NOUR. Order Desk · A thoughtful space for everyday orders
        </footer>
      </main>

      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#201915]/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !busy) {
              setFormOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={editingOrder ? "Edit order" : "Create order"}
            className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-[24px] bg-white p-6 shadow-2xl sm:p-8"
          >
            <OrderForm
              key={editingOrder?.id ?? "new"}
              order={editingOrder}
              saving={busy}
              onSubmit={saveOrder}
              onCancel={() => setFormOpen(false)}
            />
            {actionError && (
              <p role="alert" className="mt-4 text-sm text-red-700">
                {actionError}
              </p>
            )}
          </div>
        </div>
      )}

      {deletingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#201915]/60 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-description"
            className="w-full max-w-md rounded-[24px] bg-white p-7 shadow-2xl"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-700">
              !
            </div>
            <h2 id="delete-title" className="text-xl font-semibold">
              Delete this order?
            </h2>
            <p
              id="delete-description"
              className="mt-3 text-sm leading-6 text-[#82746A]"
            >
              You&aposre about to delete {deletingOrder.customerName}&aposs
              order for {deletingOrder.productName}. This action cannot
              be undone.
            </p>

            {actionError && (
              <p role="alert" className="mt-4 text-sm text-red-700">
                {actionError}
              </p>
            )}

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => setDeletingOrder(null)}
                className="rounded-xl border border-[#E2D3C5] px-5 py-3 text-sm font-semibold text-[#6C4535]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void confirmDelete()}
                className="rounded-xl bg-red-700 px-5 py-3 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-50"
              >
                {busy ? "Deleting..." : "Delete order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
