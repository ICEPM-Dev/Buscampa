/**
 * Punto de entrada principal de la aplicación React.
 * Renderiza la aplicación en el elemento DOM con id 'root' usando React 18.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Crear el root de React y renderizar la aplicación en modo estricto
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
