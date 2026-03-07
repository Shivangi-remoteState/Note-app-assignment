import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { NotesProvider } from "./context/NotesContext";
createRoot(document.getElementById("root")!).render(
  <NotesProvider>
    <App />
  </NotesProvider>,
);
