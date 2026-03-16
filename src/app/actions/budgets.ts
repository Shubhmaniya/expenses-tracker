"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function createBudget(formData: {
  amount: number
  categoryId: string
  period: string
}) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !(session.user as any).id) {
      return { error: "You must be logged in to create a budget" }
    }

    const userId = (session.user as any).id
    
    const dbUser = await prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (!dbUser) {
      return { error: "User session is invalid. Please log out and sign in again." }
    }

    // Check if budget for this category and period already exists
    const existingBudget = await prisma.budget.findFirst({
      where: {
        userId,
        categoryId: formData.categoryId,
        period: formData.period
      }
    })

    if (existingBudget) {
      // Update existing
      await prisma.budget.update({
        where: { id: existingBudget.id },
        data: { amount: formData.amount }
      })
    } else {
      // Create new
      await prisma.budget.create({
        data: {
          amount: formData.amount,
          categoryId: formData.categoryId,
          period: formData.period,
          userId: userId,
        },
      })
    }

    revalidatePath("/")
    revalidatePath("/budgets")
    return { success: true }
  } catch (error) {
    console.error("Failed to create budget:", error)
    return { error: "Failed to create budget" }
  }
}
