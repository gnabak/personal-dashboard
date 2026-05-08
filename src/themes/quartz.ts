import type { Theme } from "./types";

/**
 * Quartz — Finance. Deep navy, emerald (positive) and rose (negative),
 * gold and amber accents. Tabular-friendly Inter + JetBrains Mono.
 * Voice borrowed from trading desks: portfolio, positions, capital.
 */
export const quartzTheme: Theme = {
  id: "quartz",
  name: "Quartz",
  blurb: "Deep navy, emerald & rose. Trading-desk professional.",
  isLight: false,
  colors: {
    background: "8 14 24", // deep navy
    foreground: "230 236 246", // cool white
    muted: "18 26 40", // ink
    border: "36 50 70", // steel
    primary: "16 185 129", // emerald (gain)
    warm: "245 158 11", // amber
    cool: "59 130 246", // azure
    emphasis: "234 179 8", // gold
    danger: "244 63 94", // rose (loss)
    subtle: "148 163 184", // slate
  },
  fonts: {
    sans: "'Inter', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
    display: "'Inter', system-ui, sans-serif",
  },
  surface: {
    radius: "0.5rem",
    cardBg: "rgb(var(--color-muted) / 0.7)",
    cardBorder: "rgb(var(--color-border))",
    cardShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
    cardBlur: false,
    headingWeight: "600",
    headingTracking: "-0.015em",
  },
  voice: {
    casing: "as-is",
    promptPrefix: undefined,
    brandCursor: false,
    sectionPrefix: undefined,
  },
  copy: {
    brand: "Portfolio",
    tagline: "Personal goals, run like a desk.",
    nav: { overview: "Dashboard", travel: "Markets", hobbies: "Positions" },
    greeting: {
      morning: "Good morning.",
      afternoon: "Good afternoon.",
      evening: "Markets are closed.",
      late: "After hours.",
    },
    overview: {
      eyebrow: (date, time) => `Session · ${date} · ${time}`,
      description: "Real-time view of your personal portfolio.",
      sections: {
        hobbiesInProgress: "Active positions",
        travelPulse: "Watchlist",
        activity: "Trade log",
      },
      cards: {
        hobbies: "Open positions",
        milestones: "Closed this month",
        logged: "Time deployed",
        trips: "Watchlist size",
      },
      actions: { export: "Export book", import: "Import book" },
      links: { hobbies: "View positions", travel: "View watchlist" },
      emptyHints: {
        hobbies: { text: "No open positions.", cta: "Open one" },
        travel: { text: "Watchlist is empty.", cta: "Add an item" },
        activity:
          "No trades yet. Close a milestone, log a session, or pin a destination — entries land here.",
      },
    },
    travel: {
      eyebrow: "Markets",
      title: "Watchlist",
      newTrip: "New basket",
      statusLabels: {
        wishlist: "Watching",
        planned: "Open",
        visited: "Closed",
      },
      sectionLabels: { trips: "Baskets", destinations: "Tickers" },
      mapHint: "Click anywhere to add a ticker",
      emptyDestinations: "Click anywhere on the map to add a ticker.",
      filters: { all: "All" },
    },
    hobbies: {
      eyebrow: "Positions",
      title: "Active positions",
      description:
        "Track each position's milestones and time deployed. Close them as they bloom.",
      newHobby: "New position",
      emptyState: {
        title: "Open your first position",
        description:
          "A position is anything you're putting time and intention into. Open one to begin tracking.",
        cta: "Open a position",
      },
    },
    footer: [
      "Book stored locally in this browser.",
      "Export regularly to preserve your record.",
    ],
  },
};
