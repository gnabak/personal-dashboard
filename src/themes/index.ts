import type { Theme, ThemeId } from "./types";
import { terminalTheme } from "./terminal";
import { auroraTheme } from "./aurora";
import { meadowTheme } from "./meadow";
import { quartzTheme } from "./quartz";

export const THEMES: Record<ThemeId, Theme> = {
  terminal: terminalTheme,
  aurora: auroraTheme,
  meadow: meadowTheme,
  quartz: quartzTheme,
};

export const THEME_IDS: ThemeId[] = ["terminal", "aurora", "meadow", "quartz"];

export const DEFAULT_THEME_ID: ThemeId = "terminal";

export function getTheme(id: ThemeId): Theme {
  return THEMES[id] ?? THEMES[DEFAULT_THEME_ID];
}

export type { Theme, ThemeId } from "./types";
