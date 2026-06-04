import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  accessTokenExpiresAt: Number(localStorage.getItem("accessTokenExpiresAt")) || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.accessTokenExpiresAt = action.payload.accessTokenExpiresAt || null;

      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      }

      if (action.payload.accessTokenExpiresAt) {
        localStorage.setItem(
          "accessTokenExpiresAt",
          action.payload.accessTokenExpiresAt,
        );
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.accessTokenExpiresAt = null;

      localStorage.removeItem("token");
      localStorage.removeItem("accessTokenExpiresAt");
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setCredentials, logout, setUser } = authSlice.actions;

export default authSlice.reducer;
