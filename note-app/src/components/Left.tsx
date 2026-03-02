import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Folder } from "../types/api";
import { useLocation, useNavigate } from "react-router-dom";

import {
  FileText,
  Folder as FolderIcon,
  FolderPlus,
  Plus,
  Search,
  Star,
  Trash,
  Archive,
} from "lucide-react";

export default function Left() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const currentFolderId = location.pathname.split("/")[2] || null;

  // Fetching all folders
  useEffect(() => {
    async function loadFolders() {
      try {
        const response = await api.get("/folders");
        const allFolders = response.data.folders;

        setFolders(allFolders);

        // Auto-select first folder if none selected
        if (allFolders.length > 0 && !currentFolderId) {
          navigate(`/folder/${allFolders[0].id}`);
        }
      } catch (error) {
        console.log("Error fetching folders:", error);
      }
    }

    loadFolders();
  }, []);

  // Create new folder
  async function handleCreateFolder() {
    if (!folderName.trim()) return;

    try {
      setLoading(true);
      await api.post("/folders", { name: folderName });

      const res = await api.get("/folders");
      setFolders(res.data.folders);

      setFolderName("");
      setShowInput(false);
    } catch (error) {
      console.log("Error creating folder:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-sidebar h-screen px-4 py-5 flex flex-col gap-gap">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src="/images/Nowted.svg" className="w-20" />
          <img src="/images/Frame.svg" className="w-3" />
        </div>

        <button className="hover:opacity-80">
          <Search size={20} />
        </button>
      </div>

      {/* NEW NOTE BUTTON */}
      <div
        className="flex justify-center bg-card gap-2 rounded-sm p-2 cursor-pointer hover:opacity-90"
        onClick={() => {
          if (!currentFolderId) {
            alert("Select a folder first!");
            return;
          }
          navigate(`/folder/${currentFolderId}/new`);
        }}
      >
        <Plus size={20} />
        <div className="font-name">New Note</div>
      </div>

      {/* RECENTS */}
      <div className="flex flex-col gap-2">
        <div className="text-sm py-1 px-2 font-name">Recents</div>

        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center py-1 px-2 hover:bg-hoverFile rounded">
            <FileText size={20} />
            <div>Reflection on the Month</div>
          </div>
          <div className="flex gap-2 items-center py-1 px-2 hover:bg-hoverFile rounded">
            <FileText size={20} />
            <div>Project Proposal</div>
          </div>
          <div className="flex gap-2 items-center py-1 px-2 hover:bg-hoverFile rounded">
            <FileText size={20} />
            <div>Travel Plan</div>
          </div>
        </div>
      </div>

      {/* FOLDERS */}
      <div className="flex flex-col gap-2 py-1 px-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Folders</div>
          <button onClick={() => setShowInput(true)}>
            <FolderPlus size={16} />
          </button>
        </div>

        {showInput && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="border px-2 py-1 text-sm"
            />
            <button
              onClick={handleCreateFolder}
              disabled={loading}
              className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
            >
              Save
            </button>
          </div>
        )}

        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => navigate(`/folder/${folder.id}`)}
              className={`flex items-center gap-3 px-2 py-1 rounded cursor-pointer ${
                currentFolderId === folder.id
                  ? "bg-hoverFile"
                  : "hover:bg-hoverFile"
              }`}
            >
              <FolderIcon size={18} />
              <div className="text-sm">{folder.name || "Untitled"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MORE SECTION */}
      <div className="flex flex-col gap-2">
        <div className="px-2 text-sm text-gray-300">More</div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 px-2 py-1 hover:bg-hoverFile rounded cursor-pointer">
            <Star size={16} />
            <div className="text-sm">Favorites</div>
          </div>

          <div className="flex items-center gap-3 px-2 py-1 hover:bg-hoverFile rounded cursor-pointer">
            <Trash size={16} />
            <div className="text-sm">Trash</div>
          </div>

          <div className="flex items-center gap-3 px-2 py-1 hover:bg-hoverFile rounded cursor-pointer">
            <Archive size={16} />
            <div className="text-sm">Archived Notes</div>
          </div>
        </div>
      </div>
    </div>
  );
}