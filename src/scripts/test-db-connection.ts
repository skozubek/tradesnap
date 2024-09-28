// File: /src/scripts/test-db-connection.ts

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('Attempting to connect to the database...')
    await prisma.$connect()
    console.log('Successfully connected to the database!')

    // Try to query the database
    const userCount = await prisma.user.count()
    console.log(`Number of users in the database: ${userCount}`)

    // Test creating a user
    const testUser = await prisma.user.create({
      data: {
        email: 'test1@example.com',
        name: 'Test User',
      },
    })
    console.log('Test user created:', testUser)

    // Delete the test user
    await prisma.user.delete({
      where: { id: testUser.id },
    })
    console.log('Test user deleted')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
    console.log('Disconnected from the database')
  }
}

testConnection()