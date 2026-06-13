import { PrismaClient } from '@prisma/client';
import { SINGLE_USER_ID } from '../src/common/constants/single-user.constants';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.user.upsert({
    where: { id: SINGLE_USER_ID },
    update: {},
    create: {
      id: SINGLE_USER_ID,
      externalAuthId: SINGLE_USER_ID,
      email: 'user@dietmanager.local',
    },
  });

  console.log(`Single user seeded: ${SINGLE_USER_ID}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
