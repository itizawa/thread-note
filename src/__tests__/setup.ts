import { Prisma, PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://app_user:local-password@localhost:5432/test",
    },
  },
});

export const cleanUpAllTableForTest = async () => {
  // 外部キー制約を一時的に無効化
  await prisma.$executeRawUnsafe('SET session_replication_role = replica;');
  
  const tableNames = Prisma.dmmf.datamodel.models.map((model) => model.dbName);

  const targetTables = [
    ...tableNames.filter((tableName) => !!tableName),
    "Account",
    "Authenticator", 
    "Session",
    "User",
  ];

  const truncateQuery = `TRUNCATE TABLE ${targetTables
    .map((t) => `"${t}"`)
    .join(", ")} RESTART IDENTITY CASCADE;`;
  await prisma.$executeRawUnsafe(truncateQuery);
  
  // 外部キー制約を再有効化
  await prisma.$executeRawUnsafe('SET session_replication_role = DEFAULT;');
};

beforeAll(async () => {
  await cleanUpAllTableForTest();
});

beforeEach(async () => {
  await cleanUpAllTableForTest();
});

afterAll(async () => {
  await prisma.$disconnect();
});
