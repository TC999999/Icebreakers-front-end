import { createSlice } from "@reduxjs/toolkit";
import {
  RegisterUser,
  LogInUser,
  getCurrentUser,
  LogOutUser,
} from "../actions/auth";
import { LOADING_INITIAL_STATE } from "../config";

const authSlice = createSlice({
  name: "auth",
  initialState: LOADING_INITIAL_STATE,
  reducers: {
    //sets state for errors involving failure to submit data
    setLoadError: (state, action) => {
      state.loadingError = action.payload;
    },
    // changes on page loading state when submitting a form
    setFormLoading: (state, action) => {
      state.loadingInfo.formLoading = action.payload;
    },
    // changes on page loading state for when getting data
    setPageLoading: (state, action) => {
      state.loadingInfo.pageLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(RegisterUser.pending, (state) => {
        state.loadingInfo.formLoading = true;
      })
      .addCase(RegisterUser.fulfilled, (state) => {
        state.loadingInfo.formLoading = false;
        state.loadingError.message = "";
      })
      .addCase(RegisterUser.rejected, (state, action: any) => {
        state.loadingInfo.formLoading = false;
        state.loadingError.message = action.payload;
      })
      .addCase(LogInUser.pending, (state) => {
        state.loadingInfo.formLoading = true;
      })
      .addCase(LogInUser.fulfilled, (state) => {
        state.loadingInfo.formLoading = false;
        state.loadingError.message = "";
      })
      .addCase(LogInUser.rejected, (state, action: any) => {
        state.loadingInfo.formLoading = false;
        state.loadingError.message = action.payload;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loadingInfo.pageLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state) => {
        state.loadingInfo.pageLoading = false;
      })
      .addCase(getCurrentUser.rejected, (state, action: any) => {
        state.loadingInfo.pageLoading = false;
        state.loadingError.message = action.payload;
      })
      .addCase(LogOutUser.pending, (state) => {
        state.loadingInfo.pageLoading = true;
      })
      .addCase(LogOutUser.fulfilled, (state) => {
        state.loadingInfo.pageLoading = false;
        state.loadingError.message = "";
      })
      .addCase(LogOutUser.rejected, (state, action: any) => {
        state.loadingInfo.pageLoading = false;
        state.loadingError.message = action.payload;
      });
  },
});

export const { setFormLoading, setPageLoading, setLoadError } =
  authSlice.actions;

export default authSlice.reducer;
