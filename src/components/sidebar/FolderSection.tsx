import { Folder as FolderIcon, FolderOpen, Trash2 } from "lucide-react";
import type { Folder } from "../../types/api";
import type { NavigateFunction } from "react-router-dom";
interface Props {
  folders: Folder[];
  currentFolderId?: string;
  editedFolderId: string | null;
  editFoldername: string;
  setEditFolderName: (v: string) => void;
  setEditedFolderId: (v: string | null) => void;
  navigate: NavigateFunction;
  updateFolderName: (id: string) => void;
  deleteFolder: (id: string) => void;
}

const FolderSection = ({
  folders,
  currentFolderId,
  editedFolderId,
  editFoldername,
  setEditFolderName,
  setEditedFolderId,
  navigate,
  updateFolderName,
  deleteFolder,
}: Props) => {
  return (
    <div className="flex flex-col flex-1 gap-1 overflow-y-auto">
      {folders.map((folder) => (
        <div
          key={folder.id}
          onClick={() => {
            if (editedFolderId) return;
            // console.log("clicked folder from left",folder.id)
            // onClickFolder(folder.id);
            navigate(`/folder/${folder.id}`, {
              state: { folderName: folder.name },
            });
          }}
          className={`flex items-center justify-between group gap-3 px-2 py-1 rounded cursor-pointer
${currentFolderId === folder.id ? "bg-(--color-hoverFile)" : "hover:bg-(--color-hoverFile)"}`}
        >
          <div className="flex gap-3 flex-1 min-w-0">
            {currentFolderId === folder.id ? (
              <FolderOpen size={18} />
            ) : (
              <FolderIcon size={18} className="text-(--color-text)" />
            )}
            {/* <div className="text-sm hover:text-base">
                  {folder?.name || "Untitled"}
                </div> */}
            {editedFolderId === folder.id ? (
              <input
                value={editFoldername}
                autoFocus
                onChange={(e) => setEditFolderName(e.target.value)}
                onBlur={() => updateFolderName(folder.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateFolderName(folder.id);
                  }
                  if (e.key === "Escape") {
                    setEditedFolderId(null);
                    setEditFolderName("");
                  }
                }}
                className="text-sm bg-(--color-transparent) border border-(--color-border) text-(--color-text)"
              />
            ) : (
              <div
                className="text-sm hover:text-base truncate flex-1"
                onDoubleClick={() => {
                  setEditedFolderId(folder.id);
                  setEditFolderName(folder.name);
                }}
              >
                {folder?.name || "Untitled"}
              </div>
            )}
          </div>
          <span
            onClick={() => {
              deleteFolder(folder.id);
            }}
            className="cursor-pointer hover:text-red-500 opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={18} />
          </span>
        </div>
      ))}
    </div>
  );
};

export default FolderSection;
