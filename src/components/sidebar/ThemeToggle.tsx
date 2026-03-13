import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div onClick={toggleTheme}>
      {theme === "dark" ? (
        <div className="flex justify-center items-center gap-2 hover:text-[var(--color-blue-500)">
          <Sun size={18} className="text-yellow-500" />
          <span className="text-em font-name text-(--color-text)">
            Light Mode
          </span>
        </div>
      ) : (
        <div className="flex justify-center items-center gap-2 hover:text-[var(--color-blue-500)">
          <Moon size={18} className="text-blue-500" />
          <span className="text-em font-name text-(--color-text)">
            Dark Mode
          </span>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
