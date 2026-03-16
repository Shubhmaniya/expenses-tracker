"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getAnalyticsData() {
  const session = await getServerSession(authOptions)
  if (!session?.user || !(session.user as any).id) {
    return null
  }

  const userId = (session.user as any).id

  const expenses = await prisma.expense.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: "desc" },
  })

  // Total income and expenses
  let totalIncome = 0
  let totalExpenses = 0
  expenses.forEach((e) => {
    if (e.category.name === "Income") {
      totalIncome += e.amount
    } else if (e.category.name !== "Savings") {
      totalExpenses += e.amount
    }
  })

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

  // Category breakdown (expenses only, excluding Income/Savings)
  const catMap = new Map<string, number>()
  expenses.forEach((e) => {
    if (e.category.name !== "Income" && e.category.name !== "Savings") {
      catMap.set(e.category.name, (catMap.get(e.category.name) || 0) + e.amount)
    }
  })
  const categorySpending = Array.from(catMap.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)

  const highestCategory = categorySpending.length > 0 ? categorySpending[0] : null
  const highestCategoryPercent = totalExpenses > 0 && highestCategory
    ? Math.round((highestCategory.amount / totalExpenses) * 100)
    : 0

  // Daily average
  const uniqueDays = new Set(expenses.filter(e => e.category.name !== "Income" && e.category.name !== "Savings").map(e => new Date(e.date).toISOString().split("T")[0]))
  const dailyAverage = uniqueDays.size > 0 ? totalExpenses / uniqueDays.size : 0

  // Monthly trend (last 6 months)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const now = new Date()
  const monthlyTrend: { month: string; income: number; expenses: number }[] = []
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59)
    const label = months[d.getMonth()]

    let mIncome = 0
    let mExpenses = 0
    expenses.forEach((e) => {
      const eDate = new Date(e.date)
      if (eDate >= d && eDate <= monthEnd) {
        if (e.category.name === "Income") {
          mIncome += e.amount
        } else if (e.category.name !== "Savings") {
          mExpenses += e.amount
        }
      }
    })
    monthlyTrend.push({ month: label, income: mIncome, expenses: mExpenses })
  }

  return {
    totalIncome,
    totalExpenses,
    savingsRate: Math.round(savingsRate * 10) / 10,
    highestCategory: highestCategory?.category || "N/A",
    highestCategoryPercent,
    dailyAverage: Math.round(dailyAverage * 100) / 100,
    categorySpending,
    monthlyTrend,
    expenseCount: expenses.length,
  }
}

export async function getExpensesForExport() {
  const session = await getServerSession(authOptions)
  if (!session?.user || !(session.user as any).id) {
    return []
  }

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
