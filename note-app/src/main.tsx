import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { NotesProvider } from "./context/NotesContext";
import { ThemeProvider } from "./context/ThemeContext.tsx";
createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <NotesProvider>
      <App />
    </NotesProvider>
  </ThemeProvider>,
);
