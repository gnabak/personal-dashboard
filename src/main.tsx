import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "leaflet/dist/leaflet.css";
import "./index.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "./themes/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgb(var(--color-muted))",
              border: "1px solid rgb(var(--color-border))",
              color: "rgb(var(--color-foreground))",
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
            },
          }}
        />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
