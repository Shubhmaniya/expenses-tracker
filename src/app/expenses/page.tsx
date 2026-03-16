import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"
import { Card } from "@/components/ui/Card"
import { Search, Filter, Edit2, Trash2 } from "lucide-react"
import ExpensesHeader from "@/components/ExpensesHeader"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

async function getExpenses(userId: string) {
  const expenses = await prisma.expense.findMany({
    where: { userId },
    include: {
      category: true
    },
    orderBy: {
      date: 'desc'
    }
  })
  return expenses
}

export default async function ExpensesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || !(session.user as any).id) {
    redirect("/login")
  }

  const userId = (session.user as any).id
  const expenses = await getExpenses(userId)

  return (
    <div className="space-y-8 pb-10">
      <ExpensesHeader />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Filters and Search */}
        <div className="md:col-span-2 lg:col-span-3">
          <div className="flex items-center gap-4 bg-card p-2 rounded-2xl border border-border shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search by merchant or description..." 
                className="w-full bg-transparent border-none focus:ring-0 pl-10 pr-4 py-2 text-sm"
              />
            </div>
            <div className="w-[1px] h-8 bg-border hidden md:block" />
            <div className="flex items-center gap-2 px-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select className="bg-transparent border-none focus:ring-0 text-sm font-medium pr-8">
                <option>All Categories</option>
                <option>Food</option>
                <option>Travel</option>
              </select>
            </div>
          </div>
        </div>
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
                    No transactions found. Add your first expense to get started!
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{expense.merchant || "N/A"}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{expense.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {expense.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-right whitespace-nowrap">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
