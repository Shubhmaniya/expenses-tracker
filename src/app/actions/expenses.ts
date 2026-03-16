"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function createExpense(formData: {
  amount: number
  description: string
  categoryId: string
  date: string
  merchant?: string
  notes?: string
}) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !(session.user as any).id) {
      return { error: "You must be logged in to create an expense" }
    }

    const userId = (session.user as any).id
    
    // Verify user actually exists in the database (handles stale sessions if DB was reset)
    const dbUser = await prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (!dbUser) {
      return { error: "User session is invalid. Please log out and sign in again." }
    }

    await prisma.expense.create({
      data: {
        amount: formData.amount,
        description: formData.description,
        categoryId: formData.categoryId,
        date: new Date(formData.date),
        merchant: formData.merchant,
        notes: formData.notes,
        userId: userId,
      },
    })

    revalidatePath("/")
    revalidatePath("/expenses")
    return { success: true }
  } catch (error) {
    console.error("Failed to create expense:", error)
    return { error: "Failed to create expense" }
  }
}

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })
}
