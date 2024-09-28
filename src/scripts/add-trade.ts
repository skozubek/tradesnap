// file: /src/scripts/add-trade.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function addTrade() {
  try {
    console.log('Connecting to the database...')
    await prisma.$connect()
    console.log('Successfully connected to the database')

    // Step 1: Create a user with a hashed password
    const hashedPassword = await bcrypt.hash('dupadupa', 10)
    const user = await prisma.user.create({
      data: {
        email: 'testuser2@example.com',
        name: 'Test User 2',
        password: hashedPassword,
      },
    })
    console.log('User created:', user)

    // Step 2: Create a trade for the user
    const trade = await prisma.trade.create({
      data: {
        userId: user.id,
        symbol: 'AAPL',
        amount: 10,
        price: 150.50,
        type: 'BUY',
      },
    })
    console.log('Trade created:', trade)

    // Step 3: Fetch the user with their trades
    const userWithTrades = await prisma.user.findUnique({
      where: { id: user.id },
      include: { trades: true },
    })
    console.log('User with trades:', userWithTrades)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
    console.log('Disconnected from the database')
  }
}

addTrade()