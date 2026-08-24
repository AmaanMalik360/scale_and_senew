import { formatPrice } from "./currency";

export interface WhatsAppItem {
  title: string;
  quantity: number;
  // price_amount is in minor units (paisa for PKR).
  price_amount: number;
}

export const buildWhatsAppUrl = (items: WhatsAppItem[], phone: string): string => {
  const total = items.reduce((sum, item) => sum + item.price_amount * item.quantity, 0);

  const lines = items.map(
    (item, i) =>
      `${i + 1}. *${item.title}* x${item.quantity} — ${formatPrice(item.price_amount * item.quantity)}`
  );

  const message = [
    "Hi! I'd like to order the following items:",
    "",
    ...lines,
    "",
    `*Total: ${formatPrice(total)}*`,
    "",
    "Please confirm availability and payment details. Thank you!",
  ].join("\n");

  const cleanPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
