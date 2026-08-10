import { baseApi } from "./base-api";
import { ApiResponse } from "./types";

export interface Address {
  id: string;
  user_id: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
  label?: string;
  is_default: boolean;
  created_at: string;
}

export interface AddressCreate {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
  label?: string;
  is_default?: boolean;
}

interface AddressResponse extends ApiResponse<Address> {}
interface AddressListResponse extends ApiResponse<Address[]> {}

export const addressesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listAddresses: build.query<Address[], void>({
      query: () => "addresses",
      transformResponse: (response: AddressListResponse) => response.data,
      providesTags: ["Addresses"],
    }),
    createAddress: build.mutation<Address, AddressCreate>({
      query: (body) => ({
        url: "addresses",
        method: "POST",
        body,
      }),
      transformResponse: (response: AddressResponse) => response.data,
      invalidatesTags: ["Addresses"],
    }),
    deleteAddress: build.mutation<void, string>({
      query: (addressId) => ({
        url: `addresses/${addressId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Addresses"],
    }),
  }),
});

export const {
  useListAddressesQuery,
  useCreateAddressMutation,
  useDeleteAddressMutation,
} = addressesApi;
