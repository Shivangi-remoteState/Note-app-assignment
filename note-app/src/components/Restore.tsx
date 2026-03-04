import { api } from "@/api/axios";
import { RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Restore = ({ noteTitle, noteId }) => {
  const navigate = useNavigate();
  async function handleRestore() {
    try {
      await api.post(`/notes/${noteId}/restore`);
      alert("Note restored");
      navigate("/");
    } catch (error) {
      console.log("Error in restoring notes:", error);
    }
  }
  return (
    <div className="flex flex-col justify-center items-center h-full w-right gap-2">
      <div>
        <RotateCcw className="w-16 h-16 text-gray-300" strokeWidth={0.5} />
      </div>
      <h1 className="text-xl  font-semibold font-name text-restore">
        Restore “{noteTitle}”
      </h1>
      <p className="text-white/60 text-base font-name max-w-md text-center ">
        Don’t want to lose this note? It’s not too late! Just click the
        “Restore” button and it will be added back to your list. It’s that
        simple.
      </p>
      <button
        onClick={handleRestore}
        className="bg-indigo-600 hover:bg-indigo-500  px-6 py-2 rounded-md transition duration-200"
      >
        Restore
      </button>
    </div>
  );
};

export default Restore;
