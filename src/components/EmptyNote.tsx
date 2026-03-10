import { FileText } from "lucide-react";

export default function EmptyNote() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-right text-gray-300 bg-(--color-sidebar)">
      <FileText size={67} className=" text-gray-500 opacity-80" />

      <h1 className="text-2xl font-semibold text-(--color-text) pt-4">
        Select a note to view
      </h1>

      <p className="text-center text-gray-400 max-w-md py-2">
        Choose a note from the list on the left to view its contents, or create
        a new note to add to your collection.
      </p>
    </div>
  );
}
