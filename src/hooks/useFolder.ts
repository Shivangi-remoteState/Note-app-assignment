import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Folder, FoldersResponse } from "../types/api";
import { useParams } from "react-router-dom";
const useFolder = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const { folderId } = useParams();
  async function loadFolders() {
    try {
      const response = await api.get<FoldersResponse>("/folders");
      setFolders(response.data.folders);
    } catch (error) {
      console.log("Error in loading folders", error);
    }
  }
  useEffect(() => {
    loadFolders();
  }, [folderId]);
  return { folders, setFolders, loadFolders };
};

export default useFolder;
