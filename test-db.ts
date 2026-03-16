import { PrismaClient } from '@prisma/client'
import { PrismaLibsql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const libsql = createClient({
  url: 'file:dev.db',
})
const adapter = new PrismaLibsql(libsql)
const prisma = new PrismaClient({ adapter })

async function test() {
  try {
    console.log('Testing connection with Libsql adapter...')
    const categories = await prisma.category.findMany()
    console.log('Results:', categories)
  } catch (e) {
    console.error('Connection failed:', e)
  } finally {
    await prisma.$disconnect()
  }
}
test()
