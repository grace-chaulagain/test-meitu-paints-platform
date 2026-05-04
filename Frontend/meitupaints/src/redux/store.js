import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
// (later) import dealerOrderReducer

export const store = configureStore({
  reducer: {
    user: userReducer,
    // dealerOrder: dealerOrderReducer (we’ll plug this next)
  },
});

export default store;
