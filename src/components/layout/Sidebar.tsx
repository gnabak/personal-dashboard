import { NavLink } from "react-router-dom";
import { LayoutDashboard, Map, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "overview", icon: LayoutDashboard, end: true },
  { to: "/travel", label: "travel", icon: Map },
  { to: "/hobbies", label: "hobbies", icon: Sparkles },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col gap-6 border-r border-border bg-muted/40 p-5 relative z-10">
      <div className="flex items-center gap-2 font-mono">
        <span className="text-comment">$</span>
        <span className="font-bold text-gold">~/dashboard</span>
        <span className="text-green animate-blink">_</span>
      </div>

      <nav className="flex flex-col gap-0.5">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-md px-3 py-1.5 text-sm font-mono transition-colors",
                isActive
                  ? "bg-muted text-gold"
                  : "text-comment hover:text-foreground hover:bg-muted/60"
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "w-3 text-center",
                    isActive ? "text-green" : "text-comment/60"
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

      <div className="mt-auto pt-4 border-t border-border text-[11px] font-mono leading-relaxed text-comment">
        <p>
          <span className="text-comment/70">{"//"}</span> data persists in
          this browser
        </p>
        <p>
          <span className="text-comment/70">{"//"}</span> use{" "}
          <span className="text-orange">/</span> to backup
        </p>
      </div>
    </aside>
  );
}

export function MobileBar() {
  return (
    <nav className="md:hidden flex items-center justify-around gap-1 sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm px-2 py-2">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-mono",
              isActive ? "bg-muted text-gold" : "text-comment"
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
