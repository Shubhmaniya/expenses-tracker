"use client"

import { useState, useEffect } from "react"
import { X, Loader2 } from "lucide-react"
import { getCategories } from "@/app/actions/expenses"
import { createBudget } from "@/app/actions/budgets"
import { cn } from "@/lib/utils"

interface AddBudgetModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddBudgetModal({ isOpen, onClose }: AddBudgetModalProps) {
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    categoryId: "",
    period: "MONTHLY",
  })
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      getCategories().then(setCategories)
      setErrorMsg(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    
    const result = await createBudget({
      amount: parseFloat(formData.amount),
      categoryId: formData.categoryId,
      period: formData.period,
    })

    if (result && result.success) {
      onClose()
      setFormData({
        amount: "",
        categoryId: "",
        period: "MONTHLY",
      })
    } else {
      setErrorMsg(result?.error || "An unexpected error occurred saving the budget.")
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-lg bg-card rounded-2xl border border-border shadow-2xl animate-in item-in slide-in-bottom">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">Add / Update Budget</h2>
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Monthly Amount Limit</label>
            <input
              required
              type="number"
              step="0.01"
              placeholder="e.g. 500.00"
              className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              required
              className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="pt-4">
            <button
              disabled={loading}
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
