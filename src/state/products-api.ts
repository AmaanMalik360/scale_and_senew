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

export interface ProductsQueryParams {
  skip?: number;
  limit?: number;
  category_id?: number;
  category_slug?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  search?: string;
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<Product[], ProductsQueryParams>({
      query: (params) => ({
        url: "products",
        params: params,
      }),
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
