import { Star, Archive, Trash2 } from "lucide-react";

interface NoteMenuProps {
  isFavorite: boolean;
  toggleFavorite: () => void;
  isArchived: boolean;
  toggleArchive: () => void;
  handleDelete: () => void;
  closeMenu: () => void;
}
const NoteMenu = ({
  isFavorite,
  toggleFavorite,
  isArchived,
  toggleArchive,
  handleDelete,
  closeMenu,
}: NoteMenuProps) => {
  const handleFavorite = () => {
    toggleFavorite();
    closeMenu();
  };

  const handleArchive = () => {
    toggleArchive();
    closeMenu();
  };
  return (
    <div
      className="
        absolute right-0 top-14
        bg-(--color-noteMenu)
        rounded
        p-3
        z-50
      "
      onClick={(e) => e.stopPropagation()}
    >
      <div className="border-b border-(--color-white-20) pb-2">
        <div className="hover:bg-(--color-white-10) rounded">
          <button
            onClick={handleFavorite}
            className="flex items-center gap-3 px-3 py-2 hover:bg-(--color-white-10) rounded cursor-pointer"
          >
            <Star size={16} className={isFavorite ? "text-yellow-400" : ""} />
            {isFavorite ? "Remove from Favourites" : "Add to Favourites"}
          </button>
        </div>

        <div className="hover:bg-(--color-white-10) rounded">
          {" "}
          <button
            onClick={handleArchive}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer"
          >
            <Archive size={16} />{" "}
            {isArchived ? "Remove from Archive" : "Archive"}
          </button>
        </div>
      </div>

      <div className="rounded group hover-bg-red-500/10">
        <button
          className="flex items-center gap-3 px-3 py-2 group-hover:text-red-500 cursor-pointer"
          onClick={handleDelete}
        >
          <Trash2 size={16} className="group-hover:text-red-500" /> Delete
        </button>
      </div>
    </div>
  );
};

export default NoteMenu;
