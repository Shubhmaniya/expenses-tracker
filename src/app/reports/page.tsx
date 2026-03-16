"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { FileText, Download, Calendar, ArrowRight, CheckCircle2 } from "lucide-react"

const recentReports = [
  { id: 1, name: "Monthly Spending Report - May 2026", date: "June 1, 2026", type: "PDF", size: "1.2 MB" },
  { id: 2, name: "Tax Summary 2025-26", date: "May 15, 2026", type: "CSV", size: "450 KB" },
  { id: 3, name: "Quarterly Budget Analysis Q1", date: "April 10, 2026", type: "PDF", size: "2.8 MB" },
]

export default function ReportsPage() {
  const exportReport = (format: string) => {
    alert(`Generating ${format} report... This feature would involve a specialized PDF/CSV library in a production environment.`)
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Exports</h1>
        <p className="text-muted-foreground mt-1">
          Export your financial data and generate professional statements.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/20 bg-primary/[0.02]">
          <CardHeader>
            <CardTitle>Automatic Export</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              Configure automatic monthly reports to be sent directly to your email or saved in your cloud storage.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Monthly Summary</p>
                  <p className="text-xs text-muted-foreground">Enabled • Every 1st of month</p>
                </div>
                <button className="text-xs font-medium text-primary hover:underline">Edit</button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => exportReport('PDF')}
                className="flex flex-col items-center justify-center p-6 gap-3 bg-secondary hover:bg-secondary/80 rounded-2xl transition-all border border-transparent hover:border-primary/20"
              >
                <div className="bg-rose-500/10 p-3 rounded-full text-rose-500">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="font-semibold">Export as PDF</span>
              </button>
              <button 
                onClick={() => exportReport('CSV')}
                className="flex flex-col items-center justify-center p-6 gap-3 bg-secondary hover:bg-secondary/80 rounded-2xl transition-all border border-transparent hover:border-primary/20"
              >
                <div className="bg-emerald-500/10 p-3 rounded-full text-emerald-500">
                  <Download className="w-6 h-6" />
                </div>
                <span className="font-semibold">Export as CSV</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between py-4 group hover:bg-muted/30 px-2 rounded-xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-muted p-2 rounded-lg group-hover:bg-primary/10 transition-colors">
                    <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{report.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{report.date} • {report.type} • {report.size}</p>
                  </div>
                </div>
                <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-center p-8 bg-secondary/50 rounded-3xl border border-dashed border-border">
        <div className="text-center">
          <Calendar className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold text-lg text-muted-foreground">Looking for older reports?</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-sm mx-auto">
            You can access reports dating back up to 2 years in the advanced archive section.
          </p>
          <button className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
            Go to Archive <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
