import { Archive, Star, Trash } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const MoreSection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm px-2 font-bold">More</div>

      <div className="flex flex-col gap-1">
        <div
          className={`flex items-center gap-3 px-2 py-1 rounded cursor-pointer
          ${
            location.pathname === "/favorites"
              ? "bg-(--color-hoverFile)"
              : "hover:bg-(--color-hoverFile)"
          }`}
          onClick={() => navigate("/favorites")}
        >
          <span className="text-base">
            <Star size={16} />
          </span>
          <div className="text-sm">Favorites</div>
        </div>

        <div
          className={`flex items-center gap-3 px-2 py-1 rounded cursor-pointer
          ${
            location.pathname === "/trash"
              ? "bg-(--color-hoverFile)"
              : "hover:bg-(--color-hoverFile)"
          }`}
          onClick={() => navigate("/trash")}
        >
          <span className="text-base">
            <Trash size={16} />
          </span>
          <div className="text-sm">Trash</div>
        </div>

        <div
          className={`flex items-center gap-3 px-2 py-1 rounded cursor-pointer
          ${
            location.pathname === "/archived"
              ? "bg-(--color-hoverFile)"
              : "hover:bg-(--color-hoverFile)"
          }`}
          onClick={() => navigate("/archived")}
        >
          <span className="text-base">
            <Archive size={16} />
          </span>
          <div className="text-sm">Archived Notes</div>
        </div>
      </div>
    </div>
  );
};

export default MoreSection;
