"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type ColorThemeContextType = {
  colorTheme: string;
  setColorTheme: (theme: string) => void;
};

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined);

export function ColorThemeProvider({ children }: { children: ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("color-theme");
      if (saved === "basil" || saved === "forest" || saved === "sunny") {
        return saved;
      }
    }
    return "sunny";
  });

  const setColorTheme = (theme: string) => {
    setColorThemeState(theme);
    if (typeof window !== "undefined") {
      localStorage.setItem("color-theme", theme);
    }
  };

  return (
    <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      {children}
    </ColorThemeContext.Provider>
  );
}

export function useColorTheme() {
  const context = useContext(ColorThemeContext);
  if (!context) {
    throw new Error("useColorTheme must be used within ColorThemeProvider");
  }
  return context;
}
