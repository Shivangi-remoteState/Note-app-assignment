import { useEffect } from "react";
import type { RefObject } from "react";

export function useAutoSave(
  title: string,
  content: string,
  selectedFolder: string,
  saveFunction: () => void,
  setStatus: (s: string) => void,
  initialLoad: RefObject<boolean>,
) {
  useEffect(() => {
    if (!selectedFolder) return;
    if (!title && !content) return;

    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    setStatus("Typing");

    const timer = setTimeout(() => {
      saveFunction();
    }, 600);

    return () => clearTimeout(timer);
  }, [title, content, selectedFolder]);
}
