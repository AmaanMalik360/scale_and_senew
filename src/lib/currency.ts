/**
 * Shared currency formatting utility.
 *
 * All monetary amounts in this codebase are stored in **minor units**:
 *   - PKR  → paisa  (1 PKR = 100 paisa)
 *   - USD  → cents  (1 USD = 100 cents)   [not yet active]
 *   - EUR  → cents  (1 EUR = 100 cents)   [not yet active]
 *
 * formatPrice converts a minor-unit integer to a locale-formatted string
 * using the browser's Intl.NumberFormat for correct symbol and grouping.
 *
 * NOTE (future — multi-currency):
 *   When the backend returns currency_code on Order / Product responses,
 *   pass it as the second argument here. No other changes are needed:
 *
 *     formatPrice(order.total_amount, order.currency_code)
 *
 * NOTE (future — zero-decimal currencies like JPY):
 *   For currencies with 0 decimal places, amount IS already in major units.
 *   When implementing, fetch Currency.decimal_places from the API and use
 *   Math.pow(10, decimalPlaces) as the divisor instead of the hard-coded 100.
 */

const MINOR_UNIT_DIVISOR = 100; // paisa-per-PKR; adjust for other currencies if needed

export const formatPrice = (amount: number, currencyCode = "PKR"): string => {
  const majorAmount = amount / MINOR_UNIT_DIVISOR;
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(majorAmount);
};
