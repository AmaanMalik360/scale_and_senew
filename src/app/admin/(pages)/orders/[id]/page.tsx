"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Package, MapPin, Truck, StickyNote, Search } from "lucide-react";
import Image from "next/image";
import {
  useAdminGetOrderQuery,
  useAdminUpdateOrderStatusMutation,
  useAdminReplaceOrderItemsMutation,
  useAdminUpdateOrderMetaMutation,
  useAdminUpsertShipmentMutation,
  useAdminDeleteOrderMutation,
  OrderStatus,
  OrderItem,
} from "@/state/orders-api";
import { useCreateAddressMutation } from "@/state/addresses-api";
import { useGetProductsQuery } from "@/state/products-api";
import { getImageUrl } from "@/lib/utils";
import { formatPrice } from "@/lib/currency";

const STATUS_OPTIONS: { label: string; value: OrderStatus }[] = [
  { label: "Pending Payment", value: "pending_payment" },
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

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-IE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const shortId = (id: string) => id.slice(0, 8).toUpperCase();

interface EditableItemRow {
  product_id: string;
  title: string;
  unit_amount: number;
  quantity: number;
  image?: string;
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: order, isLoading, refetch } = useAdminGetOrderQuery(id);

  const [updateStatus] = useAdminUpdateOrderStatusMutation();
  const [replaceItems] = useAdminReplaceOrderItemsMutation();
  const [updateMeta] = useAdminUpdateOrderMetaMutation();
  const [upsertShipment] = useAdminUpsertShipmentMutation();
  const [deleteOrder] = useAdminDeleteOrderMutation();
  const [createAddress] = useCreateAddressMutation();

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("pending_payment");
  const [isSavingStatus, setIsSavingStatus] = useState(false);

  const [editItems, setEditItems] = useState<EditableItemRow[]>([]);
  const [isSavingItems, setIsSavingItems] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [showProductSearch, setShowProductSearch] = useState(false);

  const [notes, setNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    line1: "", line2: "", city: "", state: "", postal_code: "", country: "", label: "",
  });
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const [shipmentForm, setShipmentForm] = useState({
    carrier: "", tracking_number: "", shipped_at: "",
  });
  const [isSavingShipment, setIsSavingShipment] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const { data: productsData } = useGetProductsQuery(
    { search: productSearch, limit: 10 },
    { skip: !showProductSearch || productSearch.length < 2 }
  );

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status as OrderStatus);
      setNotes(order.notes ?? "");
      setEditItems(
        order.items.map((item) => ({
          product_id: item.product_id,
          title: item.title,
          unit_amount: item.unit_amount,
          quantity: item.quantity,
          image: item.image,
        }))
      );
    }
  }, [order]);

  const handleSaveStatus = async () => {
    setIsSavingStatus(true);
    try {
      await updateStatus({ orderId: id, status: selectedStatus }).unwrap();
    } finally {
      setIsSavingStatus(false);
    }
  };

  const handleItemQuantityChange = (productId: string, quantity: number) => {
    setEditItems((prev) =>
      prev.map((item) => (item.product_id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setEditItems((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const handleAddProduct = (product: { id: string; title: string; price_amount: number; images?: string[] }) => {
    const existing = editItems.find((i) => i.product_id === product.id);
    if (existing) {
      setEditItems((prev) =>
        prev.map((i) => (i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
      );
    } else {
      setEditItems((prev) => [
        ...prev,
        {
          product_id: product.id,
          title: product.title,
          unit_amount: product.price_amount,
          quantity: 1,
          image: product.images?.[0] ? getImageUrl(product.images[0]) : undefined,
        },
      ]);
    }
    setShowProductSearch(false);
    setProductSearch("");
  };

  const handleSaveItems = async () => {
    if (editItems.length === 0) return;
    setIsSavingItems(true);
    try {
      await replaceItems({
        orderId: id,
        items: editItems.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
      }).unwrap();
    } finally {
      setIsSavingItems(false);
    }
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      await updateMeta({ orderId: id, notes }).unwrap();
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!addressForm.line1 || !addressForm.city || !addressForm.country) return;
    setIsSavingAddress(true);
    try {
      const address = await createAddress({
        line1: addressForm.line1,
        line2: addressForm.line2 || undefined,
        city: addressForm.city,
        state: addressForm.state || undefined,
        postal_code: addressForm.postal_code || undefined,
        country: addressForm.country,
        label: addressForm.label || undefined,
      }).unwrap();
      await updateMeta({ orderId: id, shipping_address_id: address.id }).unwrap();
      setShowAddressForm(false);
      setAddressForm({ line1: "", line2: "", city: "", state: "", postal_code: "", country: "", label: "" });
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleSaveShipment = async () => {
    setIsSavingShipment(true);
    try {
      await upsertShipment({
        orderId: id,
        carrier: shipmentForm.carrier || undefined,
        tracking_number: shipmentForm.tracking_number || undefined,
        shipped_at: shipmentForm.shipped_at || undefined,
      }).unwrap();
    } finally {
      setIsSavingShipment(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this order?")) return;
    setIsDeleting(true);
    try {
      await deleteOrder(id).unwrap();
      router.push("/admin/orders");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-[var(--admin-grey)] text-sm">Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <p className="text-[var(--admin-grey)] text-sm">Order not found.</p>
      </div>
    );
  }

  const currentTotal = editItems.reduce((sum, item) => sum + item.unit_amount * item.quantity, 0);
  const badge = STATUS_BADGES[order.status as OrderStatus];
  const showShipped = ["shipped", "delivered"].includes(order.status);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/orders")}
            className="p-2 rounded hover:bg-[var(--admin-bg)] text-[var(--admin-grey)] transition-colors"
            aria-label="Back to orders"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-light text-[var(--admin-text-primary)]">
              Order #{shortId(order.id)}
            </h1>
            <p className="text-xs text-[var(--admin-grey)]">{formatDate(order.created_at)}</p>
          </div>
          {badge && (
            <span className={`px-3 py-1 text-xs rounded-full font-medium ${badge.className}`}>
              {badge.label}
            </span>
          )}
        </div>
        <button
          onClick={handleDeleteOrder}
          disabled={isDeleting}
          className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete Order"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN — Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[var(--admin-border-light)] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <Package size={16} className="text-[var(--admin-grey)]" />
              <h2 className="text-sm font-medium text-[var(--admin-text-primary)]">Order Items</h2>
            </div>

            <div className="space-y-3">
              {editItems.map((item) => (
                <div key={item.product_id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded border border-[var(--admin-border-light)] overflow-hidden shrink-0 bg-[var(--admin-bg)]">
                    {item.image ? (
                      <Image src={item.image} alt={item.title} width={48} height={48} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[8px] text-[var(--admin-grey)]">IMG</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-light text-[var(--admin-text-primary)] truncate">{item.title}</p>
                    <p className="text-xs text-[var(--admin-grey)]">{formatPrice(item.unit_amount)} each</p>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => handleItemQuantityChange(item.product_id, Number(e.target.value))}
                    className="w-16 px-2 py-1 text-sm text-center border border-[var(--admin-border-light)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]"
                  />
                  <p className="text-sm font-light text-[var(--admin-text-primary)] w-20 text-right">
                    {formatPrice(item.unit_amount * item.quantity)}
                  </p>
                  <button
                    onClick={() => handleRemoveItem(item.product_id)}
                    className="text-[var(--admin-grey)] hover:text-red-500 transition-colors text-lg leading-none"
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </div>
              ))}

              {editItems.length === 0 && (
                <p className="text-sm text-[var(--admin-grey)] py-2">No items. Add a product below.</p>
              )}
            </div>

            {/* Add product search */}
            <div className="mt-4 pt-4 border-t border-[var(--admin-border-light)]">
              {showProductSearch ? (
                <div className="space-y-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-grey)]" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      autoFocus
                      className="w-full pl-8 pr-4 py-2 text-sm border border-[var(--admin-border-light)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]"
                    />
                  </div>
                  {productsData?.data && productsData.data.length > 0 && (
                    <div className="border border-[var(--admin-border-light)] rounded divide-y divide-[var(--admin-border-light)] max-h-48 overflow-y-auto">
                      {productsData.data.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handleAddProduct(p)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--admin-bg)] flex justify-between items-center"
                        >
                          <span className="text-[var(--admin-text-primary)] truncate">{p.title}</span>
                          <span className="text-[var(--admin-grey)] ml-2 shrink-0">{formatPrice(p.price_amount)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => { setShowProductSearch(false); setProductSearch(""); }}
                    className="text-xs text-[var(--admin-grey)] hover:text-[var(--admin-text-primary)]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowProductSearch(true)}
                  className="text-sm text-[var(--admin-primary)] hover:opacity-80 transition-opacity"
                >
                  + Add product
                </button>
              )}
            </div>

            {/* Total + Save */}
            <div className="mt-4 pt-4 border-t border-[var(--admin-border-light)] flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--admin-grey)]">New total</p>
                <p className="text-lg font-light text-[var(--admin-text-primary)]">{formatPrice(currentTotal)}</p>
              </div>
              <button
                onClick={handleSaveItems}
                disabled={isSavingItems || editItems.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--admin-primary)] text-white text-sm rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                <Save size={14} />
                {isSavingItems ? "Saving..." : "Save Items"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="bg-white border border-[var(--admin-border-light)] rounded-lg p-5">
            <h2 className="text-sm font-medium text-[var(--admin-text-primary)] mb-3">Customer</h2>
            <p className="text-sm text-[var(--admin-text-secondary)]">{order.user_id}</p>
          </div>

          {/* Status */}
          <div className="bg-white border border-[var(--admin-border-light)] rounded-lg p-5 space-y-3">
            <h2 className="text-sm font-medium text-[var(--admin-text-primary)]">Status</h2>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
              className="w-full px-3 py-2 text-sm border border-[var(--admin-border-light)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-[var(--admin-grey)]">
              Setting to <strong>Paid</strong> makes this order visible to the customer.
            </p>
            <button
              onClick={handleSaveStatus}
              disabled={isSavingStatus}
              className="w-full py-2 bg-[var(--admin-primary)] text-white text-sm rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isSavingStatus ? "Updating..." : "Update Status"}
            </button>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-[var(--admin-border-light)] rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-[var(--admin-grey)]" />
              <h2 className="text-sm font-medium text-[var(--admin-text-primary)]">Shipping Address</h2>
            </div>
            {order.shipping_address ? (
              <div className="text-sm text-[var(--admin-text-secondary)] space-y-0.5">
                <p>{order.shipping_address.line1}</p>
                {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                <p>{order.shipping_address.city}{order.shipping_address.state ? `, ${order.shipping_address.state}` : ""}</p>
                {order.shipping_address.postal_code && <p>{order.shipping_address.postal_code}</p>}
                <p className="font-medium">{order.shipping_address.country}</p>
              </div>
            ) : (
              <p className="text-sm text-[var(--admin-grey)]">No address set yet.</p>
            )}

            {showAddressForm ? (
              <div className="space-y-2 pt-2 border-t border-[var(--admin-border-light)]">
                {(["line1", "line2", "city", "state", "postal_code", "country", "label"] as const).map((field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field === "country" ? "Country (2-letter code)" : field.replace("_", " ")}
                    value={addressForm[field]}
                    onChange={(e) => setAddressForm((prev) => ({ ...prev, [field]: e.target.value }))}
                    className="w-full px-3 py-1.5 text-sm border border-[var(--admin-border-light)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]"
                  />
                ))}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleSaveAddress}
                    disabled={isSavingAddress || !addressForm.line1 || !addressForm.city || !addressForm.country}
                    className="flex-1 py-1.5 bg-[var(--admin-primary)] text-white text-sm rounded hover:opacity-90 disabled:opacity-50"
                  >
                    {isSavingAddress ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setShowAddressForm(false)}
                    className="px-3 py-1.5 text-sm border border-[var(--admin-border-light)] rounded text-[var(--admin-grey)] hover:bg-[var(--admin-bg)]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddressForm(true)}
                className="text-sm text-[var(--admin-primary)] hover:opacity-80"
              >
                {order.shipping_address ? "Change address" : "Set address"}
              </button>
            )}
          </div>

          {/* Shipment (shown only when shipped/delivered) */}
          {showShipped && (
            <div className="bg-white border border-[var(--admin-border-light)] rounded-lg p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-[var(--admin-grey)]" />
                <h2 className="text-sm font-medium text-[var(--admin-text-primary)]">Shipment</h2>
              </div>
              <input
                type="text"
                placeholder="Carrier (e.g. DHL, FedEx)"
                value={shipmentForm.carrier}
                onChange={(e) => setShipmentForm((prev) => ({ ...prev, carrier: e.target.value }))}
                className="w-full px-3 py-1.5 text-sm border border-[var(--admin-border-light)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]"
              />
              <input
                type="text"
                placeholder="Tracking number"
                value={shipmentForm.tracking_number}
                onChange={(e) => setShipmentForm((prev) => ({ ...prev, tracking_number: e.target.value }))}
                className="w-full px-3 py-1.5 text-sm border border-[var(--admin-border-light)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]"
              />
              <input
                type="datetime-local"
                value={shipmentForm.shipped_at}
                onChange={(e) => setShipmentForm((prev) => ({ ...prev, shipped_at: e.target.value }))}
                className="w-full px-3 py-1.5 text-sm border border-[var(--admin-border-light)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]"
              />
              <button
                onClick={handleSaveShipment}
                disabled={isSavingShipment}
                className="w-full py-2 bg-[var(--admin-primary)] text-white text-sm rounded hover:opacity-90 disabled:opacity-50"
              >
                {isSavingShipment ? "Saving..." : "Save Shipment"}
              </button>
            </div>
          )}

          {/* Admin Notes */}
          <div className="bg-white border border-[var(--admin-border-light)] rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2">
              <StickyNote size={14} className="text-[var(--admin-grey)]" />
              <h2 className="text-sm font-medium text-[var(--admin-text-primary)]">Admin Notes</h2>
            </div>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Internal notes about this order..."
              className="w-full px-3 py-2 text-sm border border-[var(--admin-border-light)] rounded resize-none focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]"
            />
            <button
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
              className="w-full py-2 bg-[var(--admin-primary)] text-white text-sm rounded hover:opacity-90 disabled:opacity-50"
            >
              {isSavingNotes ? "Saving..." : "Save Notes"}
            </button>
          </div>

          {/* Order metadata */}
          <div className="bg-white border border-[var(--admin-border-light)] rounded-lg p-5 space-y-2 text-xs text-[var(--admin-grey)]">
            <p><span className="font-medium text-[var(--admin-text-secondary)]">Order ID:</span> {order.id}</p>
            <p><span className="font-medium text-[var(--admin-text-secondary)]">Source:</span> {order.source ?? "—"}</p>
            <p><span className="font-medium text-[var(--admin-text-secondary)]">Created:</span> {formatDate(order.created_at)}</p>
            <p><span className="font-medium text-[var(--admin-text-secondary)]">Updated:</span> {formatDate(order.updated_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
