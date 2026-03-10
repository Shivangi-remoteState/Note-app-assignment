import { CalendarDays } from "lucide-react";
interface Props {
  isNewNote: boolean;
  createdAt?: string;
}
// formating date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

const NoteDate = ({ isNewNote, createdAt }: Props) => {
  return (
    <div className="flex items-center gap-18 border-b border-(--color-white-20) pb-6">
      <div className="flex items-center gap-2">
        <span>
          <CalendarDays size={16} className="text-(--color-text)" />
        </span>
        <span className="text-sm opacity-70 ">Date</span>
      </div>
      <span className="text-sm font-medium text-(--color-text)">
        <span className="font-medium">
          {isNewNote
            ? new Date().toDateString()
            : createdAt
              ? formatDate(createdAt)
              : ""}
        </span>
      </span>
    </div>
  );
};

export default NoteDate;
