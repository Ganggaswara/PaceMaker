import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ProductProvider } from "./utils/ProductContext";
import { TransactionProvider } from "./utils/TransactionContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
          <ProductProvider>
            <TransactionProvider>
              <App />
              <Toaster position="top-center" reverseOrder={false} />
            </TransactionProvider>
          </ProductProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);