import NoteMenu from "./NoteMenu";
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
  return (
    <div className="flex  justify-between pb-8 ">
      {/* title */}
      <div className="flex items-center gap-2 w-full">
        <input
          className="text-3xl font-bold w-full bg-transparent outline-none"
          placeholder="Untitled"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {isFavorite && <span className="text-yellow-400">★</span>}
      </div>

      <button onClick={() => setMenuOpen(!menuOpen)}>
        <img src="/images/Frame 1.svg" alt="menu icon" />
      </button>

      {menuOpen && (
        <NoteMenu
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          isArchived={isArchived}
          toggleArchive={toggleArchived}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default NoteHeader;
