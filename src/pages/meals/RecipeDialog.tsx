import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/Dialog";
import { Input, Textarea } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { useMealsStore } from "@/store/meals";
import { RECIPE_COLORS } from "@/types/meals";
import type { RecipeIngredient } from "@/types/meals";
import { UNITS, type Unit } from "@/lib/units";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { nanoid } from "nanoid";

interface RecipeDialogProps {
  open: boolean;
  recipeId: string | null;
  onOpenChange: (o: boolean) => void;
}

const EMPTY_INGREDIENT = (): RecipeIngredient => ({
  id: nanoid(),
  name: "",
  amount: 0,
  unit: "g" as Unit,
});

export function RecipeDialog({ open, recipeId, onOpenChange }: RecipeDialogProps) {
  const recipes = useMealsStore((s) => s.recipes);
  const addRecipe = useMealsStore((s) => s.addRecipe);
  const updateRecipe = useMealsStore((s) => s.updateRecipe);
  const deleteRecipe = useMealsStore((s) => s.deleteRecipe);
  const existing = recipeId ? recipes.find((r) => r.id === recipeId) : null;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [servings, setServings] = useState("2");
  const [totalMinutes, setTotalMinutes] = useState("");
  const [tags, setTags] = useState("");
  const [steps, setSteps] = useState("");
  const [color, setColor] = useState(RECIPE_COLORS[0]);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([
    EMPTY_INGREDIENT(),
  ]);

  useEffect(() => {
    if (!open) return;
    if (existing) {
      setName(existing.name);
      setDescription(existing.description ?? "");
      setServings(String(existing.servings));
      setTotalMinutes(
        existing.totalMinutes != null ? String(existing.totalMinutes) : ""
      );
      setTags(existing.tags.join(", "));
      setSteps(existing.steps ?? "");
      setColor(existing.color);
      setIngredients(
        existing.ingredients.length > 0
          ? existing.ingredients.map((i) => ({ ...i }))
          : [EMPTY_INGREDIENT()]
      );
    } else {
      setName("");
      setDescription("");
      setServings("2");
      setTotalMinutes("");
      setTags("");
      setSteps("");
      setColor(RECIPE_COLORS[Math.floor(Math.random() * RECIPE_COLORS.length)]);
      setIngredients([EMPTY_INGREDIENT()]);
    }
  }, [open, existing]);

  function patchIngredient(id: string, patch: Partial<RecipeIngredient>) {
    setIngredients((cur) =>
      cur.map((i) => (i.id === id ? { ...i, ...patch } : i))
    );
  }

  function removeIngredient(id: string) {
    setIngredients((cur) => cur.filter((i) => i.id !== id));
  }

  function addIngredient() {
    setIngredients((cur) => [...cur, EMPTY_INGREDIENT()]);
  }

  function save() {
    const s = parseInt(servings, 10);
    if (!name.trim()) {
      toast.error("Recipe needs a name");
      return;
    }
    if (!Number.isFinite(s) || s <= 0) {
      toast.error("Servings must be > 0");
      return;
    }
    const cleanIngredients = ingredients
      .filter((i) => i.name.trim() && Number.isFinite(i.amount) && i.amount > 0)
      .map((i) => ({ ...i, name: i.name.trim() }));
    if (cleanIngredients.length === 0) {
      toast.error("Add at least one ingredient");
      return;
    }
    const minutes = parseInt(totalMinutes, 10);
    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      servings: s,
      totalMinutes: Number.isFinite(minutes) && minutes > 0 ? minutes : undefined,
      ingredients: cleanIngredients,
      steps: steps.trim() || undefined,
      tags: tagList,
      color,
    };
    if (existing) {
      updateRecipe(existing.id, payload);
      toast.success("Recipe updated");
    } else {
      addRecipe(payload);
      toast.success(`${payload.name} added`);
    }
    onOpenChange(false);
  }

  function handleDelete() {
    if (!existing) return;
    if (!confirm(`Delete "${existing.name}"?`)) return;
    deleteRecipe(existing.id);
    onOpenChange(false);
    toast.success("Recipe deleted");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{existing ? "Edit recipe" : "New recipe"}</DialogTitle>
          <DialogDescription>
            Metric units only. Amounts per recipe (not per serving) — the
            shopping list will scale to your plan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Name</Label>
              <Input
                autoFocus
                placeholder="Spaghetti carbonara"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Servings</Label>
              <Input
                type="number"
                min={1}
                value={servings}
                onChange={(e) => setServings(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Total time (minutes)</Label>
              <Input
                type="number"
                min={1}
                value={totalMinutes}
                onChange={(e) => setTotalMinutes(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tags (comma-separated)</Label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="dinner, pasta, quick"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Ingredients</Label>
              <Button
                size="sm"
                variant="secondary"
                type="button"
                onClick={addIngredient}
              >
                <Plus className="h-3.5 w-3.5" /> Add ingredient
              </Button>
            </div>
            <div className="space-y-1.5">
              {ingredients.map((i) => (
                <div
                  key={i.id}
                  className="grid grid-cols-[1fr_5rem_7rem_2rem] gap-2 items-center"
                >
                  <Input
                    placeholder="Ingredient (e.g. flour)"
                    value={i.name}
                    onChange={(e) =>
                      patchIngredient(i.id, { name: e.target.value })
                    }
                  />
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    placeholder="100"
                    value={i.amount || ""}
                    onChange={(e) =>
                      patchIngredient(i.id, {
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <select
                    value={i.unit}
                    onChange={(e) =>
                      patchIngredient(i.id, { unit: e.target.value as Unit })
                    }
                    className="pd-select"
                  >
                    {UNITS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeIngredient(i.id)}
                    className="text-comment hover:text-destructive transition-colors"
                    aria-label="Remove ingredient"
                    disabled={ingredients.length === 1}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Steps</Label>
            <Textarea
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="1. Boil water. 2. Cook pasta. 3. …"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {RECIPE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    "h-7 w-7 rounded-full border-2 transition-transform",
                    color === c
                      ? "border-foreground scale-110"
                      : "border-border hover:scale-105"
                  )}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          {existing && (
            <Button
              variant="destructive"
              size="sm"
              className="mr-auto"
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          )}
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={save}>{existing ? "Save changes" : "Create recipe"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
