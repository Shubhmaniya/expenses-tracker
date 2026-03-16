"use client"

import { useState, useEffect } from "react"
import { X, Loader2 } from "lucide-react"
import { createExpense, getCategories } from "@/app/actions/expenses"
import { cn } from "@/lib/utils"

interface AddExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  isIncome?: boolean
}

export default function AddExpenseModal({ isOpen, onClose, isIncome = false }: AddExpenseModalProps) {
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    categoryId: "",
    date: new Date().toISOString().split('T')[0],
    merchant: "",
  })

  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      getCategories().then(cats => {
        setCategories(cats)
        if (isIncome) {
          const incomeCat = cats.find(c => c.name === "Income")
          if (incomeCat) setFormData(prev => ({ ...prev, categoryId: incomeCat.id }))
        } else {
          setFormData(prev => ({ ...prev, categoryId: "" }))
        }
      })
      setErrorMsg(null)
    }
  }, [isOpen, isIncome])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    
    // Trim & validate
    const amountVal = formData.amount.trim()
    const descVal = formData.description.trim() || (isIncome ? "Income" : "General Expense")
    const catVal = formData.categoryId.trim()
    const merchVal = formData.merchant.trim() || (isIncome ? "Income Source" : "General Merchant")

    if (!amountVal || isNaN(parseFloat(amountVal))) {
      setLoading(false)
      return setErrorMsg("Please enter a valid amount.")
    }

    if (!catVal) {
      setLoading(false)
      return setErrorMsg("Please select a category.")
    }

    const result = await createExpense({
      amount: parseFloat(amountVal),
      description: descVal,
      categoryId: catVal,
      date: formData.date,
      merchant: merchVal,
    })

    if (result && result.success) {
      onClose()
      setFormData({
        amount: "",
        description: "",
        categoryId: "",
        date: new Date().toISOString().split('T')[0],
        merchant: "",
      })
    } else {
      setErrorMsg(result?.error || "Error saving transaction")
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-lg bg-card rounded-2xl border border-border shadow-2xl animate-in item-in slide-in-bottom">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">{isIncome ? "Add Income" : "Add Transaction"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors cursor-pointer">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-medium">
              {errorMsg}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-text"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <input
                required
                type="date"
                className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              required
              className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer disabled:opacity-50"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              disabled={isIncome} // Lock category if it's income
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {isIncome && <p className="text-xs text-muted-foreground mt-1">Category is locked to Income.</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Merchant/Description</label>
            <input
              type="text"
              placeholder={isIncome ? "e.g. Salary, Freelance, Dividend" : "e.g. Starbucks, Amazon, Rent"}
              className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-text"
              value={formData.merchant}
              onChange={(e) => setFormData({ ...formData, merchant: e.target.value, description: e.target.value })}
            />
          </div>

          <div className="pt-4">
            <button
              disabled={loading}
              type="submit"
              className={`w-full flex items-center justify-center gap-2 text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-[1.02] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${isIncome ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-primary hover:bg-primary/90 shadow-primary/20'}`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isIncome ? "Save Income" : "Save Transaction")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
