import { prisma } from "../lib/prismaClient.js";

async function main() {
  // Find users without an inbox
  const users = await prisma.user.findMany({
    where: { inbox: null },
    select: { id: true },
  });

  console.log(`Creating inboxes for ${users.length} users...`);

  for (const user of users) {
    await prisma.inbox.create({
      data: { userId: user.id },
    });
  }

  console.log("✅ All missing inboxes created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
