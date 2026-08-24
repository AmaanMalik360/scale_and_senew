import { baseApi } from "./base-api";
import { ApiResponse } from "./types";
import { Address } from "./addresses-api";

export interface OrderItem {
  product_id: string;
  title: string;
  // unit_amount is a price snapshot in minor units at time of order creation.
  // NOTE (future — multi-currency): Use the parent Order's currency_code to format
  // via formatPrice(unit_amount, order.currency_code).
  unit_amount: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  user_id: string;
  // total_amount is in minor units of currency_code (paisa for PKR).
  total_amount: number;
  // NOTE (future — multi-currency): Pass currency_code to formatPrice() so the UI
  // formats correctly for each currency without any code changes.
  currency_code: string;
  status: OrderStatus;
  source?: string;
  notes?: string;
  shipping_address?: Address;
  billing_address?: Address;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderListItem {
  id: string;
  user_id: string;
  total_amount: number;
  currency_code: string;
  status: OrderStatus;
  source?: string;
  customer_name?: string;
  customer_email?: string;
  item_count: number;
  first_item_title?: string;
  created_at: string;
}

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface PaginatedOrdersResponse {
  data: OrderListItem[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreateOrderRequest {
  items: { product_id: string; quantity: number }[];
  source?: string;
  shipping_address_id?: string;
  billing_address_id?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface ReplaceOrderItemsRequest {
  items: { product_id: string; quantity: number }[];
}

export interface UpdateOrderMetaRequest {
  shipping_address_id?: string;
  billing_address_id?: string;
  notes?: string;
}

export interface UpsertShipmentRequest {
  carrier?: string;
  tracking_number?: string;
  shipped_at?: string;
}

export interface GetAdminOrdersParams {
  status?: OrderStatus;
  search?: string;
  skip?: number;
  limit?: number;
}

interface OrderResponse extends ApiResponse<Order> {}
interface PaginatedOrdersResponseWrapper extends ApiResponse<PaginatedOrdersResponse> {}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createOrder: build.mutation<Order, CreateOrderRequest>({
      query: (body) => ({
        url: "orders",
        method: "POST",
        body,
      }),
      transformResponse: (response: OrderResponse) => response.data,
      invalidatesTags: ["Orders"],
    }),

    getMyOrders: build.query<PaginatedOrdersResponse, void>({
      query: () => "orders/mine",
      transformResponse: (response: PaginatedOrdersResponseWrapper) => response.data,
      providesTags: ["Orders"],
    }),

    getMyOrder: build.query<Order, string>({
      query: (orderId) => `orders/mine/${orderId}`,
      transformResponse: (response: OrderResponse) => response.data,
      providesTags: (result, error, orderId) => [{ type: "Orders", id: orderId }],
    }),

    adminGetOrders: build.query<PaginatedOrdersResponse, GetAdminOrdersParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.status) searchParams.set("status", params.status);
        if (params.search) searchParams.set("search", params.search);
        if (params.skip != null) searchParams.set("skip", String(params.skip));
        if (params.limit != null) searchParams.set("limit", String(params.limit));
        return `orders?${searchParams.toString()}`;
      },
      transformResponse: (response: PaginatedOrdersResponseWrapper) => response.data,
      providesTags: ["Orders"],
    }),

    adminGetOrder: build.query<Order, string>({
      query: (orderId) => `orders/${orderId}`,
      transformResponse: (response: OrderResponse) => response.data,
      providesTags: (result, error, orderId) => [{ type: "Orders", id: orderId }],
    }),

    adminUpdateOrderStatus: build.mutation<Order, { orderId: string; status: OrderStatus }>({
      query: ({ orderId, status }) => ({
        url: `orders/${orderId}/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: (response: OrderResponse) => response.data,
      invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }, "Orders"],
    }),

    adminReplaceOrderItems: build.mutation<Order, { orderId: string; items: { product_id: string; quantity: number }[] }>({
      query: ({ orderId, items }) => ({
        url: `orders/${orderId}/items`,
        method: "PUT",
        body: { items },
      }),
      transformResponse: (response: OrderResponse) => response.data,
      invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }],
    }),

    adminUpdateOrderMeta: build.mutation<Order, { orderId: string } & UpdateOrderMetaRequest>({
      query: ({ orderId, ...body }) => ({
        url: `orders/${orderId}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: OrderResponse) => response.data,
      invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }],
    }),

    adminUpsertShipment: build.mutation<Order, { orderId: string } & UpsertShipmentRequest>({
      query: ({ orderId, ...body }) => ({
        url: `orders/${orderId}/shipment`,
        method: "POST",
        body,
      }),
      transformResponse: (response: OrderResponse) => response.data,
      invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }],
    }),

    adminDeleteOrder: build.mutation<void, string>({
      query: (orderId) => ({
        url: `orders/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetMyOrderQuery,
  useAdminGetOrdersQuery,
  useAdminGetOrderQuery,
  useAdminUpdateOrderStatusMutation,
  useAdminReplaceOrderItemsMutation,
  useAdminUpdateOrderMetaMutation,
  useAdminUpsertShipmentMutation,
  useAdminDeleteOrderMutation,
} = ordersApi;
