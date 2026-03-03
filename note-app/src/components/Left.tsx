import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Folder, RecentNote } from "../types/api";
import { useNavigate, useParams } from "react-router-dom";

import {
  FileText,
  Folder as FolderIcon,
  FolderPlus,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import MoreSection from "./MoreSection";

export default function Left() {
  const [folders, setFolders] = useState<Folder[]>([]);

  const [showInput, setShowInput] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // current folder selection
  const { folderId: currentFolderId } = useParams();

  // fetching folder to show on sidebar
  useEffect(() => {
    async function fetchFolder() {
      try {
        const response = await api.get("/folders");
        // console.log(response);
        const userFolder = response.data.folders;
        // console.log("Fetched folders:", userFolder);
        setFolders(userFolder);
      } catch (error) {
        console.log("Error in fetching folder", error);
      }
    }

    fetchFolder();
  }, []);

  // fetching recent folder
  const [recentNotes, setRecentNotes] = useState<RecentNote[]>([]);
  useEffect(() => {
    async function fetchRecentNotes() {
      try {
        const response = await api.get("/notes/recent");
        const recent = response.data.recentNotes || [];
        const topThree = recent.slice(0, 3);
        setRecentNotes(topThree);
      } catch (error) {
        console.log("Error in fetching recent notes:", error);
      }
    }

    fetchRecentNotes();
  }, []);

  // auto-select first folder
  useEffect(() => {
    const path = window.location.pathname;

    // Only redirect if exact path === "/"
    if (path === "/" && folders.length > 0) {
      navigate(`/folder/${folders[0].id}`, { replace: true });
    }
    // if (
    //   folders.length > 0 &&
    //   !currentFolderId &&
    //   path !== "/favorites" &&
    //   path !== "/archived" &&
    //   path !== "/trash"
    // ) {
    //   navigate(`/folder/${folders[0].id}`, { replace: true });
    // }
  }, [folders, navigate]);

  // add folder when click on save button
  async function handleCreateFolder() {
    if (!folderName.trim()) return;
    try {
      setLoading(true);
      await api.post("/folders", { name: folderName });
      const response = await api.get("/folders");
      // console.log("post response:", response.data);
      setFolders(response.data.folders);
      setFolderName("");
      setShowInput(false);
    } catch (error) {
      console.log("Error when creating folder:", error);
    } finally {
      setLoading(false);
    }
  }
  // delete folder
  async function deleteFolder(folderId: string) {
    try {
      await api.delete(`/folders/${folderId}`);
      alert("Folder moved to Trash");

      // refresh folder list
      const res = await api.get("/folders");
      setFolders(res.data.folders);

      navigate("/trash"); // go to Trash page
    } catch (error) {
      console.log("Error deleting folder:", error);
    }
  }
  return (
    <div
      className="
        w-sidebar
        h-screen 
        px-4 py-5
        flex flex-col 
        gap-gap
     
      "
    >
      <div className="flex items-center justify-between ">
        <div className="flex items-center ">
          <img src="/images/Nowted.svg" className="w-20" />
          {/* <div className="font-nowted">Nowted</div> */}
          <img src="/images/Frame.svg" className="w-3" />
        </div>

        <button className="hover:opacity-80">
          <Search size={20} />
        </button>
      </div>
      {/* new note*/}
      <div
        className="flex justify-center bg-card gap-2 rounded-sm p-2 cursor-pointer hover:opacity-90"
        onClick={() => {
          if (!currentFolderId) {
            alert("Please select a folder first!");
            return;
          }
          navigate(`/folder/${currentFolderId}/new`);
        }}
      >
        <button>
          <Plus size={20} />
        </button>
        <div className="font-name">New Note</div>
      </div>

      {/* recent */}
      <div className="flex flex-col gap-2">
        <div className="text-sm py-1 px-2 font-name">Recents</div>

        <div className="flex flex-col gap-1">
          {recentNotes.length === 0 && (
            <div className="text-xs px-2 text-gray-400">
              No recent notes available
            </div>
          )}

          {recentNotes.map((note) => (
            <div
              key={note.id}
              className="flex gap-2 items-center font-name py-1 px-2 hover:bg-hoverFile rounded cursor-pointer"
              onClick={() =>
                navigate(`/folder/${note.folderId}/note/${note.id}`)
              }
            >
              <FileText size={20} />
              <div className="text-sm">{note.title || "Untitled"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Folders */}
      <div className="flex flex-col gap-2 py-1 px-2 ">
        <div className="flex items-center justify-between gap-1">
          <div className="text-sm font-semibold">Folders</div>
          <button className="opacity-80" onClick={() => setShowInput(true)}>
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
              onClick={() => {
                // console.log("clicked folder from left",folder.id)
                // onClickFolder(folder.id);
                navigate(`/folder/${folder.id}`, {
                  state: { folderName: folder.name },
                });
              }}
              className="flex items-center justify-between gap-3 px-2 py-1 hover:bg-hoverFile rounded cursor-pointer"
            >
              <div className="flex gap-3">
                <FolderIcon size={18} />
                <div className="text-sm hover:text-base">
                  {folder?.name || "Untitled"}
                </div>
              </div>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFolder(folder.id);
                }}
                className="curser-pointer hover:text-red-600"
              >
                <Trash2 size={18} />
              </span>
            </div>
          ))}
        </div>

        {/* <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span>
              <FolderOpen size={18} />
            </span>
            <div className="text-sm hover:text-base ">Personal</div>
          </div>
          <div className="flex items-center gap-3">
            <span>
              <Folder size={18} />
            </span>
            <div className="text-sm hover:text-base">Work</div>
          </div>
          <div className="flex items-center gap-3">
            <span>
              <Folder size={18} />
            </span>
            <div className="text-sm hover:text-base">Travel</div>
          </div>
         
        </div> */}
      </div>
      {/* more section*/}
      <div className="flex flex-col gap-2">
        <MoreSection />
      </div>
    </div>
  );
}
