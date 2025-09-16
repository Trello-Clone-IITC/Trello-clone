import { prisma } from "../lib/prismaClient.js";
import { BoardRole } from "@prisma/client";

// DEV values — remove after wiring real auth
const DEV_USER_ID = "96099bc0-34b7-4be5-b410-4d624cd99da5"; // TODO: remove
const DEV_CLERK_ID = "dev_clerk_aimans"; // TODO: remove
const DEV_EMAIL = "dev+aimans@example.com"; // TODO: remove
const DEV_FULL_NAME = "Aiman Dev"; // TODO: remove
const DEV_AVATAR = "https://i.pravatar.cc/150?img=3"; // TODO: remove

// Target board to ensure membership on
const BOARD_ID = "97892bc8-4423-49e8-9630-e9c474b6a772"; // same as BoardExample

async function main() {
  const board = await prisma.board.findUnique({ where: { id: BOARD_ID } });
  if (!board) {
    throw new Error(`Board not found: ${BOARD_ID}`);
  }

  // Ensure user exists
  await prisma.user.upsert({
    where: { id: DEV_USER_ID },
    update: {},
    create: {
      id: DEV_USER_ID,
      clerkId: DEV_CLERK_ID,
      email: DEV_EMAIL,
      fullName: DEV_FULL_NAME,
      avatarUrl: DEV_AVATAR,
    },
  });

  // Ensure membership
  await prisma.boardMember.upsert({
    where: { boardId_userId: { boardId: BOARD_ID, userId: DEV_USER_ID } },
    update: {},
    create: { boardId: BOARD_ID, userId: DEV_USER_ID, role: BoardRole.Member },
  });

  console.log(`✅ Ensured membership for user ${DEV_USER_ID} on board ${BOARD_ID}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
