import { Star, Archive, Trash2 } from "lucide-react";
const NoteMenu = ({
  isFavorite,
  toggleFavorite,
  isArchived,
  toggleArchive,
  handleDelete,
}) => {
  return (
    <div
      className="
        absolute right-0 top-14
        bg-noteMenu
        rounded
        p-3
        z-50
      "
    >
      <div className="border-b border-white/20 pb-2">
        <button
          onClick={toggleFavorite}
          className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded"
        >
          <Star size={16} className={isFavorite ? "text-yellow-400" : ""} />
          {isFavorite ? "Remove from Favourites" : "Add to Favourites"}
        </button>

        <button
          onClick={toggleArchive}
          className="flex items-center gap-3 px-3 py-2 "
        >
          <Archive size={16} />{" "}
          {isArchived ? "Remove from Archive" : "Archived"}
        </button>
      </div>

      <button
        className="flex items-center gap-3 px-3 py-2  "
        onClick={handleDelete}
      >
        <Trash2 size={16} /> Delete
      </button>
    </div>
  );
};

export default NoteMenu;
