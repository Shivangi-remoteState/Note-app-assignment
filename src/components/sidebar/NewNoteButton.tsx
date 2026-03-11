import { Plus } from "lucide-react";

interface Props {
  onClick: () => void;
}

export default function NewNoteButton({ onClick }: Props) {
  return (
    <div
      className="flex justify-center gap-2 rounded-sm p-2 cursor-pointer hover:opacity-90 bg-(--color-newNoteBtnBg) text-(--color-textNewNoteBtn)"
      // className={`flex justify-center gap-2 rounded-sm p-2 cursor-pointer hover:opacity-90 ${
      //   theme === "dark" ? "bg-card text-white" : "bg-gray-300 text-black"
      // }`}
      onClick={onClick}
    >
      <Plus size={20} />
      <div className="font-name">New Note</div>
    </div>
  );
}
