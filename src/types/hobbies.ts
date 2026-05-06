export interface Milestone {
  id: string;
  title: string;
  done: boolean;
  doneAt?: string;
  createdAt: string;
}

export interface Session {
  id: string;
  date: string;
  minutes: number;
  note?: string;
}

export interface Hobby {
  id: string;
  name: string;
  icon: string;
  accentColor: string;
  description?: string;
  milestones: Milestone[];
  sessions: Session[];
  createdAt: string;
}

export const HOBBY_COLORS: { name: string; value: string }[] = [
  { name: "Emerald", value: "#10b981" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Teal", value: "#14b8a6" },
];

export const HOBBY_ICONS = [
  "Music",
  "Guitar",
  "Palette",
  "Camera",
  "BookOpen",
  "Pen",
  "Code",
  "Dumbbell",
  "Bike",
  "Tent",
  "Gamepad2",
  "ChefHat",
  "Sprout",
  "Mountain",
  "Languages",
  "Sparkles",
] as const;
export type HobbyIconName = (typeof HOBBY_ICONS)[number];
