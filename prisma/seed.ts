import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { id: "agreement", email: "agreement@example.com", name: "賞賛BOT" },
      { id: "feedback", email: "feedback@example.com", name: "指摘BOT" },
      { id: "survey", email: "survey@example.com", name: "調査BOT" },
    ],
  });

  await prisma.plan.createMany({
    data: [
      { id: "ea4d1b33-371c-4358-84f1-3734ff9249c6", name: "admin" },
      { id: "0a01a8ba-26a7-4d0e-8e72-41de75cc9aa4", name: "premium" },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
