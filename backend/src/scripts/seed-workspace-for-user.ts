import "dotenv/config";
import { prisma } from "../lib/prismaClient.js";
import {
  Prisma,
  BoardRole,
  WorkspaceRole,
  BoardVisibility,
  MemberManageRestrictions,
  CommentingRestrictions,
  WorkspaceVisibility,
  WorkspaceType,
  MembershipRestrictions,
  BoardCreationRestrictions,
  BoardSharing,
  SlackSharing,
  Color,
} from "@prisma/client";

// Usage:
//   SEED_USER_ID=<uuid> pnpm --filter backend seed:user
// or pass as argv[2]

// const FALLBACK_USER_ID = "abece719-0929-4a21-a672-56a12d4e1d49";
const FALLBACK_USER_ID = "06c831cd-a26c-4e58-a875-8a706a18fc58"; //caspi
const USER_ID = process.env.SEED_USER_ID || process.argv[2] || FALLBACK_USER_ID;

async function main() {
  if (!USER_ID) throw new Error("Missing USER_ID (env SEED_USER_ID or argv)");

  console.log(`Seeding demo data for user: ${USER_ID}`);

  // Ensure user exists with minimal details
  const user = await prisma.user.upsert({
    where: { id: USER_ID },
    update: {},
    create: {
      id: USER_ID,
      clerkId: `seed_${USER_ID.slice(0, 8)}`,
      email: `seed+${USER_ID.slice(0, 8)}@example.com`,
      fullName: "Seed User",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
    },
  });

  // Create a workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: "Demo Workspace",
      description: "Seeded workspace with one board, lists, and cards",
      visibility: WorkspaceVisibility.Private,
      premium: false,
      type: WorkspaceType.EngineeringIt,
      createdBy: user.id,
      workspaceMembershipRestrictions: MembershipRestrictions.Anybody,
      publicBoardCreation: BoardCreationRestrictions.WorkspaceMember,
      workspaceBoardCreation: BoardCreationRestrictions.WorkspaceMember,
      privateBoardCreation: BoardCreationRestrictions.WorkspaceMember,
      publicBoardDeletion: BoardCreationRestrictions.WorkspaceAdmin,
      workspaceBoardDeletion: BoardCreationRestrictions.WorkspaceAdmin,
      privateBoardDeletion: BoardCreationRestrictions.WorkspaceAdmin,
      allowGuestSharing: BoardSharing.Anybody,
      allowSlackIntegration: SlackSharing.WorkspaceMember,
    },
  });

  // Add user as workspace admin
  await prisma.workspaceMember.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      role: WorkspaceRole.Admin,
    },
  });

  // Create a board
  const board = await prisma.board.create({
    data: {
      workspaceId: workspace.id,
      name: "Demo Board",
      description: "A demo board with a few lists and cards",
      background: "Tree",
      createdBy: user.id,
      allowCovers: true,
      showComplete: true,
      visibility: BoardVisibility.Private,
      memberManage: MemberManageRestrictions.Admins,
      commenting: CommentingRestrictions.BoardMembers,
    },
  });

  // Add user as board admin
  await prisma.boardMember.create({
    data: { boardId: board.id, userId: user.id, role: BoardRole.Admin },
  });

  // Create labels
  const labelColors: Array<{ name: string | null; color: Color }> = [
    { name: "Bug", color: Color.Red },
    { name: "Feature", color: Color.Green },
    { name: "Chore", color: Color.Yellow },
    { name: "Idea", color: Color.Purple },
    { name: null, color: Color.Blue },
  ];
  const labels = await prisma.$transaction(
    labelColors.map((l) =>
      prisma.label.create({
        data: { boardId: board.id, name: l.name, color: l.color },
      })
    )
  );

  // Create lists
  const listNames = ["Backlog", "In Progress", "Review", "Done"];
  const toDec = (n: number) => new (Prisma as any).Decimal(n);
  const lists = await Promise.all(
    listNames.map((name, idx) =>
      prisma.list.create({
        data: {
          boardId: board.id,
          name,
          position: toDec((idx + 1) * 100) as any,
          isArchived: false,
          subscribed: false,
        },
      })
    )
  );

  // Helper declared above

  // Create cards
  for (const [li, list] of lists.entries()) {
    for (let ci = 0; ci < 5; ci++) {
      const card = await prisma.card.create({
        data: {
          listId: list.id,
          title: `${list.name} Task #${ci + 1}`,
          description:
            ci % 2 === 0 ? `Description for ${list.name} task ${ci + 1}` : null,
          position: toDec((ci + 1) * 100),
          isArchived: false,
          createdBy: user.id,
          startDate: ci === 0 ? new Date() : null,
          dueDate:
            ci === 0 ? new Date(Date.now() + 7 * 24 * 3600 * 1000) : null,
        },
      });

      // Add 1-2 labels to first few cards
      if (ci < 3) {
        await prisma.cardLabel.createMany({
          data: labels
            .slice(0, 2)
            .map((l) => ({ cardId: card.id, labelId: l.id })),
          skipDuplicates: true,
        });
      }

      // Add a comment
      await prisma.comment.create({
        data: {
          cardId: card.id,
          userId: user.id,
          text: `Seeded comment on ${card.title}`,
        },
      });
    }
  }

  console.log("✅ Seeded workspace, board, lists and cards");
  console.log("Workspace:", workspace.id);
  console.log("Board:", board.id);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
