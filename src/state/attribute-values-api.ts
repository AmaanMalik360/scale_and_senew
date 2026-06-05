import { baseApi } from "./base-api";
import { ApiResponse } from "./types";

export interface AttributeValue {
  id: number;
  attribute_id: number;
  value: string;
  category_id?: number | null;
}

export interface AttributeValueCreate {
  value: string;
  category_id?: number | null;
}

export interface AttributeValueUpdate {
  value?: string;
  category_id?: number | null;
}

export interface AttributeValueResponse extends ApiResponse<AttributeValue> {}

export const attributeValuesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createAttributeValue: build.mutation<
      AttributeValue,
      { attributeId: number; value: AttributeValueCreate }
    >({
      query: ({ attributeId, value }) => ({
        url: `attribute-values/${attributeId}`,
        method: "POST",
        body: value,
      }),
      transformResponse: (response: AttributeValueResponse) => response.data,
      invalidatesTags: (result, error, { attributeId }) => [
        { type: "Attributes", id: attributeId },
        "Attributes",
      ],
    }),
    updateAttributeValue: build.mutation<
      AttributeValue,
      { valueId: number; attributeId: number; value: AttributeValueUpdate }
    >({
      query: ({ valueId, value }) => ({
        url: `attribute-values/${valueId}`,
        method: "PATCH",
        body: value,
      }),
      transformResponse: (response: AttributeValueResponse) => response.data,
      invalidatesTags: (result, error, { attributeId }) => [
        { type: "Attributes", id: attributeId },
        "Attributes",
      ],
    }),
    deleteAttributeValue: build.mutation<
      void,
      { valueId: number; attributeId: number }
    >({
      query: ({ valueId }) => ({
        url: `attribute-values/${valueId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { attributeId }) => [
        { type: "Attributes", id: attributeId },
        "Attributes",
      ],
    }),
  }),
});

export const {
  useCreateAttributeValueMutation,
  useUpdateAttributeValueMutation,
  useDeleteAttributeValueMutation,
} = attributeValuesApi;
