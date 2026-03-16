"use client"

import { useState } from "react"
import { Calendar as CalendarIcon, Plus } from "lucide-react"
import AddExpenseModal from "./AddExpenseModal"

export default function ExpensesHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your transactions in one place.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
          <button className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-4 py-2.5 rounded-xl font-medium shadow-sm hover:bg-secondary/80 hover:scale-[1.02] transition-all cursor-pointer">
            <CalendarIcon className="w-4 h-4" />
            Custom Range
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] hover:brightness-110 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>
      </div>

      <AddExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}
