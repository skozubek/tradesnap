// File: src/scripts/createUser.ts
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'yoo@example.com';
  const password = 'password123';

  console.log('Starting user creation process...');

  try {
    console.log('Hashing password...');
    const hashedPassword = await hash(password, 10);

    console.log('Attempting to create user in database...');
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    console.log(`Successfully created user: ${user.email}`);
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

main()
  .catch((e) => {
    console.error('Unhandled error in main function:', e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Disconnecting from database...');
    await prisma.$disconnect();
    console.log('Script execution complete.');
  });