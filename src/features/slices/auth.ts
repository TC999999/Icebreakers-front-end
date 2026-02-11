import { createSlice } from "@reduxjs/toolkit";
import {
  RegisterUser,
  LogInUser,
  getCurrentUser,
  LogOutUser,
} from "../actions/auth";
import { AUTH_INITIAL_STATE } from "../config";

const authSlice = createSlice({
  name: "auth",
  initialState: AUTH_INITIAL_STATE,
  reducers: {
    // updates number of unanswered requests on client side
    setUnansweredRequests: (state, action) => {
      state.user!.unansweredRequests += action.payload;
    },
    // updates total number of unread direct messages on client side
    setUnreadDirectMessages: (state, action) => {
      state.user!.unreadDirectMessages += action.payload;
    },
    // updates total number of unread group messages on client side
    setUnreadGroupMessages: (state, action) => {
      state.user!.unreadGroupMessages += action.payload;
    },
    // updates user's favorite color on client side
    setFavoriteColor: (state, action) => {
      state.user!.favoriteColor = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(RegisterUser.fulfilled, (state, action: any) => {
        state.user = action.payload.user;
      })
      .addCase(RegisterUser.rejected, (state) => {
        state.user = AUTH_INITIAL_STATE.user;
      })

      .addCase(LogInUser.fulfilled, (state, action: any) => {
        state.user = action.payload.user;
      })
      .addCase(LogInUser.rejected, (state) => {
        state.user = AUTH_INITIAL_STATE.user;
      })

      .addCase(getCurrentUser.fulfilled, (state, action: any) => {
        state.user = action.payload.user;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.user = AUTH_INITIAL_STATE.user;
      })

      .addCase(LogOutUser.fulfilled, (state) => {
        state.user = AUTH_INITIAL_STATE.user;
      });
  },
});

export const {
  setUnansweredRequests,
  setUnreadDirectMessages,
  setUnreadGroupMessages,
  setFavoriteColor,
} = authSlice.actions;

export default authSlice.reducer;
