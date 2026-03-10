import { FileText } from "lucide-react";

export default function EmptyNote() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-right text-[var(--color-gray-300)] bg-[var(--color-sidebar)]">
      <FileText
        size={67}
        className=" text-[var(--color-gray-500)] opacity-80"
      />

      <h1 className="text-2xl font-semibold text-[var(--color-text)] pt-4">
        Select a note to view
      </h1>

      <p className="text-center text-[var(--color-gray-400)] max-w-md py-2">
        Choose a note from the list on the left to view its contents, or create
        a new note to add to your collection.
      </p>
    </div>
  );
}
