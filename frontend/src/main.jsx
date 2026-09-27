import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

import { ThemeProvider } from "./context/ThemeContext/ThemeContext.jsx";
import AuthProvider from "./context/AuthContext/AuthContext.jsx";

import "./styles/variables.css";
import "./styles/reset.css";
import "./styles/globals.css";
import "./styles/responsive.css";


createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);