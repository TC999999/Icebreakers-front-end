import { createSlice } from "@reduxjs/toolkit";
import { LogInUser, getCurrentUser, LogOutUser } from "../actions/auth";
import { AUTH_INITIAL_STATE } from "../config";

const authSlice = createSlice({
  name: "auth",
  initialState: AUTH_INITIAL_STATE,
  reducers: {
    //sets state for errors involving failure to submit data
    setLoadError: (state, action) => {
      state.loading.loadingError.message = action.payload;
    },
    // changes on page loading state when submitting a form
    setFormLoading: (state, action) => {
      state.loading.loadingInfo.formLoading = action.payload;
    },
    // changes on page loading state for when getting data
    setPageLoading: (state, action) => {
      state.loading.loadingInfo.pageLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
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
        state.loading.loadingInfo.formLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action: any) => {
        state.user = action.payload.user;
        state.loading.loadingInfo.formLoading = false;
        state.loading.loadingError.message = "";
      })
      .addCase(getCurrentUser.rejected, (state, action: any) => {
        state.user = AUTH_INITIAL_STATE.user;
        state.loading.loadingInfo.formLoading = false;
        state.loading.loadingError.message = action.payload;
      })
      .addCase(LogOutUser.pending, (state) => {
        state.loading.loadingInfo.formLoading = true;
      })
      .addCase(LogOutUser.fulfilled, (state) => {
        state.user = AUTH_INITIAL_STATE.user;
        state.loading.loadingInfo.formLoading = false;
        state.loading.loadingError.message = "";
      })
      .addCase(LogOutUser.rejected, (state, action: any) => {
        state.loading.loadingInfo.formLoading = false;
        state.loading.loadingError.message = action.payload;
      });
  },
});

export default authSlice.reducer;
