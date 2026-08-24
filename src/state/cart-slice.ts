import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  productId: string;
  title: string;
  // price_amount is in minor units of the default currency (paisa for PKR).
  // NOTE (future — multi-currency): Add currency_code: string here when the
  // cart API returns it, and pass it to formatPrice() in the UI.
  price_amount: number;
  image: string;
  categoryName?: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (i) => i.productId === action.payload.productId
      );
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            (i) => i.productId !== action.payload.productId
          );
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    hydrateCart: (state, action: PayloadAction<CartItem[]>) => {
      action.payload.forEach((backendItem) => {
        const existing = state.items.find(
          (i) => i.productId === backendItem.productId
        );
        if (existing) {
          existing.quantity = Math.max(existing.quantity, backendItem.quantity);
        } else {
          state.items.push(backendItem);
        }
      });
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  setCart,
  hydrateCart,
} = cartSlice.actions;
export default cartSlice.reducer;
