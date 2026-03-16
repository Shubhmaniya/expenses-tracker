"use client"

import { useState } from "react"
import { Wallet } from "lucide-react"
import AddBudgetModal from "./AddBudgetModal"

export default function BudgetsHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground mt-1">
            Set and manage your monthly spending limits.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] hover:brightness-110 transition-all active:scale-95 cursor-pointer"
        >
          <Wallet className="w-5 h-5" />
          Create Budget
        </button>
      </div>

      <AddBudgetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}
