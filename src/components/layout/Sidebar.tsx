import { NavLink } from "react-router-dom";
import { LayoutDashboard, Map, Sparkles, Wallet, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/themes/context";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

function buildItems(theme: ReturnType<typeof useTheme>) {
  return [
    { to: "/", label: theme.copy.nav.overview, icon: LayoutDashboard, end: true },
    { to: "/finance", label: theme.copy.nav.finance, icon: Wallet },
    { to: "/meals", label: theme.copy.nav.meals, icon: ChefHat },
    { to: "/travel", label: theme.copy.nav.travel, icon: Map },
    { to: "/hobbies", label: theme.copy.nav.hobbies, icon: Sparkles },
  ];
}

export function Sidebar() {
  const theme = useTheme();
  const items = buildItems(theme);
  const showPrompt = !!theme.voice.promptPrefix;
  const isMono = theme.id === "terminal";
  const fontClass = isMono ? "font-mono" : "font-sans";

  return (
    <aside className="pd-sidebar">
      <div className={cn("pd-sidebar__brand", fontClass)}>
        {showPrompt && <span className="text-comment">$</span>}
        <span className="font-bold text-emphasis">{theme.copy.brand}</span>
        {theme.voice.brandCursor && (
          <span className="text-primary animate-blink">_</span>
        )}
      </div>

      <nav className="pd-sidebar__nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "pd-sidebar__item",
                fontClass,
                isActive ? "pd-sidebar__item--active" : "pd-sidebar__item--inactive"
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "pd-sidebar__cursor",
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

      <div className="pd-sidebar__footer">
        <ThemeSwitcher />
        <div className={cn("pd-sidebar__footnote", fontClass)}>
          <p>{theme.copy.footer[0]}</p>
          <p>{theme.copy.footer[1]}</p>
        </div>
      </div>
    </aside>
  );
}

export function MobileBar() {
  const theme = useTheme();
  const items = buildItems(theme);
  const fontClass = theme.id === "terminal" ? "font-mono" : "font-sans";
  return (
    <nav className="pd-mobile-bar">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              "pd-mobile-bar__item",
              fontClass,
              isActive ? "pd-mobile-bar__item--active" : "pd-mobile-bar__item--inactive"
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
