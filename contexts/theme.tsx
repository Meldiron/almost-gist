import { CssBaseline, GeistProvider } from "@geist-ui/core";
import { createContext, useEffect, useState } from "react";

// true if dark
const ThemeContext = createContext<any>([true, () => {}]);

export const ThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("theme") === null) {
      localStorage.setItem("theme", "dark");
    }

    const theme = localStorage.getItem("theme") ?? "dark";

    setTheme(theme === "dark");
  });

  const customSetTheme = (isDark: boolean) => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setTheme(isDark);
  };

  return (
    <ThemeContext.Provider value={[theme, customSetTheme]}>
      <GeistProvider themeType={theme ? "dark" : "light"}>
        <CssBaseline />
        {children}
      </GeistProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
