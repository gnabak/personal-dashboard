import {
  Music,
  Guitar,
  Palette,
  Camera,
  BookOpen,
  Pen,
  Code,
  Dumbbell,
  Bike,
  Tent,
  Gamepad2,
  ChefHat,
  Sprout,
  Mountain,
  Languages,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { HobbyIconName } from "@/types/hobbies";

export const HOBBY_ICON_MAP: Record<HobbyIconName, LucideIcon> = {
  Music,
  Guitar,
  Palette,
  Camera,
  BookOpen,
  Pen,
  Code,
  Dumbbell,
  Bike,
  Tent,
  Gamepad2,
  ChefHat,
  Sprout,
  Mountain,
  Languages,
  Sparkles,
};

export function getHobbyIcon(name: string): LucideIcon {
  return (HOBBY_ICON_MAP as Record<string, LucideIcon>)[name] ?? Sparkles;
}
