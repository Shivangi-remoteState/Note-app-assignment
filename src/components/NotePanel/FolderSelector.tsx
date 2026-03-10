import type { Folder } from "@/types/api";
import { ChevronDown, Folder as FolderIcon } from "lucide-react";

import { useEffect } from "react";

interface FolderSelectorProps {
  folders: Folder[];
  selectedFolder: string;
  folderDropdownOpen: boolean;
  setFolderDropdownOpen: (value: boolean) => void;
  handleFolderChange: (id: string) => void;
}
const FolderSelector = ({
  folders,
  selectedFolder,
  folderDropdownOpen,
  setFolderDropdownOpen,
  handleFolderChange,
}: FolderSelectorProps) => {
  useEffect(() => {
    const handleWindowClick = () => {
      setFolderDropdownOpen(false);
    };

    if (folderDropdownOpen) {
      window.addEventListener("click", handleWindowClick);
    }

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, [folderDropdownOpen]);
  return (
    <div className="flex items-center gap-18 relative">
      <div className="flex items-center gap-2">
        <FolderIcon size={16} />
        <span className="text-sm opacity-70">Folder</span>
      </div>

      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <div
          onClick={() => setFolderDropdownOpen(!folderDropdownOpen)}
          className="flex items-center gap-1 cursor-pointer"
        >
          <span className="text-sm font-bold truncate max-w-50">
            {folders.find((f) => f.id === selectedFolder)?.name || "Loading..."}
          </span>

          <ChevronDown size={14} />
        </div>

        {folderDropdownOpen && (
          <div className="absolute top-7 left-7 w-44 h-63 bg-[var(--color-folderDropdown)] border border-[var(--color-white-10)] rounded-md shadow-lg z-50 overflow-y-auto">
            {folders.map((folder) => (
              <div
                key={folder.id}
                onClick={() => handleFolderChange(folder.id)}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-[var(--color-hoverFile)] truncate "
              >
                {folder.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderSelector;
