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
    //sets state for errors involving failure to submit data
    setLoadError: (state, action) => {
      state.loading.loadingError = action.payload;
    },
    // changes on page loading state when submitting a form
    setFormLoading: (state, action) => {
      state.loading.loadingInfo.formLoading = action.payload;
    },
    // changes on page loading state for when getting data
    setPageLoading: (state, action) => {
      state.loading.loadingInfo.pageLoading = action.payload;
    },
    // updates number of unanswered requests on client side
    setUnansweredRequests: (state, action) => {
      state.user!.unansweredRequests += action.payload;
    },
    // updates total number of unread direct messages on client side
    setUnreadMessages: (state, action) => {
      state.user!.unreadMessages += action.payload;
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
      .addCase(RegisterUser.pending, (state) => {
        state.loading.loadingInfo.formLoading = true;
      })
      .addCase(RegisterUser.fulfilled, (state, action: any) => {
        state.user = action.payload.user;
        state.loading.loadingInfo.formLoading = false;
        state.loading.loadingError.message = "";
      })
      .addCase(RegisterUser.rejected, (state, action: any) => {
        state.user = AUTH_INITIAL_STATE.user;
        state.loading.loadingInfo.formLoading = false;
        state.loading.loadingError.message = action.payload;
      })
      .addCase(LogInUser.pending, (state) => {
        state.loading.loadingInfo.formLoading = true;
      })
      .addCase(LogInUser.fulfilled, (state, action: any) => {
        state.user = action.payload.user;
        state.loading.loadingInfo.formLoading = false;
        state.loading.loadingError.message = "";
      })
      .addCase(LogInUser.rejected, (state, action: any) => {
        state.user = AUTH_INITIAL_STATE.user;
        state.loading.loadingInfo.formLoading = false;
        state.loading.loadingError.message = action.payload;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading.loadingInfo.pageLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action: any) => {
        state.user = action.payload.user;
        state.loading.loadingInfo.pageLoading = false;
      })
      .addCase(getCurrentUser.rejected, (state, action: any) => {
        state.user = AUTH_INITIAL_STATE.user;
        state.loading.loadingInfo.pageLoading = false;
        state.loading.loadingError.message = action.payload;
      })
      .addCase(LogOutUser.pending, (state) => {
        state.loading.loadingInfo.pageLoading = true;
      })
      .addCase(LogOutUser.fulfilled, (state) => {
        state.user = AUTH_INITIAL_STATE.user;
        state.loading.loadingInfo.pageLoading = false;
        state.loading.loadingError.message = "";
      })
      .addCase(LogOutUser.rejected, (state, action: any) => {
        state.loading.loadingInfo.pageLoading = false;
        state.loading.loadingError.message = action.payload;
      });
  },
});

export const {
  setFormLoading,
  setPageLoading,
  setLoadError,
  setUnansweredRequests,
  setUnreadMessages,
  setUnreadGroupMessages,
  setFavoriteColor,
} = authSlice.actions;

export default authSlice.reducer;
