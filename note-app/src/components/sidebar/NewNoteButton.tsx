import { Plus } from "lucide-react";

interface Props {
  theme: string;
  onClick: () => void;
}

export default function NewNoteButton({ theme, onClick }: Props) {
  return (
    <div
      className={`flex justify-center gap-2 rounded-sm p-2 cursor-pointer hover:opacity-90 ${
        theme === "dark" ? "bg-card text-white" : "bg-gray-300 text-black"
      }`}
      onClick={onClick}
    >
      <Plus size={20} />
      <div className="font-name">New Note</div>
    </div>
  );
}
