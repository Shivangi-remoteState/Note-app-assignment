
import { Star, Archive, Trash2 } from "lucide-react";
const NoteMenu = () => {
  return (
    <div
      className="
        absolute right-0 top-14
        bg-noteMenu
        rounded
        p-3
        z-50
      "
    >
      <div className="border-b border-white/20 pb-2"><button className="flex items-center gap-3 px-3 py-2 ">
        <Star size={16} /> Add to Favourites
      </button>

      <button className="flex items-center gap-3 px-3 py-2 ">
        <Archive size={16} /> Archived
      </button></div>

      <button className="flex items-center gap-3 px-3 py-2  ">
        <Trash2 size={16} /> Delete
      </button>
    </div>
  )
}

export default NoteMenu
