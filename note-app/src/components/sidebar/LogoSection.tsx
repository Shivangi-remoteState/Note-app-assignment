import { Search } from "lucide-react";
interface Props {
  theme: string;
  toggleSearch: () => void;
}

const LogoSection = ({ theme, toggleSearch }: Props) => {
  return (
    <div className="flex items-center justify-between ">
      <div className="flex items-center ">
        <img
          src="/images/Nowted.svg"
          className={`w-20 ${theme === "light" ? "brightness-0" : ""}`}
        />
        {/* <div className="font-nowted">Nowted</div> */}
        <img
          src="/images/Frame.svg"
          className={`w-3 ${theme === "light" ? "brightness-0" : ""}`}
        />
      </div>

      <button className="hover:opacity-80" onClick={toggleSearch}>
        <Search size={20} />
      </button>
    </div>
  );
};

export default LogoSection;
