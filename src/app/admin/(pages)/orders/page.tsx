"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Eye } from "lucide-react";
import { useAdminGetOrdersQuery, OrderStatus, OrderListItem } from "@/state/orders-api";

const STATUS_TABS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending_payment" },
  { label: "Paid", value: "paid" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const STATUS_BADGES: Record<OrderStatus, { label: string; className: string }> = {
  pending_payment: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
  paid: { label: "Paid", className: "bg-green-100 text-green-800" },
  processing: { label: "Processing", className: "bg-blue-100 text-blue-800" },
  shipped: { label: "Shipped", className: "bg-purple-100 text-purple-800" },
  delivered: { label: "Delivered", className: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800" },
};

const formatPrice = (cents: number) =>
  `€${(cents / 100).toLocaleString("en-IE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IE", { day: "2-digit", month: "short", year: "numeric" });

const shortId = (id: string) => id.slice(0, 8).toUpperCase();

export default function AdminOrdersPage() {
  const router = useRouter();
  const [activeStatus, setActiveStatus] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = useAdminGetOrdersQuery({
    status: activeStatus === "all" ? undefined : activeStatus,
    search: search || undefined,
    limit: 100,
  });

  const orders = data?.data ?? [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-light text-[var(--admin-text-primary)]">Order Management</h1>
        <p className="text-sm text-[var(--admin-grey)] mt-1">
          Manage customer orders placed via WhatsApp
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[var(--admin-border-light)] rounded-lg p-4 space-y-4">
        {/* Status tabs */}
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveStatus(tab.value)}
              className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                activeStatus === tab.value
                  ? "bg-[var(--admin-primary)] text-white"
                  : "bg-[var(--admin-bg)] text-[var(--admin-grey)] hover:bg-[var(--admin-border-light)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-grey)]" />
            <input
              type="text"
              placeholder="Search by customer name or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-[var(--admin-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-[var(--admin-primary)] text-white rounded-lg hover:opacity-90"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(""); setSearchInput(""); }}
              className="px-4 py-2 text-sm border border-[var(--admin-border-light)] rounded-lg text-[var(--admin-grey)] hover:bg-[var(--admin-bg)]"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="bg-white border border-[var(--admin-border-light)] rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-[var(--admin-grey)] text-sm">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-[var(--admin-grey)] text-sm">No orders found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--admin-border-light)] bg-[var(--admin-bg)]">
                <th className="text-left px-4 py-3 font-medium text-[var(--admin-text-secondary)]">Order #</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--admin-text-secondary)]">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--admin-text-secondary)]">Items</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--admin-text-secondary)]">Total</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--admin-text-secondary)]">Source</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--admin-text-secondary)]">Status</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--admin-text-secondary)]">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border-light)]">
              {orders.map((order: OrderListItem) => {
                const badge = STATUS_BADGES[order.status as OrderStatus];
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-[var(--admin-bg)] cursor-pointer transition-colors"
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-[var(--admin-text-primary)]">
                      #{shortId(order.id)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-light text-[var(--admin-text-primary)]">
                        {order.customer_name ?? "Guest"}
                      </p>
                      {order.customer_email && (
                        <p className="text-xs text-[var(--admin-grey)]">{order.customer_email}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[var(--admin-text-secondary)]">
                      <p className="truncate max-w-[180px]">{order.first_item_title ?? "—"}</p>
                      {order.item_count > 1 && (
                        <p className="text-xs text-[var(--admin-grey)]">+{order.item_count - 1} more</p>
                      )}
                    </td>
                    <td className="px-4 py-3 font-light text-[var(--admin-text-primary)]">
                      {formatPrice(order.total_cents)}
                    </td>
                    <td className="px-4 py-3">
                      {order.source && (
                        <span className="px-2 py-0.5 text-xs bg-[#e8f5e9] text-[#2e7d32] rounded-full capitalize">
                          {order.source}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {badge && (
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${badge.className}`}>
                          {badge.label}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[var(--admin-grey)] text-xs">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/orders/${order.id}`);
                        }}
                        className="p-1.5 rounded hover:bg-[var(--admin-border-light)] text-[var(--admin-grey)] hover:text-[var(--admin-text-primary)] transition-colors"
                        aria-label="View order"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {data && (
        <p className="text-xs text-[var(--admin-grey)]">
          Showing {orders.length} of {data.total} orders
        </p>
      )}
    </div>
  );
}
