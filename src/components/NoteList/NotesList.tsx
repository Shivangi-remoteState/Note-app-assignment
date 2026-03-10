import Card from "./Card";
import { useNavigate } from "react-router-dom";
import type { Note } from "../../types/api";

interface Props {
  notes: Note[];
  isTrashPage: boolean;
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string) => void;
  lastNoteRef?: (node: HTMLDivElement | null) => void;
}
const NotesList = ({
  notes,
  isTrashPage,
  selectedNoteId,
  setSelectedNoteId,
  lastNoteRef,
}: Props) => {
  const navigate = useNavigate();
  return (
    <>
      {" "}
      {notes.map((note, index) => {
        const isLast = index === notes.length - 1;

        return (
          <div
            ref={isLast ? lastNoteRef : null}
            key={note.id}
            className="flex flex-col gap-3"
            onClick={() => {
              setSelectedNoteId(note.id);

              if (isTrashPage) {
                navigate(`/trash/note/${note.id}`);
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
