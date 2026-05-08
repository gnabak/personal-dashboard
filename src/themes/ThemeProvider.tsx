import { useEffect, useMemo } from "react";
import { useThemeStore } from "@/store/theme";
import { getTheme, type Theme } from "./index";
import { ThemeContext } from "./context";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeId = useThemeStore((s) => s.themeId);
  const theme = useMemo(() => getTheme(themeId), [themeId]);

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

function applyThemeToDocument(theme: Theme) {
  const root = document.documentElement;
  // Color tokens
  const c = theme.colors;
  root.style.setProperty("--color-background", c.background);
  root.style.setProperty("--color-foreground", c.foreground);
  root.style.setProperty("--color-muted", c.muted);
  root.style.setProperty("--color-border", c.border);
  root.style.setProperty("--color-primary", c.primary);
  root.style.setProperty("--color-warm", c.warm);
  root.style.setProperty("--color-cool", c.cool);
  root.style.setProperty("--color-emphasis", c.emphasis);
  root.style.setProperty("--color-danger", c.danger);
  root.style.setProperty("--color-subtle", c.subtle);

  // Fonts
  root.style.setProperty("--font-sans", theme.fonts.sans);
  root.style.setProperty("--font-mono", theme.fonts.mono);
  root.style.setProperty("--font-display", theme.fonts.display);

  // Surface tokens
  root.style.setProperty("--radius-card", theme.surface.radius);
  root.style.setProperty("--card-bg", theme.surface.cardBg);
  root.style.setProperty("--card-border-color", theme.surface.cardBorder);
  root.style.setProperty("--card-shadow", theme.surface.cardShadow);
  root.style.setProperty(
    "--card-backdrop",
    theme.surface.cardBlur ? "blur(16px) saturate(140%)" : "none"
  );

  // Heading
  root.style.setProperty("--heading-weight", theme.surface.headingWeight);
  root.style.setProperty("--heading-tracking", theme.surface.headingTracking);

  // Marker attribute (for theme-scoped CSS like scanlines)
  root.setAttribute("data-theme", theme.id);
  // Tailwind .dark class — only for dark themes (so OS dark utilities don't fight us)
  root.classList.toggle("dark", !theme.isLight);
  root.classList.toggle("light", theme.isLight);
}
