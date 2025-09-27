import "dotenv/config";
import {
  PrismaClient,
  Prisma,
  Theme,
  BoardVisibility,
  MemberManageRestrictions,
  CommentingRestrictions,
  BoardRole,
  BoardSharing,
  BoardCreationRestrictions,
  WorkspaceRole,
  WorkspaceType,
  WorkspaceVisibility,
  MembershipRestrictions,
  SlackSharing,
  ActivityAction,
} from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient({ log: ["warn", "error"] });

const USERS = parseInt(process.env.SEED_USERS ?? "40", 10);
const WORKSPACES = parseInt(process.env.SEED_WORKSPACES ?? "10", 10);
const BOARDS_PER_WS = parseInt(process.env.SEED_BOARDS_PER_WS ?? "4", 10);
const LISTS_PER_BOARD = parseInt(process.env.SEED_LISTS_PER_BOARD ?? "4", 10);
const CARDS_PER_LIST = parseInt(process.env.SEED_CARDS_PER_LIST ?? "8", 10);
const DO_RESET = true;
const CONCURRENCY = 12; // how many parallel Prisma ops allowed

// Helpers
const listPos = (i: number) => new Prisma.Decimal((i + 1) * 100);
const cardPos = (i: number) => new Prisma.Decimal((i + 1) * 100);
const checklistPos = (i: number) => new Prisma.Decimal((i + 1) * 1000);

function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pickSome<T>(arr: T[], max = 3): T[] {
  const count = Math.min(
    arr.length,
    Math.max(0, Math.floor(Math.random() * (max + 1)))
  );
  return faker.helpers.arrayElements(arr, count);
}

function pLimit(n: number) {
  let active = 0;
  const queue: Array<() => void> = [];
  const next = () => {
    if (active >= n || queue.length === 0) return;
    active++;
    const run = queue.shift()!;
    run();
  };
  return <T>(fn: () => Promise<T>) =>
    new Promise<T>((resolve, reject) => {
      const runner = () =>
        fn().then(
          (v) => {
            active--;
            resolve(v);
            next();
          },
          (e) => {
            active--;
            reject(e);
            next();
          }
        );
      queue.push(runner);
      next();
    });
}

// Reset DB helper
async function resetDb() {
  const tables = [
    "activity_log",
    "attachments",
    "board_members",
    "card_assignees",
    "card_labels",
    "card_watchers",
    "checklist_item_assignees",
    "checklist_items",
    "checklists",
    "comments",
    "labels",
    "lists",
    "cards",
    "boards",
    "workspace_members",
    "workspaces",
    "users",
    "inboxes",
  ];
  const sql = `TRUNCATE ${tables
    .map((t) => `"${t}"`)
    .join(", ")} RESTART IDENTITY CASCADE;`;
  await prisma.$executeRawUnsafe(sql);
}

