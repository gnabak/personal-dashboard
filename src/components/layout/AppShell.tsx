import { Outlet } from "react-router-dom";
import { Sidebar, MobileBar } from "./Sidebar";

export function AppShell() {
  return (
    <div className="min-h-screen w-full">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-w-0 flex flex-col">
          <MobileBar />
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
