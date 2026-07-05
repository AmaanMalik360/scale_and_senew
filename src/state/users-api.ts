import { baseApi } from "./base-api";
import { ApiResponse } from "./types";

export interface User {
  id: string;
  email?: string | null;
  name?: string | null;
  is_guest: boolean;
  created_at: string;
  updated_at: string;
}

export interface GuestUser {
  id: string;
  is_guest: boolean;
  created_at: string;
  guest_expires_at?: string | null;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: GuestUser;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface UserCreate {
  email: string;
  password: string;
  name?: string;
  is_guest?: boolean;
}

export interface UserUpdate {
  email?: string;
  name?: string;
  is_guest?: boolean;
}

export interface UsersQueryParams {
  skip?: number;
  limit?: number;
}

export interface UserResponse extends ApiResponse<User> {}
export interface UsersListResponse extends ApiResponse<User[]> {}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<User[], UsersQueryParams>({
      query: (params) => ({
        url: "users",
        params: params,
      }),
      transformResponse: (response: UsersListResponse) => response.data,
      providesTags: ["Users"],
    }),
    getUser: build.query<User, string>({
      query: (userId) => `users/${userId}`,
      transformResponse: (response: UserResponse) => response.data,
      providesTags: (result, error, userId) => [
        { type: "Users", id: userId },
      ],
    }),
    getUserByEmail: build.query<User, string>({
      query: (email) => `users/email/${email}`,
      transformResponse: (response: UserResponse) => response.data,
      providesTags: (result, error, email) => [
        { type: "Users", id: `email-${email}` },
      ],
    }),
    createUser: build.mutation<User, UserCreate>({
      query: (user) => ({
        url: "users",
        method: "POST",
        body: user,
      }),
      transformResponse: (response: UserResponse) => response.data,
      invalidatesTags: ["Users"],
    }),
    updateUser: build.mutation<User, { userId: string; user: UserUpdate }>({
      query: ({ userId, user }) => ({
        url: `users/${userId}`,
        method: "PUT",
        body: user,
      }),
      transformResponse: (response: UserResponse) => response.data,
      invalidatesTags: (result, error, { userId }) => [
        { type: "Users", id: userId },
        "Users",
      ],
    }),
    deleteUser: build.mutation<void, string>({
      query: (userId) => ({
        url: `users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, userId) => [
        { type: "Users", id: userId },
        "Users",
      ],
    }),
    createGuestUser: build.mutation<AuthTokenResponse, void>({
      query: () => ({
        url: "users/guest",
        method: "POST",
      }),
      transformResponse: (response: ApiResponse<AuthTokenResponse>) =>
        response.data,
    }),
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "users/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: ApiResponse<LoginResponse>) =>
        response.data,
    }),
    register: build.mutation<LoginResponse, RegisterRequest>({
      query: (data) => ({
        url: "users/register",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiResponse<LoginResponse>) =>
        response.data,
    }),
    getCurrentUser: build.query<User, void>({
      query: () => "users/me",
      transformResponse: (response: UserResponse) => response.data,
      providesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useGetUserByEmailQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useCreateGuestUserMutation,
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
} = usersApi;
