import "dotenv/config";
import { PrismaClient, Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient({
  log: ["warn", "error"],
});

const USERS = parseInt(process.env.SEED_USERS ?? "20", 10);
const WORKSPACES = parseInt(process.env.SEED_WORKSPACES ?? "2", 10);
const BOARDS_PER_WS = parseInt(process.env.SEED_BOARDS_PER_WS ?? "3", 10);
const LISTS_PER_BOARD = parseInt(process.env.SEED_LISTS_PER_BOARD ?? "4", 10);
const CARDS_PER_LIST = parseInt(process.env.SEED_CARDS_PER_LIST ?? "8", 10);
const DO_RESET = true;
// const DO_RESET = (process.env.SEED_RESET ?? "false").toLowerCase() === "true";
const CONCURRENCY = parseInt(process.env.SEED_CONCURRENCY ?? "12", 10);

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
  }

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

    const u = await prisma.users.create({
      data: {
        clerk_id: `clerk_${faker.string.alphanumeric({ length: 16 })}`,
        email,
        username,
        full_name: fullName,
        avatar_url: faker.image.avatar(),
        theme: faker.helpers.arrayElement(["light", "dark", "system"]) as any,
        email_notification: faker.datatype.boolean(),
        push_notification: faker.datatype.boolean(),
        bio: faker.datatype.boolean() ? faker.lorem.sentence() : null,
      },
      select: { id: true, email: true },
    });
    users.push(u);
  }

  console.log("Creating workspaces & memberships…");
  const workspaces: { id: string; memberIds: string[] }[] = [];
  for (let i = 0; i < WORKSPACES; i++) {
    const creator = pickOne(users);
    const ws = await prisma.workspaces.create({
      data: {
        name: `${faker.company.name()} Workspace`,
        description: faker.datatype.boolean()
          ? faker.company.catchPhrase()
          : null,
        visibility: faker.helpers.arrayElement(["private", "public"]) as any,
        premium: faker.datatype.boolean() && Math.random() < 0.2,
        type: faker.helpers.arrayElement([
          "marketing",
          "sales_crm",
          "humen_resources",
          "small_business",
          "engineering_it",
          "education",
          "operations",
          "other",
        ]) as any,
        created_by: creator.id,
        workspace_membership_restrictions: faker.helpers.arrayElement([
          "anybody",
          "specific_domain",
        ]) as any,
        public_board_creation: "workspace_member",
        workspace_board_creation: "workspace_member",
        private_board_creation: "workspace_member",
        public_board_deletion: "workspace_member",
        workspace_board_deletion: "workspace_member",
        private_board_deletion: "workspace_member",
        allow_guest_sharing: faker.helpers.arrayElement([
          "anybody",
          "only_workspace_member",
        ]) as any,
        allow_slack_integration: "workspace_member",
      },
      select: { id: true },
    });

    const memberPool = users.filter((u) => u.id !== creator.id);
    const selectedMembers = pickSome(memberPool, Math.min(USERS - 1, 10));
    const memberIds = [creator.id, ...selectedMembers.map((m) => m.id)];

    await prisma.workspace_members.createMany({
      data: memberIds.map((id) => ({
        workspace_id: ws.id,
        user_id: id,
        role: id === creator.id ? ("admin" as any) : ("member" as any),
      })),
      skipDuplicates: true,
    });

    workspaces.push({ id: ws.id, memberIds });
  }

  console.log("Creating boards, labels, and lists…");
  const boards: { id: string; memberIds: string[] }[] = [];
  for (const ws of workspaces) {
    for (let b = 0; b < BOARDS_PER_WS; b++) {
      const boardCreator = pickOne(ws.memberIds);
      const board = await prisma.boards.create({
        data: {
          workspace_id: ws.id,
          name: faker.commerce.department() + " Board",
          description: faker.datatype.boolean() ? faker.lorem.sentence() : null,
          background: faker.image.urlPicsumPhotos(),
          created_by: boardCreator,
          allow_covers: true,
          show_complete: true,
          visibility: "workspace_members",
          member_manage: "members",
          commenting: "board_members",
        },
        select: { id: true },
      });

      const others = pickSome(
        ws.memberIds.filter((id) => id !== boardCreator),
        6
      );
      const boardMemberIds = [boardCreator, ...others];

      await prisma.board_members.createMany({
        data: boardMemberIds.map((id) => ({
          board_id: board.id,
          user_id: id,
          role: id === boardCreator ? ("admin" as any) : ("member" as any),
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
      await prisma.labels.createMany({
        data: labelColors.map((c, i) => ({
          board_id: board.id,
          name: faker.commerce.productAdjective() + " " + (i + 1),
          color: c,
        })),
        skipDuplicates: true,
      });

      // lists
      for (let li = 0; li < LISTS_PER_BOARD; li++) {
        await prisma.lists.create({
          data: {
            board_id: board.id,
            name: ["To Do", "Doing", "Done", faker.commerce.productName()][
              li % 4
            ],
            position: listPos(li),
            is_archived: false,
            subscribed: false,
          },
        });
      }

      boards.push({ id: board.id, memberIds: boardMemberIds });
    }
  }

  console.log("Creating cards (+ relations) with concurrency…");
  const labelsByBoard: Record<string, { id: string }[]> = {};
  for (const b of boards) {
    labelsByBoard[b.id] = await prisma.labels.findMany({
      where: { board_id: b.id },
      select: { id: true },
    });
  }

  const limit = pLimit(CONCURRENCY);
  let createdCards = 0;
  let failedCards = 0;

  const boardListMap: Record<string, { id: string }[]> = {};
  for (const b of boards) {
    boardListMap[b.id] = await prisma.lists.findMany({
      where: { board_id: b.id },
      select: { id: true },
    });
  }

  const allTasks: Promise<any>[] = [];

  for (const b of boards) {
    const lists = boardListMap[b.id];

    for (const [li, list] of lists.entries()) {
      for (let ci = 0; ci < CARDS_PER_LIST; ci++) {
        allTasks.push(
          limit(async () => {
            try {
              const creator = pickOne(b.memberIds);

              const card = await prisma.cards.create({
                data: {
                  list_id: list.id,
                  title: faker.commerce.productName(),
                  description: faker.datatype.boolean()
                    ? faker.lorem.paragraph()
                    : null,
                  due_date:
                    Math.random() < 0.4 ? faker.date.soon({ days: 45 }) : null,
                  start_date:
                    Math.random() < 0.2
                      ? faker.date.recent({ days: 20 })
                      : null,
                  position: cardPos(ci),
                  is_archived: false,
                  created_by: creator,
                  cover_image_url:
                    Math.random() < 0.25 ? faker.image.urlPicsumPhotos() : null,
                  subscribed: Math.random() < 0.15,
                },
                select: { id: true },
              });

              // Assignees
              const assignees = pickSome(b.memberIds, 3);
              if (assignees.length) {
                await prisma.card_assignees.createMany({
                  data: assignees.map((uid) => ({
                    card_id: card.id,
                    user_id: uid,
                  })),
                  skipDuplicates: true,
                });
              }

              // Watchers
              const watchers = pickSome(b.memberIds, 4);
              if (watchers.length) {
                await prisma.card_watchers.createMany({
                  data: watchers.map((uid) => ({
                    card_id: card.id,
                    user_id: uid,
                  })),
                  skipDuplicates: true,
                });
              }

              // Labels
              const chosenLabels = pickSome(labelsByBoard[b.id], 3);
              if (chosenLabels.length) {
                await prisma.card_labels.createMany({
                  data: chosenLabels.map((l) => ({
                    card_id: card.id,
                    label_id: l.id,
                  })),
                  skipDuplicates: true,
                });
              }

              // Attachments
              const attachCount = Math.floor(Math.random() * 3);
              for (let a = 0; a < attachCount; a++) {
                await prisma.attachments.create({
                  data: {
                    card_id: card.id,
                    user_id: Math.random() < 0.7 ? pickOne(b.memberIds) : null,
                    url: faker.image.urlPicsumPhotos(),
                    filename: faker.system.fileName(),
                    bytes: BigInt(
                      faker.number.int({ min: 8000, max: 2_000_000 })
                    ),
                    meta: { alt: faker.lorem.words({ min: 1, max: 3 }) },
                  },
                });
              }

              // Comments
              const commentsCount = Math.floor(Math.random() * 6);
              if (commentsCount) {
                const commentsData = Array.from({ length: commentsCount }).map(
                  () => ({
                    card_id: card.id,
                    user_id: pickOne(b.memberIds),
                    text: faker.lorem.sentence(),
                  })
                );
                await prisma.comments.createMany({ data: commentsData });
              }

              // Checklists & items
              const checklistCount = Math.floor(Math.random() * 3);
              for (let ck = 0; ck < checklistCount; ck++) {
                const checklist = await prisma.checklists.create({
                  data: {
                    card_id: card.id,
                    title: faker.commerce.productAdjective() + " Checklist",
                    position: checklistPos(ck),
                  },
                  select: { id: true },
                });

                const itemsCount = faker.number.int({ min: 1, max: 5 });
                for (let it = 0; it < itemsCount; it++) {
                  const item = await prisma.checklist_items.create({
                    data: {
                      checklist_id: checklist.id,
                      text: faker.lorem.words({ min: 2, max: 6 }),
                      is_completed: Math.random() < 0.3,
                      due_date:
                        Math.random() < 0.2
                          ? faker.date.soon({ days: 30 })
                          : null,
                      position: checklistPos(it),
                    },
                    select: { id: true },
                  });

                  const itemAssignees = pickSome(b.memberIds, 2);
                  if (itemAssignees.length) {
                    await prisma.checklist_item_assignees.createMany({
                      data: itemAssignees.map((uid) => ({
                        item_id: item.id,
                        user_id: uid,
                      })),
                      skipDuplicates: true,
                    });
                  }
                }
              }

              // Activity
              await prisma.activity_log.create({
                data: {
                  board_id: b.id,
                  card_id: card.id,
                  user_id: creator,
                  action: "created",
                  payload: { seeded: true },
                },
              });

              createdCards++;
              if (createdCards % 25 === 0) {
                console.log(`Created ${createdCards} cards so far…`);
              }
            } catch (e: any) {
              failedCards++;
              const code = e?.code ? ` [${e.code}]` : "";
              const target = e?.meta?.target
                ? ` target=${JSON.stringify(e.meta.target)}`
                : "";
              console.error(
                `Card task failed${code}${target}:`,
                e?.message ?? e
              );
            }
          })
        );
      }
    }
  }

  const results = await Promise.allSettled(allTasks);
  const rejected = results.filter((r) => r.status === "rejected").length;

  console.log(
    `Cards finished. Created=${createdCards}, failed=${failedCards} (settled rejects=${rejected}).`
  );

  console.log("👀 Adding list watchers…");
  for (const b of boards) {
    const lists = await prisma.lists.findMany({
      where: { board_id: b.id },
      select: { id: true },
    });
    const watchers = pickSome(b.memberIds, 3);
    for (const list of lists) {
      if (watchers.length) {
        await prisma.list_watchers.createMany({
          data: watchers.map((uid) => ({ list_id: list.id, user_id: uid })),
          skipDuplicates: true,
        });
      }
    }
  }

  await prisma.boards.updateMany({ data: { last_activity_at: new Date() } });
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
