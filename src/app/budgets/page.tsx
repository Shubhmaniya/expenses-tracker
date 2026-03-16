import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Progress } from "@/components/ui/Progress"
import { Wallet, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import BudgetsHeader from "@/components/BudgetsHeader"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

async function getBudgets() {
  const session = await getServerSession(authOptions)
  if (!session?.user || !(session.user as any).id) {
    return []
  }

  const userId = (session.user as any).id
  
  // Real DB implementation for budgets + current spending
  const budgets = await prisma.budget.findMany({
    where: { userId },
    include: { category: true }
  })
  
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  const currentExpenses = await prisma.expense.findMany({
    where: {
      userId,
      date: { gte: firstDayOfMonth }
    }
  })
  
  return budgets.map(b => {
    // Calculate spent from current month's expenses matching category
    const spent = currentExpenses
      .filter(e => e.categoryId === b.categoryId)
      .reduce((sum, e) => sum + e.amount, 0)
      
    return { ...b, spent }
  })
}

export default async function BudgetsPage() {
  const budgets = await getBudgets()

  return (
    <div className="space-y-8 pb-10">
      <BudgetsHeader />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {budgets.length === 0 ? (
          <Card className="col-span-full py-20">
            <div className="flex flex-col items-center justify-center text-center px-6">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Wallet className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">No Budgets Set</h3>
              <p className="text-muted-foreground mt-2 max-w-sm">
                You haven't set any budgets yet. Create one to start tracking your category spending.
              </p>
            </div>
          </Card>
        ) : (
          budgets.map((budget) => {
            const percentage = Math.min((budget.spent / budget.amount) * 100, 100)
            const isOver = budget.spent > budget.amount
            
            return (
              <Card key={budget.id} className="relative overflow-hidden group">
                {isOver && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" />
                )}
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-bold">{budget.category.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">Monthly Limit</p>
                  </div>
                  <div className={cn(
                    "p-2 rounded-lg transition-transform group-hover:scale-110",
                    isOver ? "bg-rose-500/10 text-rose-500" : "bg-primary/10 text-primary"
                  )}>
                    <Wallet className="w-4 h-4" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">{formatCurrency(budget.spent)}</span>
                    <span className="text-sm text-muted-foreground">of {formatCurrency(budget.amount)}</span>
                  </div>
                  
                  <Progress value={percentage} className={isOver ? "bg-rose-100 dark:bg-rose-900/20" : ""} indicatorClassName={isOver ? "bg-rose-500" : "bg-primary"} />
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-xs font-medium">
                      {Math.round(percentage)}% used
                    </div>
                    {isOver && (
                      <div className="flex items-center gap-1 text-xs font-medium text-rose-500">
                        <AlertCircle className="w-3 h-3" />
                        Over Budget
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
