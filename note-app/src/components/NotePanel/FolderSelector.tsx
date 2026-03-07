import { ChevronDown, Folder as FolderIcon } from "lucide-react";

import type Folder from "../../types/api";

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
  return (
    <div className="flex items-center gap-18 relative">
      <div className="flex items-center gap-2">
        <FolderIcon size={16} />
        <span className="text-sm opacity-70">Folder</span>
      </div>

      <div className="relative">
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
          <div className="absolute top-6 left-0 w-44 bg-[#1c1c1c] border border-white/10 rounded-md shadow-lg z-50">
            {folders.map((folder) => (
              <div
                key={folder.id}
                onClick={() => handleFolderChange(folder.id)}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-hoverFile truncate "
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
