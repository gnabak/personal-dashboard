import type { Theme, ThemeId } from "./types";
import { terminalTheme } from "./terminal";
import { auroraTheme } from "./aurora";
import { meadowTheme } from "./meadow";
import { quartzTheme } from "./quartz";
import { carnivalTheme } from "./carnival";
import { cirrusTheme } from "./cirrus";

export const THEMES: Record<ThemeId, Theme> = {
  terminal: terminalTheme,
  aurora: auroraTheme,
  cirrus: cirrusTheme,
  meadow: meadowTheme,
  quartz: quartzTheme,
  carnival: carnivalTheme,
};

export const THEME_IDS: ThemeId[] = [
  "terminal",
  "aurora",
  "cirrus",
  "meadow",
  "quartz",
  "carnival",
];

export const DEFAULT_THEME_ID: ThemeId = "terminal";

export function getTheme(id: ThemeId): Theme {
  return THEMES[id] ?? THEMES[DEFAULT_THEME_ID];
}

export type { Theme, ThemeId } from "./types";
