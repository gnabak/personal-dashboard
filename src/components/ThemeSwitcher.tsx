import { useThemeStore } from "@/store/theme";
import { THEME_IDS, THEMES, type ThemeId } from "@/themes";
import { useTheme } from "@/themes/context";
import { cn } from "@/lib/utils";
import { Palette } from "lucide-react";
import { useState, useRef, useEffect } from "react";

/**
 * Compact theme switcher: a small "swatch" button that opens a menu of
 * all available themes with a colour preview, name and one-line blurb.
 */
export function ThemeSwitcher() {
  const active = useTheme();
  const setTheme = useThemeStore((s) => s.setTheme);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!open) return;
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 py-1.5 text-sm hover:bg-muted/60 transition-colors"
        title="Change theme"
      >
        <Palette className="h-3.5 w-3.5 text-comment" />
        <span className="font-medium flex-1 text-left truncate">
          {active.name}
        </span>
        <Swatches theme={active} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 bottom-full mb-2 rounded-md border border-border bg-background shadow-xl z-50 overflow-hidden">
          <ul role="listbox" className="max-h-80 overflow-y-auto scrollbar-thin">
            {THEME_IDS.map((id) => {
              const t = THEMES[id];
              const selected = id === active.id;
              return (
                <li key={id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      setTheme(id as ThemeId);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-start gap-3 px-3 py-2.5 text-left transition-colors",
                      selected
                        ? "bg-muted/70"
                        : "hover:bg-muted/40"
                    )}
                  >
                    <Swatches theme={t} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium leading-tight">
                        {t.name}
                      </div>
                      <div className="text-[11px] text-comment mt-0.5 line-clamp-2">
                        {t.blurb}
                      </div>
                    </div>
                    {selected && (
                      <span className="text-emphasis text-xs mt-0.5">●</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function Swatches({ theme }: { theme: { colors: { primary: string; warm: string; cool: string; emphasis: string } } }) {
  const c = theme.colors;
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <Swatch rgb={c.primary} />
      <Swatch rgb={c.cool} />
      <Swatch rgb={c.warm} />
      <Swatch rgb={c.emphasis} />
    </div>
  );
}

function Swatch({ rgb }: { rgb: string }) {
  return (
    <span
      className="h-3 w-3 rounded-sm border border-border"
      style={{ background: `rgb(${rgb})` }}
    />
  );
}
