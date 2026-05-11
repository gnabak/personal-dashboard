import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/themes/context";
import { Plus } from "lucide-react";
import { RecipesTab } from "./RecipesTab";
import { PlansTab } from "./PlansTab";
import { ShoppingTab } from "./ShoppingTab";
import { RecipeDialog } from "./RecipeDialog";
import { NewPlanDialog } from "./NewPlanDialog";

type TabId = "recipes" | "plans" | "shopping";

export function MealsPage() {
  const theme = useTheme();
  const c = theme.copy.meals;
  const [tab, setTab] = useState<TabId>("recipes");

  const [recipeDialog, setRecipeDialog] = useState<{
    open: boolean;
    recipeId: string | null;
  }>({ open: false, recipeId: null });
  const [newPlanOpen, setNewPlanOpen] = useState(false);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        eyebrow={c.eyebrow}
        title={c.title}
        description={c.description}
        actions={
          <>
            {tab === "recipes" && (
              <Button
                size="sm"
                onClick={() => setRecipeDialog({ open: true, recipeId: null })}
              >
                <Plus className="h-3.5 w-3.5" /> {c.actions.newRecipe}
              </Button>
            )}
            {tab === "plans" && (
              <Button size="sm" onClick={() => setNewPlanOpen(true)}>
                <Plus className="h-3.5 w-3.5" /> {c.actions.newPlan}
              </Button>
            )}
          </>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabId)}>
        <TabsList>
          <TabsTrigger value="recipes">{c.tabs.recipes}</TabsTrigger>
          <TabsTrigger value="plans">{c.tabs.plans}</TabsTrigger>
          <TabsTrigger value="shopping">{c.tabs.shopping}</TabsTrigger>
        </TabsList>

        <TabsContent value="recipes">
          <RecipesTab
            onNew={() => setRecipeDialog({ open: true, recipeId: null })}
            onEdit={(id) => setRecipeDialog({ open: true, recipeId: id })}
          />
        </TabsContent>
        <TabsContent value="plans">
          <PlansTab onNew={() => setNewPlanOpen(true)} />
        </TabsContent>
        <TabsContent value="shopping">
          <ShoppingTab />
        </TabsContent>
      </Tabs>

      <RecipeDialog
        open={recipeDialog.open}
        recipeId={recipeDialog.recipeId}
        onOpenChange={(o) =>
          setRecipeDialog((d) => ({ open: o, recipeId: o ? d.recipeId : null }))
        }
      />
      <NewPlanDialog open={newPlanOpen} onOpenChange={setNewPlanOpen} />
    </div>
  );
}
