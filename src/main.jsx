import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistGate } from "redux-persist/integration/react";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              {/* Global Toast */}
              <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
              />
              <App />
            </QueryClientProvider>
          </AuthProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
