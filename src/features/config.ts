import type { ReduxAuthState, LoadingContext } from "../types/authTypes";

// initial state for redux
export const AUTH_INITIAL_STATE: ReduxAuthState = {
  user: null,
};

export const LOADING_INITIAL_STATE: LoadingContext = {
  loadingInfo: {
    pageLoading: true,
    formLoading: false,
  },
  loadingError: { message: "", status: null },
};
