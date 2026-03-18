import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  { name: 'Food & Dining', color: '#EF4444', icon: 'Utensils' },
  { name: 'Travel', color: '#3B82F6', icon: 'Plane' },
  { name: 'Shopping', color: '#F59E0B', icon: 'ShoppingBag' },
  { name: 'Bills & Utilities', color: '#10B981', icon: 'FileText' },
  { name: 'Entertainment', color: '#8B5CF6', icon: 'Film' },
  { name: 'Health', color: '#EC4899', icon: 'Activity' },
  { name: 'Education', color: '#6366F1', icon: 'BookOpen' },
  { name: 'Savings', color: '#059669', icon: 'PiggyBank' },
  { name: 'Income', color: '#047857', icon: 'TrendingUp' },
  { name: 'Other', color: '#6B7280', icon: 'MoreHorizontal' },
]

async function main() {
  console.log('Start seeding...')
  
  for (const category of categories) {
    const existing = await prisma.category.findFirst({
      where: {
        name: category.name,
        userId: null,
      },
    })

    if (!existing) {
      await prisma.category.create({
        data: {
          name: category.name,
          color: category.color,
          icon: category.icon,
          userId: null,
        },
      })
      console.log(`Created category: ${category.name}`)
    } else {
      console.log(`Skipped (already exists): ${category.name}`)
    }
  }
  console.log('Seeding finished.')
  await prisma.$disconnect()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
