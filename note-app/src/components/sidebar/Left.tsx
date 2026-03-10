import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import type { Folder, RecentNote } from "../../types/api";
import { useNavigate, useParams } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import LogoSection from "./LogoSection";
import MoreSection from "../MoreSection";
import FolderSection from "./FolderSection";
import { FolderPlus } from "lucide-react";
import RecentNotes from "./RecentNotes";
import ThemeToggle from "./ThemeToggle";
import NewNoteButton from "./NewNoteButton";
import ConfirmDelete from "../ConfirmDelete";
import { showSuccess } from "@/utils/toast";
// import { useTheme } from "@/context/ThemeContext";

export default function Left() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showInputBoxFolder, setShowInputBoxFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);
  const { query, setQuery } = useSearch();
  const [showSearch, setShowSearch] = useState(false);
  const [searchInpText, setSearchInpText] = useState(query);

  const [editedFolderId, setEditedFolderId] = useState<string | null>(null);
  const [editFoldername, setEditFolderName] = useState("");

  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);

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

  // fetching recent notes
  const [recentNotes, setRecentNotes] = useState<RecentNote[]>([]);
  useEffect(() => {
    async function fetchRecentNotes() {
      try {
        const response = await api.get("/notes/recent");
        const recent = response.data.recentNotes || [];
        setRecentNotes(recent);
      } catch (error) {
        console.log("Error in fetching recent notes:", error);
      }
    }
    fetchRecentNotes();
  }, []);

  // by default select first folder
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/" && folders.length > 0) {
      navigate(`/folder/${folders[0].id}`, { replace: true });
    }
  }, [folders, navigate]);

  // add folder when click on save button
  async function handleCreateFolder() {
    if (!folderName.trim()) return;
    try {
      setLoading(true);
      await api.post("/folders", { name: folderName });
      showSuccess("Folder created");
      const response = await api.get("/folders");
      setFolders(response.data.folders);
      setFolderName("");
      setShowInputBoxFolder(false);
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
      showSuccess("Folder moved to Trash");
      // refresh folder list
      const response = await api.get("/folders");
      setFolders(response.data.folders);
      navigate("/trash");
    } catch (error) {
      console.log("Error in deleting folder:", error);
    }
  }

  // update folder
  async function updateFolderName(folderId: string) {
    if (!editFoldername.trim()) return;
    try {
      await api.patch(`/folders/${folderId}`, { name: editFoldername });
      showSuccess("Folder renamed");
      const response = await api.get("/folders");
      setFolders(response.data.folders);
      setEditedFolderId(null);
      setEditFolderName("");
    } catch (error) {
      console.log("Error in updating folder name:", error);
    }
  }
  //  debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(searchInpText);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInpText, setQuery]);
  return (
    <div className="w-sidebar h-screen px-4 py-5 flex flex-col gap-gap font-name bg-[var(--color-sidebar)] text-[var(--color-text)]">
      {/* logo section */}
      <LogoSection toggleSearch={() => setShowSearch(!showSearch)} />

      {showSearch && (
        <input
          type="text"
          value={searchInpText}
          onChange={(e) => setSearchInpText(e.target.value)}
          placeholder="Search notes or folders..."
          className="w-full px-3 py-2 rounded font-name bg-[var(--color-card)] text-[var(--color-text)] border border-[var(--color-border)] placeholder-[var(--color-gray-400)]"
          // className={`w-full px-3 py-2 rounded font-name ${
          //   theme === "dark" ? "bg-card text-white" : "bg-gray-300 text-black"
          // }`}
        />
      )}

      {/* new note*/}
      <NewNoteButton
        onClick={() => navigate(`/folder/${currentFolderId}/new`)}
      />

      {/* recent */}
      <RecentNotes recentNotes={recentNotes} />

      {/* Folders */}
      <div className="flex flex-col gap-2 py-1 px-2 ">
        <div className="flex items-center justify-between gap-1">
          <div className="text-sm font-semibold text-[var(--color-text)]">
            Folders
          </div>
          <button
            className="opacity-80"
            onClick={() => setShowInputBoxFolder(true)}
          >
            <FolderPlus size={16} className="text-[var(--color-text)]" />
          </button>
        </div>
        {showInputBoxFolder && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="border border-[var(--color-border)] bg-[var(--color-card)] px-2 py-1 font-name text-sm text-[var(--color-text)]"
            />
            <button
              onClick={handleCreateFolder}
              disabled={loading}
              className="bg-[var(--color-blue-500)] hover:bg-[var(--color-blue-600)] text-white px-2 py-1 rounded text-sm"
            >
              Save
            </button>
          </div>
        )}
        {/* load folder */}
        <FolderSection
          folders={folders}
          currentFolderId={currentFolderId}
          editedFolderId={editedFolderId}
          editFoldername={editFoldername}
          setEditFolderName={setEditFolderName}
          setEditedFolderId={setEditedFolderId}
          navigate={navigate}
          updateFolderName={updateFolderName}
          deleteFolder={(id) => setFolderToDelete(id)}
        />
      </div>
      {/* more section*/}
      <div className="flex flex-col gap-2">
        <MoreSection />
      </div>
      {/* theme button */}
      <ThemeToggle />
      {folderToDelete && (
        <ConfirmDelete
          title="Delete Folder"
          message="All notes inside this folder will also be moved to Trash."
          onCancel={() => setFolderToDelete(null)}
          onConfirm={async () => {
            await deleteFolder(folderToDelete);
            setFolderToDelete(null);
          }}
        />
      )}
    </div>
  );
}
