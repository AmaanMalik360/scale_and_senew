"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { hydrateCart, setCart, CartItem } from "@/state/cart-slice";
import { useGetCartQuery, useSyncCartMutation } from "@/state/cart-api";

export const useCartSync = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const reduxItems = useAppSelector((state) => state.cart.items);

  const hasHydrated = useRef(false);
  const reduxItemsRef = useRef<CartItem[]>(reduxItems);

  useEffect(() => {
    reduxItemsRef.current = reduxItems;
  }, [reduxItems]);

  const { data: backendCart } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [syncCart] = useSyncCartMutation();

  useEffect(() => {
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key !== "persist:root" || !event.newValue) return;
      try {
        const persistedRoot = JSON.parse(event.newValue);
        if (!persistedRoot.cart) return;
        const cartState: { items?: CartItem[] } = JSON.parse(persistedRoot.cart);
        if (!Array.isArray(cartState.items)) return;
        if (JSON.stringify(cartState.items) === JSON.stringify(reduxItemsRef.current)) return;
        dispatch(setCart(cartState.items));
      } catch {
        // Ignore malformed persist data
      }
    };

    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated || !backendCart || hasHydrated.current) return;

    hasHydrated.current = true;

    const snapshot = reduxItemsRef.current;

    dispatch(
      hydrateCart(
        backendCart.items.map((item) => ({
          productId: item.productId,
          title: item.title,
          price: item.price,
          image: item.image,
          categoryName: item.categoryName ?? undefined,
          quantity: item.quantity,
        }))
      )
    );

    const backendIds = new Set(backendCart.items.map((i) => i.productId));
    const unsyncedItems = snapshot.filter((i) => !backendIds.has(i.productId));

    if (unsyncedItems.length > 0) {
      syncCart({
        items: unsyncedItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      }).catch(() => {});
    }
  }, [isAuthenticated, backendCart, dispatch, syncCart]);
};
