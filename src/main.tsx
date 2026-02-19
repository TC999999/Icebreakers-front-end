import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import queryClient from "./helpers/queryClient.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { setUpStore, type AppStore } from "./features/store.ts";
import App from "./App.tsx";
import "./styles/index.scss";

const store: AppStore = setUpStore();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
