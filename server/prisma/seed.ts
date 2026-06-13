import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';
import { SINGLE_USER_ID } from '../src/common/constants/single-user.constants';

const pool = new Pool({
  connectionString: process.env['DATABASE_URL'],
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
