import { useState } from "react";
import NoteMenu from "./NoteMenu";
import { CalendarDays, Folder } from "lucide-react";

export default function Right() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="
        h-screen 
      
        p-10 
        text-title
        overflow-y-auto
        font-name 
      "
    >
      <div className="flex items-start justify-between py-8 relative">
        <h1 className="text-3xl font-semibold">
          Reflection on the Month of June
        </h1>

        <button onClick={() => setMenuOpen(!menuOpen)}>
          <img src="/images/Frame 1.svg" alt="menu icon" />
        </button>

        {menuOpen && <NoteMenu />}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-18 border-b border-white/20 pb-6">
          <div className="flex items-center gap-2">
            <span>
              {" "}
              <CalendarDays size={16} />
            </span>
            <span className="text-sm opacity-70">Date</span>
          </div>
          <span className="text-sm font-medium">21/06/2022</span>
        </div>

        <div className="flex items-center gap-18">
          <div className="flex items-center gap-2">
            <span>
              {" "}
              <Folder size={16} />
            </span>
            <span className="text-sm opacity-70">Folder</span>
          </div>
          <span className="text-sm font-medium">Personal</span>
        </div>
      </div>

      <div className="text-sm py-8">
        <p>
          Lo sit provident repellendus molestiae delectus odit cum neque ea
          totam saepe ad nesciunt, voluptatum veniam architecto libero nisi
          earum facere porro minus non mollitia culpa. Est, tempore quas! Iste,
          consequatur. Quae itaque corrupti quisquam ipsam quo minus inventore
          eligendi facere eos iste, ea rerum illum illo sapiente ducimus
          pariatur est maiores similique velit earum quis libero iure. Sapiente.
        </p>
      </div>
    </div>
  );
}
