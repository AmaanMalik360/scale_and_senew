import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  id: string;
  email?: string | null;
  name?: string | null;
  is_guest: boolean;
  created_at: string;
  updated_at?: string;
  guest_expires_at?: string | null;
  permissions?: string[];
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isGuest: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isGuest = action.payload.user.is_guest;
    },
    setGuestUser: (
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isGuest = true;
    },
    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        state.isGuest = state.user.is_guest;
      }
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isGuest = false;
    },
  },
});

export const { setCredentials, setGuestUser, updateUser, logout } =
  authSlice.actions;
export default authSlice.reducer;
