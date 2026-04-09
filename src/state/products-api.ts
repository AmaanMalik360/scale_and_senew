import { baseApi } from "./base-api";

export interface Product {
  id: string;
  title: string;
  description?: string;
  category_id?: number;
  price: number;
  stock_quantity: number;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductWithCategory extends Product {
  category?: {
    id: number;
    name: string;
    description?: string;
  };
}

export interface ProductCreate {
  title: string;
  description?: string;
  category_id?: number;
  price: number;
  stock_quantity: number;
  images?: string[];
}

export interface ProductUpdate {
  title?: string;
  description?: string;
  category_id?: number;
  price?: number;
  stock_quantity?: number;
  images?: string[];
}

export interface GetProductsParams {
  category_slug?: string;
  category_ids?: number[];
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  search?: string;
  skip?: number;
  limit?: number;
  sort_by?: string;
  attribute_value_ids?: number[];
}

export interface PaginatedProductsResponse {
  data: ProductWithCategory[];
  total: number;
  skip: number;
  limit: number;
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<PaginatedProductsResponse, GetProductsParams>({
      query: (params: GetProductsParams) => {
        const searchParams = new URLSearchParams();
        if (params.category_slug) searchParams.set("category_slug", params.category_slug);
        if (params.category_ids?.length) {
          params.category_ids.forEach((id: number) => searchParams.append("category_ids", String(id)));
        }
        if (params.min_price != null) searchParams.set("min_price", String(params.min_price));
        if (params.max_price != null) searchParams.set("max_price", String(params.max_price));
        if (params.search) searchParams.set("search", params.search);
        if (params.skip != null) searchParams.set("skip", String(params.skip));
        if (params.limit != null) searchParams.set("limit", String(params.limit));
        if (params.in_stock != null) searchParams.set("in_stock", String(params.in_stock));
        if (params.sort_by) searchParams.set("sort_by", params.sort_by);
        if (params.attribute_value_ids?.length) {
          params.attribute_value_ids.forEach((id: number) => searchParams.append("attribute_value_ids", String(id)));
        }
        return `/products?${searchParams.toString()}`;
      },
      providesTags: ["Products"],
    }),
    getProduct: build.query<ProductWithCategory, string>({
      query: (productId) => `products/${productId}`,
      providesTags: (result, error, productId) => [
        { type: "Products", id: productId },
      ],
    }),
    createProduct: build.mutation<Product, ProductCreate>({
      query: (product) => ({
        url: "products",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: build.mutation<Product, { productId: string; product: ProductUpdate }>({
      query: ({ productId, product }) => ({
        url: `products/${productId}`,
        method: "PUT",
        body: product,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Products", id: productId },
        "Products",
      ],
    }),
    deleteProduct: build.mutation<void, string>({
      query: (productId) => ({
        url: `products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, productId) => [
        { type: "Products", id: productId },
        "Products",
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
