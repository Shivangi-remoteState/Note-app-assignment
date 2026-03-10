import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Folder } from "../types/api";

const useFolder = () => {
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    async function loadFolders() {
      try {
        const response = await api.get("/folders");
        setFolders(response.data.folders);
      } catch (error) {
        console.log("Error in loading folders", error);
      }
    }

    loadFolders();
  }, []);
  return folders;
};

export default useFolder;
