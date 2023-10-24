import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminUser = await prisma.user.upsert({
    where: { email: 'dummy_admin@sdos.com' },
    update: {},
    create: {
      email: 'dummy_admin@sdos.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
      role: Role.ADMIN,
    },
  });
  console.log(adminUser);
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
