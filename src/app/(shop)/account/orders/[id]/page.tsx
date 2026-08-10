"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, MapPin, Truck } from "lucide-react";
import { useGetMyOrderQuery, OrderStatus } from "@/state/orders-api";
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
  new Date(iso).toLocaleString("en-IE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const shortId = (id: string) => id.slice(0, 8).toUpperCase();

export default function MyOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isGuest } = useAppSelector((state) => state.auth);

  const { data: order, isLoading } = useGetMyOrderQuery(id, {
    skip: !isAuthenticated || isGuest,
  });

  if (!isAuthenticated || isGuest) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground text-sm mb-4">Please sign in to view this order.</p>
        <Link href="/signin" className="text-sm underline text-foreground">
          Sign In
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-muted/20 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground text-sm">Order not found.</p>
        <Link href="/account/orders" className="block mt-4 text-sm underline text-foreground">
          Back to Orders
        </Link>
      </div>
    );
  }

  const badge = STATUS_BADGES[order.status as OrderStatus];
  const total = order.items.reduce((sum, item) => sum + item.price_cents * item.quantity, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/account/orders"
          className="p-2 -ml-2 rounded hover:bg-muted/20 text-muted-foreground transition-colors"
          aria-label="Back to orders"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-light text-foreground">Order #{shortId(order.id)}</h1>
          <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
        </div>
        {badge && (
          <span className={`px-3 py-1 text-xs rounded-full font-medium ${badge.className}`}>
            {badge.label}
          </span>
        )}
      </div>

      {/* Items */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border bg-muted/5">
          <Package size={15} className="text-muted-foreground" />
          <h2 className="text-sm font-medium text-foreground">Items</h2>
        </div>
        <div className="divide-y divide-border">
          {order.items.map((item) => (
            <div key={item.product_id} className="flex items-center gap-4 px-5 py-4">
              <div className="w-16 h-16 rounded border border-border overflow-hidden shrink-0 bg-muted/10">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[10px] text-muted-foreground">IMG</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-light text-foreground truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  Qty: {item.quantity} × {formatPrice(item.price_cents)}
                </p>
              </div>
              <p className="text-sm font-light text-foreground shrink-0">
                {formatPrice(item.price_cents * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-muted/5">
          <span className="text-sm font-light text-muted-foreground">Total</span>
          <span className="text-sm font-medium text-foreground">{formatPrice(order.total_cents)}</span>
        </div>
      </div>

      {/* Shipping Address */}
      {order.shipping_address && (
        <div className="border border-border rounded-lg p-5 space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={15} className="text-muted-foreground" />
            <h2 className="text-sm font-medium text-foreground">Shipping Address</h2>
          </div>
          <div className="text-sm font-light text-muted-foreground space-y-0.5">
            <p>{order.shipping_address.line1}</p>
            {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
            <p>
              {order.shipping_address.city}
              {order.shipping_address.state ? `, ${order.shipping_address.state}` : ""}
            </p>
            {order.shipping_address.postal_code && <p>{order.shipping_address.postal_code}</p>}
            <p className="font-medium text-foreground">{order.shipping_address.country}</p>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>Order ID: <span className="font-mono">{order.id}</span></p>
        <p>Last updated: {formatDate(order.updated_at)}</p>
      </div>
    </div>
  );
}
