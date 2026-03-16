import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { FileText, Calendar, Info } from "lucide-react"
import ExportButtons from "@/components/ExportButtons"

async function getExportData() {
  const session = await getServerSession(authOptions)
  if (!session?.user || !(session.user as any).id) return []

  const userId = (session.user as any).id
  const expenses = await prisma.expense.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: "desc" },
  })

  return expenses.map((e) => ({
    id: e.id,
    date: new Date(e.date).toISOString().split("T")[0],
    description: e.description,
    merchant: e.merchant || "",
    category: e.category.name,
    amount: e.amount,
  }))
}

export default async function ReportsPage() {
  const exportData = await getExportData()

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Exports</h1>
          <p className="text-muted-foreground mt-1">
            Export your financial data and generate professional statements.
          </p>
        </div>
        <ExportButtons expenses={exportData} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/20 bg-primary/[0.02]">
          <CardHeader>
            <CardTitle>How to Export</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-500 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">CSV Export</p>
                  <p>Downloads a spreadsheet-compatible file with all your transactions. Open it in Excel, Google Sheets, or any data tool.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-rose-500/10 p-2 rounded-lg text-rose-500 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">PDF Export</p>
                  <p>Opens a print-friendly report in a new tab. Use your browser's "Save as PDF" option (Ctrl+P → Save as PDF) to save it.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                <span className="text-sm font-medium text-muted-foreground">Total Transactions</span>
                <span className="text-2xl font-bold">{exportData.length}</span>
              </div>
              {exportData.length > 0 && (
                <>
                  <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                    <span className="text-sm font-medium text-muted-foreground">Date Range</span>
                    <span className="text-sm font-semibold">
                      {exportData[exportData.length - 1].date} → {exportData[0].date}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                    <span className="text-sm font-medium text-muted-foreground">Categories</span>
                    <span className="text-sm font-semibold">
                      {new Set(exportData.map((e) => e.category)).size}
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {exportData.length === 0 && (
        <div className="flex items-center justify-center p-12 bg-secondary/50 rounded-3xl border border-dashed border-border">
          <div className="text-center">
            <Info className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-semibold text-lg text-muted-foreground">No Transactions Yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
              Add some transactions from the Dashboard to start generating reports and exports.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
