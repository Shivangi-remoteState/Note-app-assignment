import { Sun, Moon } from "lucide-react";

interface Props {
  theme: string;
  toggleTheme: () => void;
}

const ThemeToggle = ({ theme, toggleTheme }: Props) => {
  return (
    <div onClick={toggleTheme}>
      {theme === "dark" ? (
        <div className="flex justify-center items-center gap-2 hover:opacity-65">
          <Sun size={18} className="text-yellow-500" />
          <span className="text-em font-name">Light Mode</span>
        </div>
      ) : (
        <div className="flex justify-center items-center gap-2 hover:opacity-65">
          <Moon size={18} className="text-blue-500" />
          <span className="text-em font-name">Dark Mode</span>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
