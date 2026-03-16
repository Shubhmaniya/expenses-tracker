import { ArrowDownRight, ArrowUpRight, Banknote, CreditCard, PiggyBank, TrendingUp } from "lucide-react"
import { Card, CardContent } from "./ui/Card"
import { formatCurrency } from "@/lib/utils"

interface DashboardStatsProps {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
}

export default function DashboardStats({ totalBalance, totalIncome, totalExpenses, totalSavings }: DashboardStatsProps) {
  const stats = [
    {
      name: "Total Balance",
      value: totalBalance,
      icon: Banknote,
      trend: "+0%",
      trendUp: true,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      name: "Total Income",
      value: totalIncome,
      icon: TrendingUp,
      trend: "+0%",
      trendUp: true,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      name: "Total Expenses",
      value: totalExpenses,
      icon: CreditCard,
      trend: "+0%",
      trendUp: false,
      color: "text-rose-500",
      bg: "bg-rose-500/10"
    },
    {
      name: "Total Savings",
      value: totalSavings,
      icon: PiggyBank,
      trend: "0%",
      trendUp: true,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name} className="group hover:border-primary/50 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className={stat.bg + " p-2 rounded-lg transition-transform group-hover:scale-110"}>
                <stat.icon className={"w-5 h-5 " + stat.color} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
              <h3 className="text-2xl font-bold tracking-tight mt-1">
                {formatCurrency(stat.value)}
              </h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
