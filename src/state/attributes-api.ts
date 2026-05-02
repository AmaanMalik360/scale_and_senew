import { baseApi } from "./base-api";
import { ApiResponse } from "./types";

export interface Attribute {
  id: number;
  name: string;
}

export interface AttributeValue {
  id: number;
  attribute_id: number;
  value: string;
  category_id?: number | null;
}

export interface AttributeWithValues extends Attribute {
  values: AttributeValue[];
}

export interface AttributeCreate {
  name: string;
}

export interface AttributeValueCreate {
  value: string;
  category_id?: number | null;
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
    createAttributeValue: build.mutation<
      AttributeValue,
      { attributeId: number; value: AttributeValueCreate }
    >({
      query: ({ attributeId, value }) => ({
        url: `attributes/${attributeId}/values`,
        method: "POST",
        body: value,
      }),
      transformResponse: (response: ApiResponse<AttributeValue>) => response.data,
      invalidatesTags: (result, error, { attributeId }) => [
        { type: "Attributes", id: attributeId },
        "Attributes",
      ],
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
  useCreateAttributeValueMutation,
  useAssignAttributesToCategoryMutation,
  useGetCategoryAttributesQuery,
} = attributesApi;
