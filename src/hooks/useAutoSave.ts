import { useEffect, useRef } from "react";

export function useAutoSave(
  title: string,
  content: string,
  selectedFolder: string,
  saveFunction: () => void,
  setStatus: (s: string) => void,
) {
  const initialLoad = useRef(true);
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
  }, [title, content, selectedFolder, saveFunction, setStatus]);
}
