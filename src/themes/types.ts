/**
 * Theme definition. Each theme provides palette tokens, font stacks, surface
 * tokens, body decoration and copy strings. The active theme is applied at
 * runtime by ThemeProvider, which writes CSS variables to :root and sets
 * `data-theme` on <html>.
 */

export type ThemeId = "terminal" | "aurora" | "meadow" | "quartz";

/** RGB triplet "r g b" — consumed by Tailwind's `rgb(var(--color-x) / <alpha-value>)` */
export type Rgb = string;

export interface ThemeColors {
  background: Rgb;
  foreground: Rgb;
  muted: Rgb;
  border: Rgb;
  /** Primary accent — links, focus rings, success */
  primary: Rgb;
  /** Warm accent — orange-ish, used for tags / strong */
  warm: Rgb;
  /** Cool accent — sky/info */
  cool: Rgb;
  /** Emphasis — gold/heading */
  emphasis: Rgb;
  /** Destructive */
  danger: Rgb;
  /** Subtle text — muted comments */
  subtle: Rgb;
}

export interface ThemeFonts {
  sans: string;
  mono: string;
  display: string;
}

export interface ThemeSurface {
  /** Tailwind-friendly radius for cards (e.g. "0.5rem", "1rem") */
  radius: string;
  /** Background of regular cards (CSS color expression). Use rgb(var(--color-muted) / 0.x) for tinted, "transparent" for outline-only. */
  cardBg: string;
  /** Border color for cards (CSS color expression) */
  cardBorder: string;
  /** Shadow for cards (CSS box-shadow) */
  cardShadow: string;
  /** Whether cards apply a backdrop blur (true → frosted-glass surfaces) */
  cardBlur: boolean;
  /** Font weight for primary headings ("normal" | "600" | "700" | etc.) */
  headingWeight: string;
  /** CSS letter-spacing for headings */
  headingTracking: string;
}

export type Casing = "as-is" | "lower" | "sentence";

export interface ThemeVoice {
  /** Lowercase everything in titles/buttons/nav? */
  casing: Casing;
  /** Optional prefix shown before brand title in sidebar (e.g. "$ ") */
  promptPrefix?: string;
  /** Show a blinking cursor next to the brand */
  brandCursor?: boolean;
  /** Optional symbol prefixed to section h2s in Overview */
  sectionPrefix?: string;
}

export interface ThemeCopy {
  brand: string;
  tagline: string;

  nav: { overview: string; travel: string; hobbies: string; finance: string };

  greeting: {
    morning: string;
    afternoon: string;
    evening: string;
    late: string;
  };

  overview: {
    eyebrow: (date: string, time: string) => string;
    description: string;
    sections: {
      hobbiesInProgress: string;
      travelPulse: string;
      activity: string;
    };
    cards: {
      hobbies: string;
      milestones: string;
      logged: string;
      trips: string;
    };
    actions: { export: string; import: string };
    links: { hobbies: string; travel: string };
    emptyHints: {
      hobbies: { text: string; cta: string };
      travel: { text: string; cta: string };
      activity: string;
    };
  };

  travel: {
    eyebrow: string;
    title: string;
    newTrip: string;
    statusLabels: { wishlist: string; planned: string; visited: string };
    sectionLabels: { trips: string; destinations: string };
    mapHint: string;
    emptyDestinations: string;
    filters: { all: string };
  };

  hobbies: {
    eyebrow: string;
    title: string;
    description: string;
    newHobby: string;
    emptyState: { title: string; description: string; cta: string };
  };

  finance: {
    eyebrow: string;
    title: string;
    description: string;
    tabs: {
      overview: string;
      transactions: string;
      investments: string;
      goals: string;
    };
    actions: {
      addAccount: string;
      addTransaction: string;
      importCsv: string;
      addHolding: string;
      addGoal: string;
      refreshPrices: string;
    };
    fields: {
      netThisMonth: string;
      spendingThisMonth: string;
      incomeThisMonth: string;
      portfolioValue: string;
      gainLoss: string;
    };
    emptyStates: {
      accounts: { text: string; cta: string };
      transactions: string;
      holdings: string;
      goals: string;
    };
  };

  /** Sidebar footer / fine print, two short lines */
  footer: [string, string];
}

export interface Theme {
  id: ThemeId;
  name: string;
  /** Short blurb shown in the theme picker */
  blurb: string;
  /** Whether this is a light theme (purely informational; doesn't toggle Tailwind dark:) */
  isLight: boolean;
  colors: ThemeColors;
  fonts: ThemeFonts;
  surface: ThemeSurface;
  voice: ThemeVoice;
  copy: ThemeCopy;
}
