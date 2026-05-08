import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DEFAULT_THEME_ID, type ThemeId } from "@/themes";

interface ThemeState {
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeId: DEFAULT_THEME_ID,
      setTheme: (id) => set({ themeId: id }),
    }),
    {
      name: "pd.theme.v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
