"use client"

import { useState } from "react"
import { Plus, TrendingUp } from "lucide-react"
import AddExpenseModal from "./AddExpenseModal"

export default function DashboardHeader() {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your finances today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setIsIncomeModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:scale-[1.02] hover:brightness-110 transition-all active:scale-95 cursor-pointer"
          >
            <TrendingUp className="w-5 h-5" />
            Add Income
          </button>
          
          <button 
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] hover:brightness-110 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Add Transaction
          </button>
        </div>
      </div>

      <AddExpenseModal 
        isOpen={isExpenseModalOpen} 
        onClose={() => setIsExpenseModalOpen(false)} 
      />
      
      <AddExpenseModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        isIncome={true}
      />
    </>
  )
}
