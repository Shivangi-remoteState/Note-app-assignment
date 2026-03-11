import NoteMenu from "./NoteMenu";
import { useEffect } from "react";
interface NoteHeaderProps {
  title: string;
  setTitle: (value: string) => void;
  isFavorite: boolean;
  isArchived: boolean;
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
  toggleFavorite: () => void;
  toggleArchived: () => void;
  handleDelete: () => void;
}

const NoteHeader = ({
  title,
  setTitle,
  isFavorite,
  isArchived,
  menuOpen,
  setMenuOpen,
  toggleFavorite,
  toggleArchived,
  handleDelete,
}: NoteHeaderProps) => {
  useEffect(() => {
    const handleWindowClick = () => {
      setMenuOpen(false);
    };

    if (menuOpen) {
      window.addEventListener("click", handleWindowClick);
    }

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, [menuOpen]);

  return (
    <div className="flex justify-between relative pb-8 ">
      {/* title */}
      <div className="flex items-center gap-2 w-full">
        <input
          className="text-3xl font-bold w-full bg-(--color-transparent) text-(--color-text) placeholder-(--color-placeholder)  outline-none"
          placeholder="Untitled"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {isFavorite && <span className="text-yellow-400">★</span>}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen(!menuOpen);
        }}
      >
        <img src="/images/MenuBtn.svg" alt="menu icon" className="logo" />
      </button>

      {menuOpen && (
        <NoteMenu
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          isArchived={isArchived}
          toggleArchive={toggleArchived}
          handleDelete={handleDelete}
          closeMenu={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default NoteHeader;
