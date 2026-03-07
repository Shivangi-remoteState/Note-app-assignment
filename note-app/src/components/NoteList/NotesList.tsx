import Card from "./Card";
import { useNavigate } from "react-router-dom";
import type { Note } from "../../types/api";

interface Props {
  notes: Note[];
  isTrashPage: boolean;
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string) => void;
}
const NotesList = ({
  notes,
  isTrashPage,
  selectedNoteId,
  setSelectedNoteId,
}: Props) => {
  const navigate = useNavigate();
  return (
    <>
      {" "}
      {notes.map((note) => (
        <div
          key={note.id}
          className="flex flex-col gap-3 "
          onClick={() => {
            setSelectedNoteId(note.id);
            if (isTrashPage) {
              navigate(`/trash/note/${note.id}`);
            } else {
              navigate(`/folder/${note.folderId}/note/${note.id}`);
            }
          }}
        >
          <Card
            id={note.id}
            title={note.title}
            date={note.createdAt}
            preview={note.preview}
            isActive={selectedNoteId === note.id}
          />
        </div>
      ))}
    </>
  );
};

export default NotesList;
