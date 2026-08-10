"use client";

import Link from "next/link";
import Image from "next/image";
import { useGetMyOrdersQuery, OrderStatus, OrderListItem } from "@/state/orders-api";
import { useAppSelector } from "@/app/redux";

const STATUS_BADGES: Record<OrderStatus, { label: string; className: string }> = {
  pending_payment: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
  paid: { label: "Paid", className: "bg-green-100 text-green-700" },
  processing: { label: "Processing", className: "bg-blue-100 text-blue-700" },
  shipped: { label: "Shipped", className: "bg-purple-100 text-purple-700" },
  delivered: { label: "Delivered", className: "bg-emerald-100 text-emerald-700" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

const formatPrice = (cents: number) =>
  `€${(cents / 100).toLocaleString("en-IE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IE", { day: "2-digit", month: "long", year: "numeric" });

const shortId = (id: string) => id.slice(0, 8).toUpperCase();

export default function MyOrdersPage() {
  const { isAuthenticated, isGuest } = useAppSelector((state) => state.auth);
  const { data, isLoading } = useGetMyOrdersQuery(undefined, {
    skip: !isAuthenticated || isGuest,
  });

  const orders = data?.data ?? [];

  if (!isAuthenticated || isGuest) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-light text-foreground mb-4">My Orders</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Please sign in to view your orders.
        </p>
        <Link
          href="/signin?redirect=/account/orders"
          className="inline-block px-6 py-2 bg-foreground text-background text-sm hover:bg-foreground/90 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-2xl font-light text-foreground">My Orders</h1>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-muted/20 rounded animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground text-sm">You have no orders yet.</p>
          <Link
            href="/category/shop"
            className="inline-block mt-4 px-6 py-2 border border-border text-sm text-foreground hover:bg-muted/20 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: OrderListItem) => {
            const badge = STATUS_BADGES[order.status as OrderStatus];
            return (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block border border-border rounded-lg p-5 hover:bg-muted/10 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-mono">#{shortId(order.id)}</p>
                    <p className="text-sm font-light text-foreground">
                      {order.first_item_title ?? "Order"}
                      {order.item_count > 1 && (
                        <span className="text-muted-foreground ml-1">+{order.item_count - 1} more</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="text-right shrink-0 space-y-2">
                    <p className="text-sm font-light text-foreground">{formatPrice(order.total_cents)}</p>
                    {badge && (
                      <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${badge.className}`}>
                        {badge.label}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
