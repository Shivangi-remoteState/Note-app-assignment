import type { Note } from "@/types/api";

interface Props {
  note: Note;
  isActive: boolean;
}

export default function NoteItem({ note, isActive }: Props) {
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  return (
    <div
      className={`
        w-full p-4 border border-(--color-borderWhite5) cursor-pointer 
        bg-(--color-card) font-name rounded-lg
        ${isActive ? "bg-(--color-hoverFile) border-blue-500" : "hover:bg-(--color-hoverFile)"}
      `}
    >
      <h1 className="text-title text-xl text-text font-semibold truncate">
        {note.title}
      </h1>
      <div className="text-(--color-white-60) flex items-center gap-8 pt-1">
        <span className="text-title text-light">
          {formatDate(note.createdAt)}
        </span>
        <p className="text-sm text-(--color-white-60) font-semibold truncate">
          {note.preview}
        </p>
      </div>
    </div>
  );
}
