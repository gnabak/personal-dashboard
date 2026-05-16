import type { Theme } from "./types";

/**
 * Carnival — playful, vivid, multi-accent. Deep purple-black background
 * with saturated cyan / pink / yellow / lime accents. Rounded corners,
 * confetti dot decoration. Sentence-case voice with a touch of fun.
 */
export const carnivalTheme: Theme = {
  id: "carnival",
  name: "Carnival",
  blurb: "Vivid pinks, cyans, yellows, limes. Playful and loud.",
  isLight: false,
  colors: {
    background: "25 15 40", // deep grape
    foreground: "245 240 230", // warm cream
    muted: "40 25 60", // mulled wine
    border: "95 60 130", // raspberry
    primary: "100 230 255", // cyan
    warm: "255 100 180", // hot pink
    cool: "255 220 90", // sunshine yellow
    emphasis: "180 255 100", // lime
    danger: "255 90 80", // tangerine
    subtle: "190 160 220", // soft lavender
  },
  fonts: {
    sans: "'Nunito', 'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    display: "'Nunito', 'Inter', system-ui, sans-serif",
  },
  surface: {
    radius: "1.25rem",
    cardBg: "rgb(var(--color-muted) / 0.7)",
    cardBorder: "rgb(var(--color-border) / 0.7)",
    cardShadow: "0 6px 24px rgba(180, 50, 220, 0.18)",
    cardBlur: false,
    headingWeight: "700",
    headingTracking: "-0.02em",
  },
  voice: {
    casing: "as-is",
    promptPrefix: undefined,
    brandCursor: false,
    sectionPrefix: "★",
  },
  copy: {
    brand: "Dashboard",
    tagline: "Personal goals with the volume up.",
    nav: {
      overview: "Overview",
      travel: "Travel",
      hobbies: "Hobbies",
      finance: "Finance",
      meals: "Meals",
      reading: "Reading",
    },
    greeting: {
      morning: "Morning! Let's go.",
      afternoon: "Afternoon hustle.",
      evening: "Evening glow.",
      late: "Burning the candle?",
    },
    overview: {
      eyebrow: (date) => `Today · ${date}`,
      description: "Everything you're chasing, all in one bright place.",
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
        hobbies: { text: "No hobbies yet — let's fix that.", cta: "Add one" },
        travel: { text: "Nothing on the map yet.", cta: "Pin a place" },
        activity:
          "Nothing here yet. Complete a milestone, log a session, or drop a pin and it'll show up here.",
      },
    },
    travel: {
      eyebrow: "Travel",
      title: "Where you're going",
      newTrip: "New trip",
      statusLabels: { wishlist: "Wishlist", planned: "Planned", visited: "Visited" },
      sectionLabels: { trips: "Trips", destinations: "Destinations" },
      mapHint: "Tap anywhere to drop a pin",
      emptyDestinations: "Tap anywhere on the map to drop a pin.",
      filters: { all: "All" },
    },
    hobbies: {
      eyebrow: "Hobbies",
      title: "Things you're working on",
      description: "Pick a craft. Stack tiny wins. Watch the bar go up.",
      newHobby: "New hobby",
      emptyState: {
        title: "Pick something to get good at",
        description:
          "A hobby is just a goal you've decided is fun. Add one to start tracking milestones and time.",
        cta: "Add your first hobby",
      },
    },
    finance: {
      eyebrow: "Finance",
      title: "Money in & out",
      description:
        "Track spending, hold positions, plan toward goals. Import a CSV when you have one.",
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
      description: "Save recipes, plan the week, get a shopping list.",
      tabs: { recipes: "Recipes", plans: "Plans", shopping: "Shopping" },
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
      description: "Stack the wins — finish one, start two.",
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
        books: { text: "No books yet — let's fix that.", cta: "Add one" },
        sessions: "No sessions logged yet.",
        highlights: "No highlights captured yet.",
      },
    },
    footer: [
      "Your data lives in this browser.",
      "Export from Overview to back up.",
    ],
  },
};
