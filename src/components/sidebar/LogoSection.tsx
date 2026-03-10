import { Search } from "lucide-react";
interface Props {
  toggleSearch: () => void;
}

const LogoSection = ({ toggleSearch }: Props) => {
  return (
    <div className="flex items-center justify-between ">
      <div className="flex items-center">
        <img
          src="/images/Nowted.svg"
          alt="Nowted"
          className="w-20 logo"
          // className={`w-20 ${theme === "light" ? "brightness-0" : ""}`}
        />
        {/* <div className="font-nowted">Nowted</div> */}
        <img
          src="/images/NowtedPencil.svg"
          alt="notePencil"
          className="w-3 logo"
          // className={`w-3 ${theme === "light" ? "brightness-0" : ""}`}
        />
      </div>

      <button className="hover:opacity-80" onClick={toggleSearch}>
        <Search size={20} />
      </button>
    </div>
  );
};

export default LogoSection;
