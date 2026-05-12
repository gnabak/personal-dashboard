import type { Theme } from "./types";

/**
 * Cirrus — clear blue sky. Light theme with airy pale-blue background,
 * soft cloud highlights, true sky-blue links and a warm sun-yellow
 * emphasis. Big rounded surfaces, soft cloud-like shadows.
 */
export const cirrusTheme: Theme = {
  id: "cirrus",
  name: "Cirrus",
  blurb: "Clear sky. Pale blue, sun yellow, cloud-soft shadows.",
  isLight: true,
  colors: {
    background: "232 244 255", // pale sky
    foreground: "20 35 60", // deep ocean ink
    muted: "245 250 255", // brightest cloud
    border: "195 215 235", // cloud edge
    primary: "30 130 220", // true sky blue
    warm: "250 190 70", // sun
    cool: "120 200 220", // teal cloud
    emphasis: "40 90 180", // rich blue (headings)
    danger: "235 100 100", // sunset coral
    subtle: "120 150 185", // overcast gray
  },
  fonts: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    display:
      "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  surface: {
    radius: "1rem",
    cardBg: "rgb(255 255 255 / 0.7)",
    cardBorder: "rgb(var(--color-border) / 0.7)",
    cardShadow:
      "0 1px 2px rgba(40, 90, 180, 0.05), 0 12px 30px rgba(40, 90, 180, 0.08)",
    cardBlur: true,
    headingWeight: "600",
    headingTracking: "-0.02em",
  },
  voice: {
    casing: "as-is",
    promptPrefix: undefined,
    brandCursor: false,
    sectionPrefix: undefined,
  },
  copy: {
    brand: "Dashboard",
    tagline: "Personal goals, with room to breathe.",
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
      description: "A wide-open view of what you're working toward.",
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
      eyebrow: "Hobbies",
      title: "Things you're working on",
      description: "Track milestones, log time, watch your progress over time.",
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
      description:
        "A clear view of every shelf — what's open, what's next, what's done.",
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
