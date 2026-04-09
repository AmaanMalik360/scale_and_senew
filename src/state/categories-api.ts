import { baseApi } from "./base-api";

export interface AttributeValue {
  id: number;
  value: string;
}

export interface AttributeFilter {
  name: string;
  values: AttributeValue[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number;
  children: Category[];
  filterable_attributes: AttributeFilter[];
}

export interface CategoryCreate {
  name: string;
  parent_id?: number;
}

export interface CategoryUpdate {
  name?: string;
  parent_id?: number;
}

export interface CategoriesQueryParams {
  slug?: string;
  skip?: number;
  limit?: number;
}

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query<Category[], CategoriesQueryParams>({
      query: (params) => ({
        url: "categories",
        params: params,
      }),
      providesTags: ["Categories"],
    }),
    getCategory: build.query<Category, number>({
      query: (categoryId) => `categories/${categoryId}`,
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
      invalidatesTags: ["Categories"],
    }),
    updateCategory: build.mutation<Category, { categoryId: number; category: CategoryUpdate }>({
      query: ({ categoryId, category }) => ({
        url: `categories/${categoryId}`,
        method: "PUT",
        body: category,
      }),
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
