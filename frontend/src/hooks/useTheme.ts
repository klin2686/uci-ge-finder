import { useState, useEffect } from "react";

type Theme = "dark" | "light";

function getInitial(): Theme {
  const saved = localStorage.getItem("ge-theme") as Theme | null;
  if (saved === "dark" || saved === "light") return saved;
  return "dark";
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitial);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ge-theme", theme);
  }, [theme]);

  const toggle = () => setThemeState((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggle };
}
