import { baseApi } from "./base-api";

export interface User {
  id: string;
  email: string;
  name?: string;
  is_guest: boolean;
  created_at: string;
  updated_at: string;
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

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<User[], UsersQueryParams>({
      query: (params) => ({
        url: "users",
        params: params,
      }),
      providesTags: ["Users"],
    }),
    getUser: build.query<User, string>({
      query: (userId) => `users/${userId}`,
      providesTags: (result, error, userId) => [
        { type: "Users", id: userId },
      ],
    }),
    getUserByEmail: build.query<User, string>({
      query: (email) => `users/email/${email}`,
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
      invalidatesTags: ["Users"],
    }),
    updateUser: build.mutation<User, { userId: string; user: UserUpdate }>({
      query: ({ userId, user }) => ({
        url: `users/${userId}`,
        method: "PUT",
        body: user,
      }),
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
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useGetUserByEmailQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
