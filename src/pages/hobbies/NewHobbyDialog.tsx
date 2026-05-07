import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/Dialog";
import { Input, Textarea } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { HOBBY_COLORS, HOBBY_ICONS } from "@/types/hobbies";
import { useHobbiesStore } from "@/store/hobbies";
import { getHobbyIcon } from "./iconMap";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface NewHobbyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (id: string) => void;
}

export function NewHobbyDialog({
  open,
  onOpenChange,
  onCreated,
}: NewHobbyDialogProps) {
  const addHobby = useHobbiesStore((s) => s.addHobby);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState<string>(HOBBY_ICONS[0]);
  const [color, setColor] = useState<string>(HOBBY_COLORS[0].value);

  function reset() {
    setName("");
    setDescription("");
    setIcon(HOBBY_ICONS[0]);
    setColor(HOBBY_COLORS[0].value);
  }

  function handleCreate() {
    if (!name.trim()) {
      toast.error("Give your hobby a name");
      return;
    }
    const id = addHobby({
      name: name.trim(),
      description: description.trim() || undefined,
      icon,
      accentColor: color,
    });
    toast.success(`${name.trim()} added`);
    reset();
    onOpenChange(false);
    onCreated?.(id);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New hobby</DialogTitle>
          <DialogDescription>
            Track milestones and time spent on something you care about.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="hobby-name">Name</Label>
            <Input
              id="hobby-name"
              placeholder="e.g. Learn fingerstyle guitar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="hobby-desc">Description</Label>
            <Textarea
              id="hobby-desc"
              placeholder="Optional"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="grid grid-cols-8 gap-2">
              {HOBBY_ICONS.map((name) => {
                const Ic = getHobbyIcon(name);
                const active = icon === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setIcon(name)}
                    className={cn(
                      "h-10 w-10 grid place-items-center rounded-lg border transition-colors",
                      active
                        ? "border-gold bg-muted"
                        : "border-border bg-muted/40 hover:bg-muted/60"
                    )}
                    style={active ? { color } : undefined}
                  >
                    <Ic className="h-4.5 w-4.5" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Accent color</Label>
            <div className="flex flex-wrap gap-2">
              {HOBBY_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  title={c.name}
                  className={cn(
                    "h-7 w-7 rounded-full border-2 transition-transform",
                    color === c.value
                      ? "border-white scale-110"
                      : "border-border hover:scale-105"
                  )}
                  style={{ background: c.value }}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleCreate}>Create hobby</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
