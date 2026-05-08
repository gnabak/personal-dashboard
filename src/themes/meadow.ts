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
      overview: "Home",
      travel: "Wanderings",
      hobbies: "Hobbies",
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
      eyebrow: "Wanderings",
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
      eyebrow: "Pursuits",
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
    footer: [
      "Your journal lives in this browser.",
      "Save it from Home to keep it safe.",
    ],
  },
};
