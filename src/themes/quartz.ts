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
    nav: {
      overview: "Overview",
      travel: "Travel",
      hobbies: "Hobbies",
      finance: "Finance",
      meals: "Meals",
      reading: "Reading",
    },
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
        travelPulse: "Travel",
        activity: "Trade log",
      },
      cards: {
        hobbies: "Open positions",
        milestones: "Closed this month",
        logged: "Time deployed",
        trips: "Trips planned",
      },
      actions: { export: "Export book", import: "Import book" },
      links: { hobbies: "View positions", travel: "Open map" },
      emptyHints: {
        hobbies: { text: "No open positions.", cta: "Open one" },
        travel: { text: "No trips yet.", cta: "Plan one" },
        activity:
          "No entries yet. Close a milestone, log a session, or pin a destination — entries land here.",
      },
    },
    travel: {
      eyebrow: "Travel",
      title: "Where you're going",
      newTrip: "New trip",
      statusLabels: {
        wishlist: "Wishlist",
        planned: "Planned",
        visited: "Visited",
      },
      sectionLabels: { trips: "Trips", destinations: "Destinations" },
      mapHint: "Click anywhere to add a pin",
      emptyDestinations: "Click anywhere on the map to drop a pin.",
      filters: { all: "All" },
    },
    hobbies: {
      eyebrow: "Hobbies",
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
    finance: {
      eyebrow: "Finance",
      title: "Portfolio & cash flow",
      description:
        "Cash in, cash out, positions held. Import statements when you have them.",
      tabs: {
        overview: "Overview",
        transactions: "Transactions",
        investments: "Positions",
        goals: "Mandates",
      },
      actions: {
        addAccount: "New account",
        addTransaction: "New entry",
        importCsv: "Import statement",
        addHolding: "Open position",
        addGoal: "New mandate",
        refreshPrices: "Refresh marks",
      },
      fields: {
        netThisMonth: "Net P&L this month",
        spendingThisMonth: "Cash out",
        incomeThisMonth: "Cash in",
        portfolioValue: "Mark-to-market",
        gainLoss: "Unrealized P&L",
      },
      emptyStates: {
        accounts: { text: "No accounts on the books.", cta: "Open one" },
        transactions: "No entries in this view.",
        holdings: "No open positions.",
        goals: "No active mandates.",
      },
    },
    meals: {
      eyebrow: "Meals",
      title: "Inventory & consumption",
      description:
        "Recipes catalogued, plan the week, shopping list aggregated.",
      tabs: { recipes: "Recipes", plans: "Plans", shopping: "Shopping" },
      actions: {
        newRecipe: "New entry",
        newPlan: "New schedule",
        clearChecked: "Reset",
        copyList: "Copy manifest",
      },
      slots: {
        breakfast: "Morning",
        lunch: "Midday",
        dinner: "Evening",
        snack: "Snack",
      },
      empty: {
        recipes: { text: "Catalogue is empty.", cta: "Add an entry" },
        plans: { text: "No active schedules.", cta: "Open a schedule" },
        shopping: "Select a schedule to compile a manifest.",
      },
    },
    reading: {
      eyebrow: "Reading",
      title: "Active titles",
      description: "Books in motion, queue depth, finished volume.",
      tabs: { books: "Books", sessions: "Sessions", highlights: "Highlights" },
      statusLabels: {
        wishlist: "Watchlist",
        reading: "Open",
        finished: "Closed",
        dropped: "Cut",
      },
      actions: {
        newBook: "New title",
        logSession: "Log session",
        addHighlight: "Add highlight",
        markFinished: "Close position",
      },
      empty: {
        books: { text: "No titles on the books.", cta: "Open one" },
        sessions: "No sessions logged.",
        highlights: "No highlights flagged.",
      },
    },
    footer: [
      "Book stored locally in this browser.",
      "Export regularly to preserve your record.",
    ],
  },
};
