const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany()
  console.log('✅ Database connected! User count:', users.length)
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ Error:', e)
    prisma.$disconnect()
  })