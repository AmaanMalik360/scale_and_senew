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
  LoginRequest,
  RegisterRequest,
} from "@/state/users-api";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, accessToken, isAuthenticated, isGuest } = useAppSelector(
    (state) => state.auth
  );

  const [createGuestUserMutation, { isLoading: isCreatingGuest }] =
    useCreateGuestUserMutation();
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegistering }] =
    useRegisterMutation();

  const createGuestUser = useCallback(async () => {
    try {
      const result = await createGuestUserMutation().unwrap();
      const guestUser: AuthUser = {
        id: result.user.id,
        is_guest: result.user.is_guest,
        created_at: result.user.created_at,
        guest_expires_at: result.user.guest_expires_at,
      };
      dispatch(
        setGuestUser({
          user: guestUser,
          accessToken: result.access_token,
        })
      );
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
        };
        dispatch(
          setCredentials({
            user: authUser,
            accessToken: result.access_token,
          })
        );
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
        };
        dispatch(
          setCredentials({
            user: authUser,
            accessToken: result.access_token,
          })
        );
        return result;
      } catch (error) {
        console.error("Registration failed:", error);
        throw error;
      }
    },
    [registerMutation, dispatch]
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  const ensureUser = useCallback(async () => {
    if (!isAuthenticated) {
      return await createGuestUser();
    }
    return { user, accessToken };
  }, [isAuthenticated, createGuestUser, user, accessToken]);

  return {
    user,
    accessToken,
    isAuthenticated,
    isGuest,
    isLoading: isCreatingGuest || isLoggingIn || isRegistering,
    isCreatingGuest,
    isLoggingIn,
    isRegistering,
    createGuestUser,
    login,
    register,
    logout,
    ensureUser,
  };
};

export default useAuth;
