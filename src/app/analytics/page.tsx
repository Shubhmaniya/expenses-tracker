import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ArrowUpRight, Info } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import AnalyticsCharts from "@/components/AnalyticsCharts"
import ExportButtons from "@/components/ExportButtons"

async function getAnalyticsData() {
  const session = await getServerSession(authOptions)
  if (!session?.user || !(session.user as any).id) {
    return null
  }

  const userId = (session.user as any).id

  const expenses = await prisma.expense.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: "desc" },
  })

  let totalIncome = 0
  let totalExpenses = 0
  expenses.forEach((e) => {
    if (e.category.name === "Income") totalIncome += e.amount
    else if (e.category.name !== "Savings") totalExpenses += e.amount
  })

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

  const catMap = new Map<string, number>()
  expenses.forEach((e) => {
    if (e.category.name !== "Income" && e.category.name !== "Savings")
      catMap.set(e.category.name, (catMap.get(e.category.name) || 0) + e.amount)
  })
  const categorySpending = Array.from(catMap.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)

  const highestCategory = categorySpending.length > 0 ? categorySpending[0] : null
  const highestCategoryPercent = totalExpenses > 0 && highestCategory ? Math.round((highestCategory.amount / totalExpenses) * 100) : 0

  const uniqueDays = new Set(
    expenses
      .filter((e) => e.category.name !== "Income" && e.category.name !== "Savings")
      .map((e) => new Date(e.date).toISOString().split("T")[0])
  )
  const dailyAverage = uniqueDays.size > 0 ? totalExpenses / uniqueDays.size : 0

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const now = new Date()
  const monthlyTrend: { month: string; income: number; expenses: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59)
    let mIncome = 0, mExpenses = 0
    expenses.forEach((e) => {
      const eDate = new Date(e.date)
      if (eDate >= d && eDate <= monthEnd) {
        if (e.category.name === "Income") mIncome += e.amount
        else if (e.category.name !== "Savings") mExpenses += e.amount
      }
    })
    monthlyTrend.push({ month: months[d.getMonth()], income: mIncome, expenses: mExpenses })
  }

  // Export data
  const exportData = expenses.map((e) => ({
    id: e.id,
    date: new Date(e.date).toISOString().split("T")[0],
    description: e.description,
    merchant: e.merchant || "",
    category: e.category.name,
    amount: e.amount,
  }))

  return {
    totalIncome,
    totalExpenses,
    savingsRate: Math.round(savingsRate * 10) / 10,
    highestCategory: highestCategory?.category || "N/A",
    highestCategoryPercent,
    dailyAverage: Math.round(dailyAverage * 100) / 100,
    categorySpending,
    monthlyTrend,
    exportData,
  }
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData()

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground">Please log in to view your analytics.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Deep dive into your spending habits and financial health.
          </p>
        </div>
        <ExportButtons expenses={data.exportData} />
      </div>

      {data.totalExpenses === 0 && data.totalIncome === 0 ? (
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 py-20">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Info className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-blue-900">No Data Yet</h3>
          <p className="text-blue-700 max-w-md">
            Start adding transactions to see your personalized financial analytics here!
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-primary text-primary-foreground shadow-xl shadow-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium opacity-80">Savings Rate</p>
                  <Info className="w-4 h-4 opacity-50" />
                </div>
                <h3 className="text-3xl font-bold mt-2">{data.savingsRate}%</h3>
                <p className="text-xs mt-2 opacity-80">
                  Income: {formatCurrency(data.totalIncome)} • Expenses: {formatCurrency(data.totalExpenses)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Highest Category</p>
                  <Info className="w-4 h-4 text-muted-foreground/50" />
                </div>
                <h3 className="text-3xl font-bold mt-2 text-rose-500">{data.highestCategory}</h3>
                <p className="text-xs text-muted-foreground mt-2">
                  {data.highestCategoryPercent}% of total spending
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Daily Average</p>
                  <Info className="w-4 h-4 text-muted-foreground/50" />
                </div>
                <h3 className="text-3xl font-bold mt-2 text-blue-500">
                  {formatCurrency(data.dailyAverage)}
                </h3>
                <p className="text-xs text-muted-foreground mt-2">Based on your transaction history</p>
              </CardContent>
            </Card>
          </div>

          <AnalyticsCharts
            monthlyTrend={data.monthlyTrend}
            categorySpending={data.categorySpending}
          />
        </>
      )}
    </div>
  )
}
