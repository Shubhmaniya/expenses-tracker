"use client"

import { FileText, Download, Loader2 } from "lucide-react"
import { useState } from "react"

interface ExpenseRow {
  id: string
  date: string
  description: string
  merchant: string
  category: string
  amount: number
}

export default function ExportButtons({ expenses }: { expenses: ExpenseRow[] }) {
  const [loadingCsv, setLoadingCsv] = useState(false)
  const [loadingPdf, setLoadingPdf] = useState(false)

  const exportCSV = () => {
    setLoadingCsv(true)
    try {
      const headers = ["Date", "Description", "Merchant", "Category", "Amount"]
      const rows = expenses.map((e) => [
        e.date,
        `"${e.description.replace(/"/g, '""')}"`,
        `"${e.merchant.replace(/"/g, '""')}"`,
        e.category,
        e.amount.toFixed(2),
      ])

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `expenses_${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      alert("Failed to export CSV")
    }
    setLoadingCsv(false)
  }

  const exportPDF = () => {
    setLoadingPdf(true)
    try {
      // Build an HTML table for print-to-PDF
      const totalAmount = expenses.reduce((sum, e) => {
        if (e.category === "Income") return sum
        return sum + e.amount
      }, 0)

      const totalIncome = expenses
        .filter((e) => e.category === "Income")
        .reduce((sum, e) => sum + e.amount, 0)

      const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Expense Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Arial, sans-serif; }
    body { padding: 40px; color: #1e293b; }
    .header { text-align: center; margin-bottom: 32px; border-bottom: 3px solid #3B82F6; padding-bottom: 20px; }
    .header h1 { font-size: 28px; color: #1e293b; margin-bottom: 4px; }
    .header p { color: #64748b; font-size: 14px; }
    .summary { display: flex; gap: 16px; margin-bottom: 28px; }
    .summary-card { flex: 1; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; text-align: center; }
    .summary-card h3 { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
    .summary-card p { font-size: 24px; font-weight: 700; margin-top: 4px; }
    .income { color: #10B981; }
    .expense { color: #EF4444; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th { background: #f1f5f9; color: #475569; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; padding: 12px 16px; text-align: left; border-bottom: 2px solid #e2e8f0; }
    td { padding: 10px 16px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
    tr:hover { background: #fafafa; }
    .amount { text-align: right; font-weight: 600; }
    .footer { margin-top: 32px; text-align: center; color: #94a3b8; font-size: 11px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>💰 Expense Report</h1>
    <p>Generated on ${new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>
  </div>
  <div class="summary">
    <div class="summary-card">
      <h3>Total Income</h3>
      <p class="income">₹${totalIncome.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
    </div>
    <div class="summary-card">
      <h3>Total Expenses</h3>
      <p class="expense">₹${totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
    </div>
    <div class="summary-card">
      <h3>Net Balance</h3>
      <p>₹${(totalIncome - totalAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Description</th>
        <th>Merchant</th>
        <th>Category</th>
        <th style="text-align:right">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${expenses
        .map(
          (e) => `
        <tr>
          <td>${e.date}</td>
          <td>${e.description}</td>
          <td>${e.merchant}</td>
          <td>${e.category}</td>
          <td class="amount" style="color: ${e.category === "Income" ? "#10B981" : "#EF4444"}">
            ${e.category === "Income" ? "+" : "-"}₹${e.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </td>
        </tr>`
        )
        .join("")}
    </tbody>
  </table>
  <div class="footer">
    <p>ExpenseTracker • Personal Finance Dashboard</p>
  </div>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`

      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(html)
        printWindow.document.close()
      } else {
        alert("Please allow pop-ups to generate the PDF report.")
      }
    } catch (err) {
      alert("Failed to generate PDF")
    }
    setLoadingPdf(false)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={exportCSV}
        disabled={loadingCsv || expenses.length === 0}
        className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:scale-[1.02] hover:brightness-110 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {loadingCsv ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        Export CSV
      </button>
      <button
        onClick={exportPDF}
        disabled={loadingPdf || expenses.length === 0}
        className="flex items-center justify-center gap-2 bg-rose-600 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-rose-600/20 hover:bg-rose-700 hover:scale-[1.02] hover:brightness-110 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {loadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
        Export PDF
      </button>
    </div>
  )
}
