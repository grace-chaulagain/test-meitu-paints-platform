import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  role: null,
  dealerProfile: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.dealerProfile = action.payload.dealerProfile || null;
      state.isAuthenticated = true;
      state.error = null;
    },

    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.dealerProfile = null;
      state.isAuthenticated = false;
    },

    setDealerProfile: (state, action) => {
      state.dealerProfile = action.payload || null;
    },

    logout: (state) => {
      state.user = null;
      state.role = null;
      state.dealerProfile = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  setDealerProfile,
  logout,
} = userSlice.actions;

export default userSlice.reducer;
