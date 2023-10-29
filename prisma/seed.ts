import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const organizations = await prisma.organization.upsert({
    where: { name: 'Indraprastha Institute of Information Technology Delhi' },
    update: {},
    create: {
      name: 'Indraprastha Institute of Information Technology Delhi',
    },
  });
  const adminUser = await prisma.user.upsert({
    where: { email: 'dummy_admin@sdos.com' },
    update: {},
    create: {
      email: 'dummy_admin@sdos.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
      role: Role.ADMIN,
      orgId: 1,
    },
  });
  console.log(organizations, adminUser);
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
