import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.ts";
import loadReducer from "./slices/loading.ts";

const rootReducer = combineReducers({
  user: authReducer,
  loading: loadReducer,
});

export function setUpStore(preloadedState?: Partial<RootState>) {
  return configureStore({ reducer: rootReducer, preloadedState });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setUpStore>;
export type AppDispatch = AppStore["dispatch"];
