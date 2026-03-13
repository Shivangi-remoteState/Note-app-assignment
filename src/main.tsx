import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { NotesProvider } from "./context/NotesProvider.tsx";
import { ThemeProvider } from "./context/ThemeProvider.tsx";
createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <NotesProvider>
      <App />
    </NotesProvider>
  </ThemeProvider>,
);
