import { useEffect } from "react";

export function useAutoSave(
  title: string,
  content: string,
  selectedFolder: string,
  saveFunction: () => void,
  setStatus: (s: string) => void,
) {
  useEffect(() => {
    if (!selectedFolder) return;
    if (!title && !content) return;

    setStatus("Typing");

    const timer = setTimeout(() => {
      saveFunction();
    }, 600);

    return () => clearTimeout(timer);
  }, [title, content, selectedFolder]);
}
