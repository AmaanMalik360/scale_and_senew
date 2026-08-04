import { baseApi } from "./base-api";
import { ApiResponse } from "./types";
import { getImageUrl } from "@/lib/utils";

export interface CartItemResponse {
  productId: string;
  title: string;
  price: number;
  image: string;
  categoryName?: string | null;
  quantity: number;
}

export interface CartResponse {
  cartId: string;
  userId: string;
  items: CartItemResponse[];
}

export interface AddItemRequest {
  productId: string;
  quantity: number;
}

export interface UpdateItemRequest {
  quantity: number;
}

export interface SyncCartRequest {
  items: AddItemRequest[];
}

interface RawCartItem {
  product_id: string;
  title: string;
  price: number;
  image: string;
  category_name?: string | null;
  quantity: number;
}

interface RawCartResponse {
  cart_id: string;
  user_id: string;
  items: RawCartItem[];
}

const transformCart = (raw: RawCartResponse): CartResponse => ({
  cartId: raw.cart_id,
  userId: raw.user_id,
  items: raw.items.map((item) => ({
    productId: item.product_id,
    title: item.title,
    price: item.price,
    image: item.image ? getImageUrl(item.image) : "",
    categoryName: item.category_name,
    quantity: item.quantity,
  })),
});

export const cartApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCart: build.query<CartResponse, void>({
      query: () => "cart",
      transformResponse: (response: ApiResponse<RawCartResponse>) =>
        transformCart(response.data),
      providesTags: ["Cart"],
    }),
    addCartItem: build.mutation<CartResponse, AddItemRequest>({
      query: (body) => ({
        url: "cart/items",
        method: "POST",
        body: { product_id: body.productId, quantity: body.quantity },
      }),
      transformResponse: (response: ApiResponse<RawCartResponse>) =>
        transformCart(response.data),
    }),
    updateCartItem: build.mutation<
      CartResponse,
      { productId: string; quantity: number }
    >({
      query: ({ productId, quantity }) => ({
        url: `cart/items/${productId}`,
        method: "PATCH",
        body: { quantity },
      }),
      transformResponse: (response: ApiResponse<RawCartResponse>) =>
        transformCart(response.data),
    }),
    removeCartItem: build.mutation<CartResponse, string>({
      query: (productId) => ({
        url: `cart/items/${productId}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<RawCartResponse>) =>
        transformCart(response.data),
    }),
    clearCart: build.mutation<CartResponse, void>({
      query: () => ({
        url: "cart",
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<RawCartResponse>) =>
        transformCart(response.data),
    }),
    syncCart: build.mutation<CartResponse, SyncCartRequest>({
      query: (body) => ({
        url: "cart/sync",
        method: "POST",
        body: {
          items: body.items.map((i) => ({
            product_id: i.productId,
            quantity: i.quantity,
          })),
        },
      }),
      transformResponse: (response: ApiResponse<RawCartResponse>) =>
        transformCart(response.data),
    }),
    replaceCart: build.mutation<CartResponse, SyncCartRequest>({
      query: (body) => ({
        url: "cart/replace",
        method: "POST",
        body: {
          items: body.items.map((i) => ({
            product_id: i.productId,
            quantity: i.quantity,
          })),
        },
      }),
      transformResponse: (response: ApiResponse<RawCartResponse>) =>
        transformCart(response.data),
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  useSyncCartMutation,
  useReplaceCartMutation,
} = cartApi;
