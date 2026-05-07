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
  { name: "Green", value: "#55dc78" },
  { name: "Sky", value: "#5fc3f5" },
  { name: "Gold", value: "#f0c34b" },
  { name: "Orange", value: "#ffa537" },
  { name: "Red", value: "#ff6e64" },
  { name: "Sage", value: "#789b64" },
  { name: "Violet", value: "#b89cff" },
  { name: "Pink", value: "#f48cb1" },
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
