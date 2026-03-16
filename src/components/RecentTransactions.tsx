import { ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { formatCurrency } from "@/lib/utils"

interface Transaction {
  id: string;
  amount: number;
  description: string;
  categoryName: string;
  date: string;
}

export default function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card className="col-span-4 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        {transactions.length > 0 && <button className="text-sm font-medium text-primary hover:underline">View all</button>}
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground flex flex-col items-center justify-center h-full">
            <p className="text-sm">No recent transactions.</p>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-2 hover:bg-secondary rounded-xl transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`bg-slate-100 p-2 rounded-lg transition-transform group-hover:scale-110`}>
                    <ArrowUpRight className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">{t.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.categoryName} • {t.date}</p>
                  </div>
                </div>
                <div className={t.categoryName === "Income" ? "text-emerald-500 font-semibold" : "font-semibold"}>
                  {t.categoryName === "Income" ? "+" : "-"}{formatCurrency(t.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
