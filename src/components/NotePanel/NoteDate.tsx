import { CalendarDays } from "lucide-react";
interface Props {
  isNewNote: boolean;
  createdAt?: string;
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
          {isNewNote ? new Date().toDateString() : createdAt ? createdAt : ""}
        </span>
      </span>
    </div>
  );
};

export default NoteDate;
