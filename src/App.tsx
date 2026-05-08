import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Overview } from "@/pages/Overview";
import { TravelPage } from "@/pages/travel/TravelPage";
import { HobbiesPage } from "@/pages/hobbies/HobbiesPage";
import { FinancePage } from "@/pages/finance/FinancePage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Overview />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/travel" element={<TravelPage />} />
        <Route path="/hobbies" element={<HobbiesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
