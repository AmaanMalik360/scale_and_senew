"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import {
  setCredentials,
  setGuestUser,
  logout as logoutAction,
  AuthUser,
} from "@/state/auth-slice";
import {
  useCreateGuestUserMutation,
  useLoginMutation,
  useRegisterMutation,
  useLogoutUserMutation,
  LoginRequest,
  RegisterRequest,
} from "@/state/users-api";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isGuest } = useAppSelector(
    (state) => state.auth
  );

  const [createGuestUserMutation, { isLoading: isCreatingGuest }] =
    useCreateGuestUserMutation();
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegistering }] =
    useRegisterMutation();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutUserMutation();

  const createGuestUser = useCallback(async () => {
    try {
      const result = await createGuestUserMutation().unwrap();
      const guestUser: AuthUser = {
        id: result.user.id,
        is_guest: result.user.is_guest,
        created_at: result.user.created_at,
        guest_expires_at: result.user.guest_expires_at,
      };
      dispatch(setGuestUser({ user: guestUser }));
      return result;
    } catch (error) {
      console.error("Failed to create guest user:", error);
      throw error;
    }
  }, [createGuestUserMutation, dispatch]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        const result = await loginMutation(credentials).unwrap();
        const authUser: AuthUser = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          is_guest: result.user.is_guest,
          created_at: result.user.created_at,
          updated_at: result.user.updated_at,
          permissions: result.user.permissions,
        };
        dispatch(setCredentials({ user: authUser }));
        return result;
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },
    [loginMutation, dispatch]
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      try {
        const result = await registerMutation(data).unwrap();
        const authUser: AuthUser = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          is_guest: result.user.is_guest,
          created_at: result.user.created_at,
          updated_at: result.user.updated_at,
          permissions: result.user.permissions,
        };
        dispatch(setCredentials({ user: authUser }));
        return result;
      } catch (error) {
        console.error("Registration failed:", error);
        throw error;
      }
    },
    [registerMutation, dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      // Clear local state even if API call fails
    } finally {
      dispatch(logoutAction());
    }
  }, [logoutMutation, dispatch]);

  const ensureUser = useCallback(async () => {
    if (!isAuthenticated) {
      return await createGuestUser();
    }
    return { user };
  }, [isAuthenticated, createGuestUser, user]);

  return {
    user,
    isAuthenticated,
    isGuest,
    isLoading: isCreatingGuest || isLoggingIn || isRegistering || isLoggingOut,
    isCreatingGuest,
    isLoggingIn,
    isRegistering,
    isLoggingOut,
    createGuestUser,
    login,
    register,
    logout,
    ensureUser,
  };
};

export default useAuth;
