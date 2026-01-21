import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Pega o elemento #root do index.html e renderiza o App dentro dele
const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Elemento #root não encontrado no index.html");
}
