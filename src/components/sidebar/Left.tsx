import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import type { Folder, RecentNote } from "../../types/api";
import { useNavigate, useParams } from "react-router-dom";
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

  const [showSearch, setShowSearch] = useState(false);
  const [searchInpText, setSearchInpText] = useState("");

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
      const value = searchInpText.trim();

      if (value === "") {
        navigate(window.location.pathname);
      } else {
        navigate(`${window.location.pathname}?q=${value}`);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInpText]);

  return (
    <div className="w-sidebar h-screen px-4 py-5 flex flex-col gap-gap font-name bg-(--color-sidebar) text-(--color-text)">
      {/* logo section */}
      <LogoSection
        toggleSearch={() => {
          const next = !showSearch;
          setShowSearch(next);

          if (!next) {
            setSearchInpText("");
            navigate(window.location.pathname);
          }
        }}
      />{" "}
      {showSearch && (
        <input
          autoFocus
          type="text"
          value={searchInpText}
          onChange={(e) => setSearchInpText(e.target.value)}
          placeholder="Search notes..."
          className="w-full px-3 py-2 rounded font-name bg-(--color-card) text-(--color-text) border border-(--color-border)"
        />
      )}
      {/* new note*/}
      <NewNoteButton
        onClick={() => navigate(`/folder/${currentFolderId}/new`)}
      />
      {/* recent */}
      <RecentNotes recentNotes={recentNotes} />
      {/* Folders */}
      <div className="flex flex-col gap-2 py-1 px-2 flex-1 min-h-0">
        <div className="flex items-center justify-between gap-1">
          <div className="text-sm font-semibold text-(--color-text)">
            Folders
          </div>
          <button
            className="opacity-80"
            onClick={() => setShowInputBoxFolder(true)}
          >
            <FolderPlus size={16} className="text-(--color-text)" />
          </button>
        </div>
        {showInputBoxFolder && (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="border border-(--color-border) bg-(--color-card) px-2 py-1 font-name text-sm text-(--color-text)"
            />
            <button
              onClick={handleCreateFolder}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
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
