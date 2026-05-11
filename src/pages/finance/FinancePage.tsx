import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/themes/context";
import { useFinanceStore } from "@/store/finance";
import { Plus, Upload } from "lucide-react";
import { FinanceOverviewTab } from "./FinanceOverviewTab";
import { TransactionsTab } from "./TransactionsTab";
import { InvestmentsTab } from "./InvestmentsTab";
import { GoalsTab } from "./GoalsTab";
import { NewAccountDialog } from "./NewAccountDialog";
import { NewTransactionDialog } from "./NewTransactionDialog";
import { ImportTransactionsDialog } from "./ImportTransactionsDialog";
import { NewHoldingDialog } from "./NewHoldingDialog";
import { NewGoalDialog } from "./NewGoalDialog";
import { AccountsBar } from "./AccountsBar";

type TabId = "overview" | "transactions" | "investments" | "goals";

export function FinancePage() {
  const theme = useTheme();
  const c = theme.copy.finance;
  const [tab, setTab] = useState<TabId>("overview");

  const accounts = useFinanceStore((s) => s.accounts);

  const [newAccountOpen, setNewAccountOpen] = useState(false);
  const [newTxOpen, setNewTxOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [newHoldingOpen, setNewHoldingOpen] = useState(false);
  const [newGoalOpen, setNewGoalOpen] = useState(false);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        eyebrow={c.eyebrow}
        title={c.title}
        description={c.description}
        actions={
          <>
            {tab === "transactions" && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setImportOpen(true)}
                  disabled={accounts.length === 0}
                >
                  <Upload className="h-3.5 w-3.5" /> {c.actions.importCsv}
                </Button>
                <Button
                  size="sm"
                  onClick={() => setNewTxOpen(true)}
                  disabled={accounts.length === 0}
                >
                  <Plus className="h-3.5 w-3.5" /> {c.actions.addTransaction}
                </Button>
              </>
            )}
            {tab === "investments" && (
              <Button size="sm" onClick={() => setNewHoldingOpen(true)}>
                <Plus className="h-3.5 w-3.5" /> {c.actions.addHolding}
              </Button>
            )}
            {tab === "goals" && (
              <Button size="sm" onClick={() => setNewGoalOpen(true)}>
                <Plus className="h-3.5 w-3.5" /> {c.actions.addGoal}
              </Button>
            )}
            {tab === "overview" && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setNewAccountOpen(true)}
              >
                <Plus className="h-3.5 w-3.5" /> {c.actions.addAccount}
              </Button>
            )}
          </>
        }
      />

      <AccountsBar onAddAccount={() => setNewAccountOpen(true)} />

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabId)}>
        <TabsList>
          <TabsTrigger value="overview">{c.tabs.overview}</TabsTrigger>
          <TabsTrigger value="transactions">{c.tabs.transactions}</TabsTrigger>
          <TabsTrigger value="investments">{c.tabs.investments}</TabsTrigger>
          <TabsTrigger value="goals">{c.tabs.goals}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <FinanceOverviewTab />
        </TabsContent>
        <TabsContent value="transactions">
          <TransactionsTab
            onImport={() => setImportOpen(true)}
            onAdd={() => setNewTxOpen(true)}
          />
        </TabsContent>
        <TabsContent value="investments">
          <InvestmentsTab onAdd={() => setNewHoldingOpen(true)} />
        </TabsContent>
        <TabsContent value="goals">
          <GoalsTab onAdd={() => setNewGoalOpen(true)} />
        </TabsContent>
      </Tabs>

      <NewAccountDialog open={newAccountOpen} onOpenChange={setNewAccountOpen} />
      <NewTransactionDialog open={newTxOpen} onOpenChange={setNewTxOpen} />
      <ImportTransactionsDialog open={importOpen} onOpenChange={setImportOpen} />
      <NewHoldingDialog open={newHoldingOpen} onOpenChange={setNewHoldingOpen} />
      <NewGoalDialog open={newGoalOpen} onOpenChange={setNewGoalOpen} />
    </div>
  );
}
