import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Role, SessionUser } from "@/types/auth";
import { DEV_DEFAULT_ROLE } from "@/constants/config";
import type { RootState } from "./index";

export interface SessionState {
  user: SessionUser;
}

const DEFAULT_USER: SessionUser = {
  id: "usr-dev-1",
  name: "Yasir Ali",
  phone: "+92 300 1234567",
  role: DEV_DEFAULT_ROLE,
};

const initialState: SessionState = {
  user: DEFAULT_USER,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SessionUser>) => {
      state.user = action.payload;
    },
    setRole: (state, action: PayloadAction<Role>) => {
      state.user.role = action.payload;
    },
    setSessionState: (state, action: PayloadAction<SessionState>) => {
      state.user = action.payload.user;
    },
  },
});

export const { setUser, setRole, setSessionState } = sessionSlice.actions;

export const selectCurrentUser = (state: RootState): SessionUser =>
  state.session?.user ?? DEFAULT_USER;

export const selectRole = (state: RootState): Role =>
  state.session?.user?.role ?? DEV_DEFAULT_ROLE;

export const selectIsAdmin = (state: RootState): boolean =>
  (state.session?.user?.role ?? DEV_DEFAULT_ROLE) === "admin";

export default sessionSlice.reducer;

