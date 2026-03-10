import { FileText } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import type { RecentNote } from "../../types/api";

interface Props {
  recentNotes: RecentNote[];
}

const RecentNotes = ({ recentNotes }: Props) => {
  const navigate = useNavigate();
  const loaction = useLocation();
  const noteId = loaction.pathname.split("/note/")[1];
  console.log("noteid", noteId);
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm py-1 px-2 font-name">Recents</div>

      <div className="flex flex-col gap-1">
        {recentNotes.length === 0 && (
          <div className="text-xs px-2 text-(--color-400)">
            No recent notes available
          </div>
        )}

        {recentNotes.map((note) => (
          <div
            key={note.id}
            className={`flex gap-2 items-center font-name py-1 px-2 rounded cursor-pointer 
  ${noteId === note.id ? "bg-(--color-hoverFile)" : "hover:bg-(--color-hoverFile)"}
`}
            onClick={() => navigate(`/folder/${note.folderId}/note/${note.id}`)}
          >
            <FileText size={20} />
            <div className="text-sm truncate flex-1">
              {note.title || "Untitled"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentNotes;
