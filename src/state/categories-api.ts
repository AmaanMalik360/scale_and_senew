import { baseApi } from "./base-api";
import { ApiResponse } from "./types";

export interface AttributeValue {
  id: number;
  value: string;
}

export interface AttributeFilter {
  id: number;
  name: string;
  values: AttributeValue[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number | null;
  children: Category[];
  filterable_attributes: AttributeFilter[] | null;
}

export interface CategoryCreate {
  name: string;
  parent_id?: number | null;
}

export interface CategoryUpdate {
  name?: string;
  parent_id?: number | null;
}

export interface CategoriesQueryParams {
  slug?: string;
  skip?: number;
  limit?: number;
}

export interface CategoryResponse extends ApiResponse<Category> {}
export interface CategoriesListResponse extends ApiResponse<Category[]> {}

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query<Category[], CategoriesQueryParams>({
      query: (params) => ({
        url: "categories",
        params: params,
      }),
      transformResponse: (response: CategoriesListResponse) => response.data,
      providesTags: ["Categories"],
    }),
    getCategory: build.query<Category, number>({
      query: (categoryId) => `categories/${categoryId}`,
      transformResponse: (response: CategoryResponse) => response.data,
      providesTags: (result, error, categoryId) => [
        { type: "Categories", id: categoryId },
      ],
    }),
    createCategory: build.mutation<Category, CategoryCreate>({
      query: (category) => ({
        url: "categories",
        method: "POST",
        body: category,
      }),
      transformResponse: (response: CategoryResponse) => response.data,
      invalidatesTags: ["Categories"],
    }),
    updateCategory: build.mutation<Category, { categoryId: number; category: CategoryUpdate }>({
      query: ({ categoryId, category }) => ({
        url: `categories/${categoryId}`,
        method: "PUT",
        body: category,
      }),
      transformResponse: (response: CategoryResponse) => response.data,
      invalidatesTags: (result, error, { categoryId }) => [
        { type: "Categories", id: categoryId },
        "Categories",
      ],
    }),
    deleteCategory: build.mutation<void, number>({
      query: (categoryId) => ({
        url: `categories/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, categoryId) => [
        { type: "Categories", id: categoryId },
        "Categories",
      ],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
