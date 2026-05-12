import type { Theme } from "./types";

/**
 * Aurora — Apple-like. Light, frosted glass, polished sentence-case voice.
 * Uses Apple's system blue/green/orange/pink as accents; SF-style font stack
 * with Inter as the loaded fallback.
 */
export const auroraTheme: Theme = {
  id: "aurora",
  name: "Aurora",
  blurb: "Light, frosted glass, polished. Apple-like.",
  isLight: true,
  colors: {
    background: "246 246 251",
    foreground: "17 17 28",
    muted: "255 255 255",
    border: "220 220 230",
    primary: "0 122 255", // system blue
    warm: "255 149 0", // system orange
    cool: "88 86 214", // system indigo
    emphasis: "52 199 89", // system green
    danger: "255 59 48", // system red
    subtle: "120 120 138",
  },
  fonts: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
    mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
    display:
      "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif",
  },
  surface: {
    radius: "1rem",
    cardBg: "rgb(255 255 255 / 0.7)",
    cardBorder: "rgb(var(--color-border) / 0.7)",
    cardShadow:
      "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06)",
    cardBlur: true,
    headingWeight: "600",
    headingTracking: "-0.02em",
  },
  voice: {
    casing: "sentence",
    promptPrefix: undefined,
    brandCursor: false,
    sectionPrefix: undefined,
  },
  copy: {
    brand: "Dashboard",
    tagline: "Personal goals, beautifully tracked.",
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
      evening: "Good evening.",
      late: "Working late?",
    },
    overview: {
      eyebrow: (date) => `Today · ${date}`,
      description: "A clear view of what matters right now.",
      sections: {
        hobbiesInProgress: "Hobbies in progress",
        travelPulse: "Travel pulse",
        activity: "Recent activity",
      },
      cards: {
        hobbies: "Active hobbies",
        milestones: "Milestones this month",
        logged: "Logged this week",
        trips: "Trips planned",
      },
      actions: { export: "Export", import: "Import" },
      links: { hobbies: "View all", travel: "Open map" },
      emptyHints: {
        hobbies: { text: "No hobbies yet.", cta: "Add one" },
        travel: { text: "No trips or pins yet.", cta: "Plan one" },
        activity:
          "Nothing here yet. Complete a milestone, log a session, or pin a destination — it'll show up here.",
      },
    },
    travel: {
      eyebrow: "Travel",
      title: "Where you're going",
      newTrip: "New trip",
      statusLabels: { wishlist: "Wishlist", planned: "Planned", visited: "Visited" },
      sectionLabels: { trips: "Trips", destinations: "Destinations" },
      mapHint: "Tap anywhere to add a pin",
      emptyDestinations: "Tap anywhere on the map to drop a pin.",
      filters: { all: "All" },
    },
    hobbies: {
      eyebrow: "Hobbies & projects",
      title: "Things you're working on",
      description: "Track milestones, log time, and see your progress over time.",
      newHobby: "New hobby",
      emptyState: {
        title: "Pick something to get good at",
        description:
          "A hobby is a goal you've decided is fun. Add one to start tracking milestones and time.",
        cta: "Add your first hobby",
      },
    },
    finance: {
      eyebrow: "Finance",
      title: "Money in & out",
      description:
        "Track spending, hold positions, plan toward goals. Import a CSV when convenient.",
      tabs: {
        overview: "Overview",
        transactions: "Transactions",
        investments: "Investments",
        goals: "Goals",
      },
      actions: {
        addAccount: "New account",
        addTransaction: "Add transaction",
        importCsv: "Import CSV",
        addHolding: "Add holding",
        addGoal: "New goal",
        refreshPrices: "Refresh prices",
      },
      fields: {
        netThisMonth: "Net this month",
        spendingThisMonth: "Spent this month",
        incomeThisMonth: "Earned this month",
        portfolioValue: "Portfolio value",
        gainLoss: "Gain / Loss",
      },
      emptyStates: {
        accounts: { text: "No accounts yet.", cta: "Add one" },
        transactions: "No transactions in this view.",
        holdings: "No holdings tracked yet.",
        goals: "No finance goals yet.",
      },
    },
    meals: {
      eyebrow: "Meals",
      title: "What you're eating this week",
      description: "Save recipes, plan the week, generate a shopping list.",
      tabs: { recipes: "Recipes", plans: "Plans", shopping: "Shopping list" },
      actions: {
        newRecipe: "New recipe",
        newPlan: "New plan",
        clearChecked: "Uncheck all",
        copyList: "Copy list",
      },
      slots: {
        breakfast: "Breakfast",
        lunch: "Lunch",
        dinner: "Dinner",
        snack: "Snack",
      },
      empty: {
        recipes: { text: "No recipes yet.", cta: "Add one" },
        plans: { text: "No plans yet.", cta: "Draft a week" },
        shopping: "Pick a plan to generate a shopping list.",
      },
    },
    reading: {
      eyebrow: "Reading",
      title: "What you're reading",
      description:
        "Shelves, sessions, highlights — everything you're working through.",
      tabs: { books: "Books", sessions: "Sessions", highlights: "Highlights" },
      statusLabels: {
        wishlist: "Wishlist",
        reading: "Reading",
        finished: "Finished",
        dropped: "Dropped",
      },
      actions: {
        newBook: "New book",
        logSession: "Log session",
        addHighlight: "Add highlight",
        markFinished: "Mark finished",
      },
      empty: {
        books: { text: "No books yet.", cta: "Add one" },
        sessions: "No reading sessions yet.",
        highlights: "No highlights captured yet.",
      },
    },
    footer: [
      "Your data lives in this browser.",
      "Export from Overview to back up.",
    ],
  },
};
