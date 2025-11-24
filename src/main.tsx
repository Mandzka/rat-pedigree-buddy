import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

try {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    document.body.innerHTML = `
      <div style="padding: 40px; font-family: sans-serif; background: #fee; text-align: center;">
        <h1 style="color: #c00; font-size: 24px; margin-bottom: 20px;">Erro Crítico</h1>
        <p style="font-size: 18px; color: #666;">Elemento #root não encontrado no HTML.</p>
      </div>
    `;
    throw new Error("Root element not found");
  }

  const root = createRoot(rootElement);
  root.render(React.createElement(App));
} catch (error) {
  console.error("Erro ao inicializar aplicação:", error);
  if (document.body) {
    document.body.innerHTML = `
      <div style="padding: 40px; font-family: sans-serif; background: #fee; border: 3px solid #f00; text-align: center;">
        <h1 style="color: #c00; font-size: 24px; margin-bottom: 20px;">Erro ao Carregar Aplicação</h1>
        <p style="font-size: 18px; color: #666; margin-bottom: 20px;">${error instanceof Error ? error.message : String(error)}</p>
        <button onclick="window.location.reload()" style="padding: 12px 24px; background: #2563eb; color: white; border: none; cursor: pointer; border-radius: 6px; font-size: 16px;">
          Recarregar Página
        </button>
      </div>
    `;
  }
}