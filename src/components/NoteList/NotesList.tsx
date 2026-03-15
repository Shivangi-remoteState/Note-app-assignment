import Card from "./Card";
import { useNavigate } from "react-router-dom";
import type { Note } from "../../types/api";

interface Props {
  notes: Note[];
  isTrashPage: boolean;
  isFavoritesPage?: boolean;
  isArchivedPage?: boolean;
  selectedNoteId: string | null;
  // setSelectedNoteId: (id: string) => void;
  lastNoteRef?: (node: HTMLDivElement | null) => void;
}
const NotesList = ({
  notes,
  isTrashPage,
  isFavoritesPage = false,
  isArchivedPage = false,
  selectedNoteId,
  // setSelectedNoteId,
}: Props) => {
  const uniqueNotes = Array.from(new Map(notes.map((n) => [n.id, n])).values());
  const navigate = useNavigate();
  return (
    <>
      {" "}
      {uniqueNotes.map((note) => {
        return (
          <div
            key={note.id}
            className="flex flex-col gap-3"
            onClick={() => {
              // setSelectedNoteId(note.id);
              if (isTrashPage) {
                navigate(`/trash/note/${note.id}`);
              } else if (isFavoritesPage) {
                navigate(`/favorites/note/${note.id}`);
              } else if (isArchivedPage) {
                navigate(`/archived/note/${note.id}`);
              } else {
                navigate(`/folder/${note.folderId}/note/${note.id}`);
              }
            }}
          >
            <Card note={note} isActive={selectedNoteId === note.id} />
          </div>
        );
      })}
    </>
  );
};

export default NotesList;
