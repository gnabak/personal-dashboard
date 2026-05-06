import { NavLink } from "react-router-dom";
import { LayoutDashboard, Map, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/travel", label: "Travel", icon: Map },
  { to: "/hobbies", label: "Hobbies", icon: Sparkles },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col gap-6 border-r border-white/5 bg-black/20 backdrop-blur-md p-5">
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-indigo-500 grid place-items-center text-black font-bold shadow-lg shadow-emerald-500/20">
          P
        </div>
        <div>
          <div className="text-sm font-semibold leading-tight">Personal</div>
          <div className="text-xs text-muted-foreground leading-tight">
            Dashboard
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/[0.08] text-foreground shadow ring-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto text-[11px] text-muted-foreground/70 leading-relaxed">
        Your data is stored locally in this browser. Use the Overview page to
        export a backup.
      </div>
    </aside>
  );
}

export function MobileBar() {
  return (
    <nav className="md:hidden flex items-center justify-around gap-1 sticky top-0 z-40 border-b border-white/5 bg-black/30 backdrop-blur-md px-2 py-2">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[11px]",
              isActive
                ? "bg-white/[0.08] text-foreground"
                : "text-muted-foreground"
            )
          }
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
