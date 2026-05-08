import type { Theme } from "./types";

export const terminalTheme: Theme = {
  id: "terminal",
  name: "Terminal",
  blurb: "warm summer terminal. mono prompt, scanlines, CRT vignette.",
  isLight: false,
  colors: {
    background: "15 15 22",
    foreground: "225 218 200",
    muted: "25 25 35",
    border: "50 50 60",
    primary: "85 220 120",
    warm: "255 165 55",
    cool: "95 195 245",
    emphasis: "240 195 75",
    danger: "255 110 100",
    subtle: "120 155 100",
  },
  fonts: {
    sans: "Inter, ui-sans-serif, system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
    display: "'JetBrains Mono', ui-monospace, monospace",
  },
  surface: {
    radius: "0.5rem",
    cardBg: "transparent",
    cardBorder: "rgb(var(--color-border))",
    cardShadow: "none",
    cardBlur: false,
    headingWeight: "700",
    headingTracking: "-0.01em",
  },
  voice: {
    casing: "lower",
    promptPrefix: "$ ",
    brandCursor: true,
    sectionPrefix: "$ ",
  },
  copy: {
    brand: "~/dashboard",
    tagline: "// data persists in this browser",
    nav: { overview: "overview", travel: "travel", hobbies: "hobbies" },
    greeting: {
      morning: "good morning.",
      afternoon: "good afternoon.",
      evening: "good evening.",
      late: "burning the midnight oil.",
    },
    overview: {
      eyebrow: (date, time) =>
        `last login: ${date.toLowerCase()} ${time.toLowerCase()}`,
      description: "a bird's-eye view of what you're chasing right now.",
      sections: {
        hobbiesInProgress: "./hobbies-in-progress",
        travelPulse: "./travel-pulse",
        activity: "tail -n 12 activity.log",
      },
      cards: {
        hobbies: "active hobbies",
        milestones: "milestones this month",
        logged: "logged this week",
        trips: "trips planned",
      },
      actions: { export: "export", import: "import" },
      links: { hobbies: "cd ~/hobbies", travel: "cd ~/travel" },
      emptyHints: {
        hobbies: { text: "// no hobbies yet.", cta: "add one" },
        travel: { text: "// no trips or pins yet.", cta: "plan one" },
        activity:
          "// nothing here yet. complete a milestone, log a session, or pin a destination — it'll show up here.",
      },
    },
    travel: {
      eyebrow: "ls ~/travel",
      title: "where you're going",
      newTrip: "trip",
      statusLabels: { wishlist: "wishlist", planned: "planned", visited: "visited" },
      sectionLabels: { trips: "trips", destinations: "destinations" },
      mapHint: "click anywhere to drop a pin",
      emptyDestinations: "// click anywhere on the map to drop a pin",
      filters: { all: "all" },
    },
    hobbies: {
      eyebrow: "ls ~/hobbies",
      title: "things you're working on",
      description: "track milestones, log time, watch yourself level up week by week.",
      newHobby: "new hobby",
      emptyState: {
        title: "pick something to get good at",
        description:
          "// a hobby is just a goal you've decided is fun. add one and start tracking milestones and time.",
        cta: "add your first hobby",
      },
    },
    footer: [
      "// data persists in this browser",
      "// use export to back up",
    ],
  },
};