async function main() {
  await prisma.$connect();

  if (DO_RESET) {
    console.log("Resetting DB…");
    await resetDb();
    return;
  }

  // USERS
  console.log("👤 Creating users…");
  const users: { id: string; email: string }[] = [];
  for (let i = 0; i < USERS; i++) {
    const fullName = faker.person.fullName();
    const email = faker.internet
      .email({
        firstName: fullName.split(" ")[0],
        lastName: fullName.split(" ").slice(-1)[0],
      })
      .toLowerCase();
    const username = faker.internet.username().slice(0, 20).toLowerCase();

    const u = await prisma.user.create({
      data: {
        clerkId: `clerk_${faker.string.alphanumeric({ length: 16 })}`,
        email,
        username,
        fullName,
        avatarUrl: faker.image.avatar(),
        theme: faker.helpers.arrayElement([
          Theme.Light,
          Theme.Dark,
          Theme.System,
        ]),
        emailNotification: faker.datatype.boolean(),
        pushNotification: faker.datatype.boolean(),
        bio: faker.datatype.boolean() ? faker.lorem.sentence() : null,
        recentlyViewedBoards: [],
      },
      select: { id: true, email: true },
    });
    users.push(u);
  }

  // WORKSPACES
  console.log("🏢 Creating workspaces & memberships…");
  const workspaces: { id: string; memberIds: string[] }[] = [];
  for (let i = 0; i < WORKSPACES; i++) {
    const creator = pickOne(users);
    const ws = await prisma.workspace.create({
      data: {
        name: `${faker.company.name()} Workspace`,
        description: faker.datatype.boolean()
          ? faker.company.catchPhrase()
          : null,
        visibility: faker.helpers.arrayElement([
          WorkspaceVisibility.Private,
          WorkspaceVisibility.Public,
        ]),
        premium: faker.datatype.boolean() && Math.random() < 0.2,
        type: faker.helpers.arrayElement(Object.values(WorkspaceType)),
        createdBy: creator.id,
        workspaceMembershipRestrictions: faker.helpers.arrayElement(
          Object.values(MembershipRestrictions)
        ),
        publicBoardCreation: BoardCreationRestrictions.WorkspaceMember,
        workspaceBoardCreation: BoardCreationRestrictions.WorkspaceMember,
        privateBoardCreation: BoardCreationRestrictions.WorkspaceMember,
        publicBoardDeletion: BoardCreationRestrictions.WorkspaceMember,
        workspaceBoardDeletion: BoardCreationRestrictions.WorkspaceMember,
        privateBoardDeletion: BoardCreationRestrictions.WorkspaceMember,
        allowGuestSharing: faker.helpers.arrayElement(
          Object.values(BoardSharing)
        ),
        allowSlackIntegration: SlackSharing.WorkspaceMember,
      },
      select: { id: true },
    });

    const memberPool = users.filter((u) => u.id !== creator.id);
    const selectedMembers = pickSome(memberPool, Math.min(USERS - 1, 10));
    const memberIds = [creator.id, ...selectedMembers.map((m) => m.id)];

    await prisma.workspaceMember.createMany({
      data: memberIds.map((id) => ({
        workspaceId: ws.id,
        userId: id,
        role: id === creator.id ? WorkspaceRole.Admin : WorkspaceRole.Member,
      })),
      skipDuplicates: true,
    });

    workspaces.push({ id: ws.id, memberIds });
  }

  // BOARDS
  console.log("📋 Creating boards, labels, and lists…");
  const boards: { id: string; memberIds: string[] }[] = [];
  for (const ws of workspaces) {
    for (let b = 0; b < BOARDS_PER_WS; b++) {
      const boardCreator = pickOne(ws.memberIds);
      const board = await prisma.board.create({
        data: {
          workspaceId: ws.id,
          name: faker.commerce.department() + " Board",
          description: faker.datatype.boolean() ? faker.lorem.sentence() : null,
          background: faker.image.urlPicsumPhotos(),
          createdBy: boardCreator,
          allowCovers: true,
          showComplete: true,
          visibility: BoardVisibility.WorkspaceMembers,
          memberManage: MemberManageRestrictions.Members,
          commenting: CommentingRestrictions.BoardMembers,
        },
        select: { id: true },
      });

      const others = pickSome(
        ws.memberIds.filter((id) => id !== boardCreator),
        6
      );
      const boardMemberIds = [boardCreator, ...others];

      await prisma.boardMember.createMany({
        data: boardMemberIds.map((id) => ({
          boardId: board.id,
          userId: id,
          role: id === boardCreator ? BoardRole.Admin : BoardRole.Member,
        })),
        skipDuplicates: true,
      });

      const labelColors = [
        "#61bd4f",
        "#f2d600",
        "#ff9f1a",
        "#eb5a46",
        "#c377e0",
        "#00c2e0",
      ];
      await prisma.label.createMany({
        data: labelColors.map((c, i) => ({
          boardId: board.id,
          name: faker.commerce.productAdjective() + " " + (i + 1),
          color: c,
        })),
        skipDuplicates: true,
      });

      for (let li = 0; li < LISTS_PER_BOARD; li++) {
        await prisma.list.create({
          data: {
            boardId: board.id,
            name: ["To Do", "Doing", "Done", faker.commerce.productName()][
              li % 4
            ],
            position: listPos(li),
            isArchived: false,
            subscribed: false,
          },
        });
      }

      boards.push({ id: board.id, memberIds: boardMemberIds });
    }
  }

  // CARDS with concurrency
  console.log("🃏 Creating cards (+ relations) with concurrency…");
  const limit = pLimit(CONCURRENCY);
  const tasks: Promise<any>[] = [];

  for (const b of boards) {
    const lists = await prisma.list.findMany({
      where: { boardId: b.id },
      select: { id: true },
    });
    const labels = await prisma.label.findMany({
      where: { boardId: b.id },
      select: { id: true },
    });

    for (const [li, list] of lists.entries()) {
      for (let ci = 0; ci < CARDS_PER_LIST; ci++) {
        tasks.push(
          limit(async () => {
            const creator = pickOne(b.memberIds);

            const card = await prisma.card.create({
              data: {
                listId: list.id,
                title: faker.commerce.productName(),
                description: faker.datatype.boolean()
                  ? faker.lorem.paragraph()
                  : null,
                dueDate:
                  Math.random() < 0.4 ? faker.date.soon({ days: 45 }) : null,
                startDate:
                  Math.random() < 0.2 ? faker.date.recent({ days: 20 }) : null,
                position: cardPos(ci),
                isArchived: false,
                createdBy: creator,
                coverImageUrl:
                  Math.random() < 0.25 ? faker.image.urlPicsumPhotos() : null,
                subscribed: Math.random() < 0.15,
              },
              select: { id: true },
            });

            // Assignees
            const assignees = pickSome(b.memberIds, 3);
            if (assignees.length) {
              await prisma.cardAssignee.createMany({
                data: assignees.map((uid) => ({
                  cardId: card.id,
                  userId: uid,
                })),
                skipDuplicates: true,
              });
            }

            // Watchers
            const watchers = pickSome(b.memberIds, 4);
            if (watchers.length) {
              await prisma.cardWatcher.createMany({
                data: watchers.map((uid) => ({ cardId: card.id, userId: uid })),
                skipDuplicates: true,
              });
            }

            // Labels
            const chosenLabels = pickSome(labels, 3);
            if (chosenLabels.length) {
              await prisma.cardLabel.createMany({
                data: chosenLabels.map((l) => ({
                  cardId: card.id,
                  labelId: l.id,
                })),
                skipDuplicates: true,
              });
            }

            // Comments
            const commentsCount = Math.floor(Math.random() * 4);
            if (commentsCount) {
              const commentsData = Array.from({ length: commentsCount }).map(
                () => ({
                  cardId: card.id,
                  userId: pickOne(b.memberIds),
                  text: faker.lorem.sentence(),
                })
              );
              await prisma.comment.createMany({ data: commentsData });
            }

            // Activity
            await prisma.activityLog.create({
              data: {
                boardId: b.id,
                cardId: card.id,
                userId: creator,
                action: ActivityAction.Created,
                payload: { seeded: true },
              },
            });
          })
        );
      }
    }
  }

  await Promise.all(tasks);

  // RECENTLY VIEWED BOARDS
  console.log("👀 Updating recentlyViewedBoards for users...");
  for (const u of users) {
    const someBoards = pickSome(
      boards.map((b) => b.id),
      3
    );
    await prisma.user.update({
      where: { id: u.id },
      data: { recentlyViewedBoards: { set: someBoards } },
    });
  }

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
