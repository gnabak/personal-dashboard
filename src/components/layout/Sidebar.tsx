import { NavLink } from "react-router-dom";
import { LayoutDashboard, Map, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/themes/context";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export function Sidebar() {
  const theme = useTheme();
  const items = [
    { to: "/", label: theme.copy.nav.overview, icon: LayoutDashboard, end: true },
    { to: "/travel", label: theme.copy.nav.travel, icon: Map },
    { to: "/hobbies", label: theme.copy.nav.hobbies, icon: Sparkles },
  ];
  const showPrompt = !!theme.voice.promptPrefix;
  const isMono = theme.id === "terminal";

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col gap-6 border-r border-border bg-muted/40 p-5 relative z-10">
      <div
        className={cn(
          "flex items-center gap-2",
          isMono ? "font-mono" : "font-sans"
        )}
      >
        {showPrompt && <span className="text-comment">$</span>}
        <span className="font-bold text-emphasis">{theme.copy.brand}</span>
        {theme.voice.brandCursor && (
          <span className="text-primary animate-blink">_</span>
        )}
      </div>

      <nav className="flex flex-col gap-0.5">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-md px-3 py-1.5 text-sm transition-colors",
                isMono ? "font-mono" : "font-sans",
                isActive
                  ? "bg-muted text-emphasis"
                  : "text-comment hover:text-foreground hover:bg-muted/60"
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "w-3 text-center",
                    isActive ? "text-primary" : "text-comment/60"
                  )}
                >
                  {isActive ? "›" : " "}
                </span>
                <item.icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-border space-y-3">
        <ThemeSwitcher />
        <div
          className={cn(
            "text-[11px] leading-relaxed text-comment",
            isMono ? "font-mono" : "font-sans"
          )}
        >
          <p>{theme.copy.footer[0]}</p>
          <p>{theme.copy.footer[1]}</p>
        </div>
      </div>
    </aside>
  );
}

export function MobileBar() {
  const theme = useTheme();
  const isMono = theme.id === "terminal";
  const items = [
    { to: "/", label: theme.copy.nav.overview, icon: LayoutDashboard, end: true },
    { to: "/travel", label: theme.copy.nav.travel, icon: Map },
    { to: "/hobbies", label: theme.copy.nav.hobbies, icon: Sparkles },
  ];
  return (
    <nav className="md:hidden flex items-center justify-around gap-1 sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm px-2 py-2">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center gap-1 rounded-md px-2 py-1.5 text-[11px]",
              isMono ? "font-mono" : "font-sans",
              isActive ? "bg-muted text-emphasis" : "text-comment"
            )
          }
        >
          <item.icon className="h-3.5 w-3.5" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
