import { createContext, useContext } from "react";
import { THEMES, DEFAULT_THEME_ID, type Theme } from "./index";

export const ThemeContext = createContext<Theme>(THEMES[DEFAULT_THEME_ID]);

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

/**
 * Apply theme casing to a string. Useful for nav labels, button text,
 * page titles where the theme's voice is lowercase vs sentence-case.
 */
export function useCased(value: string): string {
  const theme = useTheme();
  if (theme.voice.casing === "lower") return value.toLowerCase();
  if (theme.voice.casing === "sentence")
    return value.charAt(0).toUpperCase() + value.slice(1);
  return value;
}
