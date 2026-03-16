import { useEffect, useRef } from "react";
import type { RefObject } from "react";

export function useAutoSave(
  title: string,
  content: string,
  selectedFolder: string,
  saveFunction: () => void,
  setStatus: (s: string) => void,
  initialLoadRef: RefObject<boolean>,
) {
  const saveRef = useRef(saveFunction);
  useEffect(() => {
    saveRef.current = saveFunction;
  }, [saveFunction]);

  useEffect(() => {
    // note must belong to a folder
    if (!selectedFolder) return;
    // not create empty note
    if (!title && !content) return;
    // prevent autosave when note first load
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }

    setStatus("Typing");

    const timer = setTimeout(() => {
      saveRef.current();
    }, 600);

    return () => clearTimeout(timer);
  }, [title, content, selectedFolder, initialLoadRef, setStatus]);
}
