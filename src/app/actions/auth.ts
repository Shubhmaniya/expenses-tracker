"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function registerUser(formData: any) {
  const { name, email, password } = formData

  if (!email || !password) {
    return { error: "Missing email or password" }
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { error: "User already exists" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })

    return { success: true, user: { id: user.id, email: user.email } }
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Failed to create user" }
  }
}
