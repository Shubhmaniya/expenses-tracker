import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"
import { Card } from "@/components/ui/Card"
import { Edit2, Trash2, ArrowUpRight, ArrowDownRight } from "lucide-react"
import ExpensesHeader from "@/components/ExpensesHeader"
import ExpenseFilters from "@/components/ExpenseFilters"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

async function getExpenses(userId: string, query?: string, categoryId?: string) {
  const whereClause: any = { userId }
  
  if (query) {
    whereClause.OR = [
      { merchant: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ]
  }

  if (categoryId) {
    whereClause.categoryId = categoryId
  }

  const expenses = await prisma.expense.findMany({
    where: whereClause,
    include: {
      category: true
    },
    orderBy: {
      date: 'desc'
    }
  })
  return expenses
}

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })
}

interface PageProps {
  searchParams: Promise<{ query?: string; category?: string }>
}

export default async function ExpensesPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || !(session.user as any).id) {
    redirect("/login")
  }

  const userId = (session.user as any).id
  const resolvedParams = await searchParams
  const query = resolvedParams.query || ""
  const categoryId = resolvedParams.category || ""
  
  const expenses = await getExpenses(userId, query, categoryId)
  const categories = await getCategories()

  return (
    <div className="space-y-8 pb-10">
      <ExpensesHeader />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ExpenseFilters categories={categories.map(c => ({ id: c.id, name: c.name }))} />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Merchant/Description</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Category</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground text-right">Amount</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                    No transactions found matching your filters.
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => {
                  const isIncome = expense.category.name === "Income"
                  return (
                    <tr key={expense.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">{expense.merchant || "N/A"}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{expense.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isIncome ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                          {expense.category.name}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm font-semibold text-right whitespace-nowrap ${isIncome ? 'text-emerald-500' : 'text-foreground'}`}>
                        <div className="flex items-center justify-end gap-1">
                          {isIncome ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3 text-rose-500/70" />}
                          {formatCurrency(expense.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-muted-foreground hover:text-destructive transition-colors cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
