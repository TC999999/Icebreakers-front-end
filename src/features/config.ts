import { type ReduxAuthState } from "../types/authTypes";

export const AUTH_INITIAL_STATE: ReduxAuthState = {
  user: null,
  loading: {
    loadingInfo: {
      pageLoading: true,
      formLoading: false,
    },
    loadingError: { message: "", status: null },
  },
};
