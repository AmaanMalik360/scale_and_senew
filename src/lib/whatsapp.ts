export interface WhatsAppItem {
  title: string;
  quantity: number;
  price_cents: number;
}

const formatPrice = (cents: number): string =>
  `€${(cents / 100).toLocaleString("en-IE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const buildWhatsAppUrl = (items: WhatsAppItem[], phone: string): string => {
  const total = items.reduce((sum, item) => sum + item.price_cents * item.quantity, 0);

  const lines = items.map(
    (item, i) =>
      `${i + 1}. *${item.title}* x${item.quantity} — ${formatPrice(item.price_cents * item.quantity)}`
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
