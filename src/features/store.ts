import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.ts";

const rootReducer = combineReducers({
  user: authReducer,
});

export function setUpStore(preloadedState?: Partial<RootState>) {
  return configureStore({ reducer: rootReducer, preloadedState });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setUpStore>;
export type AppDispatch = AppStore["dispatch"];
