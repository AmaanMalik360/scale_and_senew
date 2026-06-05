import { baseApi } from "./base-api";
import { ApiResponse } from "./types";
import { AttributeValue } from "./attribute-values-api";

export interface Attribute {
  id: number;
  name: string;
}

export interface AttributeWithValues extends Attribute {
  values: AttributeValue[];
}

export interface AttributeCreate {
  name: string;
}

export interface AttributeUpdate {
  name: string;
}

export interface AssignAttributesRequest {
  attribute_ids: number[];
}

export interface AttributeResponse extends ApiResponse<Attribute> {}
export interface AttributeListResponse extends ApiResponse<Attribute[]> {}
export interface AttributeWithValuesResponse extends ApiResponse<AttributeWithValues> {}

export const attributesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAttributes: build.query<Attribute[], void>({
      query: () => "attributes",
      transformResponse: (response: AttributeListResponse) => response.data,
      providesTags: ["Attributes"],
    }),
    getAttribute: build.query<AttributeWithValues, number>({
      query: (attributeId) => `attributes/${attributeId}`,
      transformResponse: (response: AttributeWithValuesResponse) => response.data,
      providesTags: (result, error, attributeId) => [
        { type: "Attributes", id: attributeId },
      ],
    }),
    createAttribute: build.mutation<Attribute, AttributeCreate>({
      query: (attribute) => ({
        url: "attributes",
        method: "POST",
        body: attribute,
      }),
      transformResponse: (response: AttributeResponse) => response.data,
      invalidatesTags: ["Attributes"],
    }),
    updateAttribute: build.mutation<Attribute, { attributeId: number; attribute: AttributeUpdate }>({
      query: ({ attributeId, attribute }) => ({
        url: `attributes/${attributeId}`,
        method: "PATCH",
        body: attribute,
      }),
      transformResponse: (response: AttributeResponse) => response.data,
      invalidatesTags: (result, error, { attributeId }) => [
        { type: "Attributes", id: attributeId },
        "Attributes",
      ],
    }),
    deleteAttribute: build.mutation<void, number>({
      query: (attributeId) => ({
        url: `attributes/${attributeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Attributes"],
    }),
    assignAttributesToCategory: build.mutation<
      void,
      { categoryId: number; attribute_ids: number[] }
    >({
      query: ({ categoryId, attribute_ids }) => ({
        url: `categories/${categoryId}/attributes`,
        method: "POST",
        body: { attribute_ids },
      }),
      invalidatesTags: ["Categories"],
    }),
    getCategoryAttributes: build.query<{ attributes: { name: string; values: { id: number; value: string }[] }[] }, number>({
      query: (categoryId) => `categories/${categoryId}/attributes`,
      transformResponse: (response: ApiResponse<{ attributes: { name: string; values: { id: number; value: string }[] }[] }>) => response.data,
      providesTags: (result, error, categoryId) => [
        { type: "Categories", id: categoryId },
      ],
    }),
  }),
});

export const {
  useGetAttributesQuery,
  useGetAttributeQuery,
  useCreateAttributeMutation,
  useUpdateAttributeMutation,
  useDeleteAttributeMutation,
  useAssignAttributesToCategoryMutation,
  useGetCategoryAttributesQuery,
} = attributesApi;
