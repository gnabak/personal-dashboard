import type { Theme } from "./types";

/**
 * Meadow — Ghibli / Stardew Valley. Cream paper background, soft greens
 * and sun yellow, hibiscus pink, terracotta accents. Serif headings.
 * Gentle, lowercase-optional voice with a pastoral flavor.
 */
export const meadowTheme: Theme = {
  id: "meadow",
  name: "Meadow",
  blurb: "Cream paper, soft greens, sun yellow. Ghibli / Stardew.",
  isLight: true,
  colors: {
    background: "247 238 217", // warm cream
    foreground: "60 47 35", // walnut brown
    muted: "236 222 196", // milky tea
    border: "200 175 140", // birch bark
    primary: "95 145 70", // forest green
    warm: "204 110 55", // terracotta
    cool: "130 175 200", // soft sky
    emphasis: "224 173 64", // sun yellow
    danger: "199 100 100", // hibiscus
    subtle: "138 115 85", // dry pine
  },
  fonts: {
    sans: "'Nunito', 'Quicksand', 'Inter', system-ui, sans-serif",
    mono: "'DM Mono', 'JetBrains Mono', ui-monospace, monospace",
    display:
      "'DM Serif Display', 'Cormorant Garamond', Georgia, serif",
  },
  surface: {
    radius: "1.25rem",
    cardBg: "rgb(255 250 235 / 0.8)",
    cardBorder: "rgb(var(--color-border) / 0.7)",
    cardShadow:
      "0 2px 0 rgba(120, 90, 50, 0.05), 0 8px 20px rgba(120, 90, 50, 0.08)",
    cardBlur: false,
    headingWeight: "400",
    headingTracking: "-0.005em",
  },
  voice: {
    casing: "as-is",
    promptPrefix: undefined,
    brandCursor: false,
    sectionPrefix: "✿",
  },
  copy: {
    brand: "Little Garden",
    tagline: "A small place to grow your goals.",
    nav: {
      overview: "Overview",
      travel: "Travel",
      hobbies: "Hobbies",
      finance: "Finance",
      meals: "Meals",
      reading: "Reading",
    },
    greeting: {
      morning: "Good morning, friend.",
      afternoon: "Good afternoon.",
      evening: "Evening, friend.",
      late: "Up late tending the garden?",
    },
    overview: {
      eyebrow: (date) => `${date} · a quiet check-in`,
      description: "A little place to look after the things you're growing.",
      sections: {
        hobbiesInProgress: "Things you're growing",
        travelPulse: "Places to wander",
        activity: "Today's harvest",
      },
      cards: {
        hobbies: "Pursuits",
        milestones: "Sprouts this month",
        logged: "Tended this week",
        trips: "Adventures planned",
      },
      actions: { export: "Save journal", import: "Restore journal" },
      links: { hobbies: "Visit garden", travel: "Open map" },
      emptyHints: {
        hobbies: { text: "Nothing growing yet.", cta: "Plant one" },
        travel: { text: "Nowhere on the horizon yet.", cta: "Dream up a trip" },
        activity:
          "Nothing in the harvest yet. Tend a milestone, log a session, or pin a place to wander — it'll show up here.",
      },
    },
    travel: {
      eyebrow: "Travel",
      title: "Places to wander",
      newTrip: "New journey",
      statusLabels: {
        wishlist: "Daydream",
        planned: "Planned",
        visited: "Wandered",
      },
      sectionLabels: { trips: "Journeys", destinations: "Pins" },
      mapHint: "Tap anywhere to drop a pin",
      emptyDestinations: "Tap anywhere on the map to mark a place.",
      filters: { all: "All" },
    },
    hobbies: {
      eyebrow: "Hobbies",
      title: "Things you're growing",
      description:
        "Tend a few small things. Mark sprouts as they bloom, log time, watch them flower.",
      newHobby: "New pursuit",
      emptyState: {
        title: "Plant something you'd like to grow",
        description:
          "A hobby is a quiet promise to yourself. Plant one and watch it sprout.",
        cta: "Plant your first pursuit",
      },
    },
    finance: {
      eyebrow: "Finance",
      title: "Coin purse & savings",
      description:
        "Note what comes in, what goes out, and what you're saving toward. Import a list if you've got one.",
      tabs: {
        overview: "Overview",
        transactions: "Transactions",
        investments: "Investments",
        goals: "Goals",
      },
      actions: {
        addAccount: "New purse",
        addTransaction: "Note a coin",
        importCsv: "Import list",
        addHolding: "Add to stockpile",
        addGoal: "Make a wish",
        refreshPrices: "Refresh prices",
      },
      fields: {
        netThisMonth: "Coins this month",
        spendingThisMonth: "Spent this month",
        incomeThisMonth: "Earned this month",
        portfolioValue: "Stockpile value",
        gainLoss: "Bloom / wilt",
      },
      emptyStates: {
        accounts: { text: "No purses yet.", cta: "Open one" },
        transactions: "No coins logged in this view.",
        holdings: "Stockpile is bare.",
        goals: "No wishes yet.",
      },
    },
    meals: {
      eyebrow: "Meals",
      title: "Cooking this week",
      description:
        "Keep recipes in a little book, plan the week, and a shopping list grows on its own.",
      tabs: { recipes: "Recipes", plans: "Plans", shopping: "Shopping" },
      actions: {
        newRecipe: "New recipe",
        newPlan: "Plan a week",
        clearChecked: "Untick all",
        copyList: "Copy list",
      },
      slots: {
        breakfast: "Breakfast",
        lunch: "Lunch",
        dinner: "Supper",
        snack: "Snack",
      },
      empty: {
        recipes: { text: "Recipe book is empty.", cta: "Write the first" },
        plans: { text: "No weeks planned.", cta: "Sketch a week" },
        shopping: "Pick a week to grow a shopping list.",
      },
    },
    reading: {
      eyebrow: "Reading",
      title: "What you're reading",
      description:
        "A little library of books underway, next-on-the-shelf, and finished.",
      tabs: { books: "Books", sessions: "Sessions", highlights: "Highlights" },
      statusLabels: {
        wishlist: "On the shelf",
        reading: "Reading",
        finished: "Finished",
        dropped: "Set aside",
      },
      actions: {
        newBook: "New book",
        logSession: "Note a sitting",
        addHighlight: "Save a line",
        markFinished: "Mark finished",
      },
      empty: {
        books: { text: "Shelves are bare.", cta: "Add a book" },
        sessions: "No sittings recorded yet.",
        highlights: "No lines saved yet.",
      },
    },
    footer: [
      "Your journal lives in this browser.",
      "Save it from Home to keep it safe.",
    ],
  },
};
