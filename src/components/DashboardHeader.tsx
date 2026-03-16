"use client"

import { useState } from "react"
import { Plus, Wallet, TrendingUp } from "lucide-react"
import AddExpenseModal from "./AddExpenseModal"
import AddBudgetModal from "./AddBudgetModal"

export default function DashboardHeader() {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)

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
            onClick={() => setIsBudgetModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-5 py-3 rounded-xl font-semibold shadow-sm hover:bg-secondary/80 hover:scale-[1.02] hover:brightness-105 transition-all active:scale-95 cursor-pointer"
          >
            <Wallet className="w-5 h-5 text-indigo-500" />
            Add Budget
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
      
      <AddBudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />
    </>
  )
}
