import {
  Prisma,
  PrismaClient,
  WorkspaceRole,
  WorkspaceType,
  BoardRole,
  BoardBackground,
  BoardVisibility,
  MemberManageRestrictions,
  CommentingRestrictions,
  Color,
} from "@prisma/client";

type SeedClient = PrismaClient | Prisma.TransactionClient;

type SeedMemberKey = "primary" | "memberA" | "memberB";

type CardCommentSpec = {
  member: SeedMemberKey;
  text: string;
};

type CardSpec = {
  title: string;
  description?: string;
  dueInDays?: number;
  startInDays?: number;
  labels?: string[];
  assignees?: SeedMemberKey[];
  comments?: CardCommentSpec[];
  coverImageUrl?: string;
  createdBy: SeedMemberKey;
};

type ListSpec = {
  name: string;
  cards: CardSpec[];
};

const positionFactory = (start = 1024, step = 1024) => {
  let current = start - step;
  return () => {
    current += step;
    return new Prisma.Decimal(current);
  };
};

const dueDateFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const labelDefinitions = [
  { name: "Infrastructure", color: Color.BoldBlack },
  { name: "Backend", color: Color.BoldBlue },
  { name: "Frontend", color: Color.BoldPink },
  { name: "Auth", color: Color.BoldPurple },
  { name: "DevOps", color: Color.BoldGreen },
  { name: "Bug", color: Color.Red },
  { name: "Design", color: Color.Pink },
  { name: "Docs", color: Color.Yellow },
] as const;

const listDefinitions: ListSpec[] = [
  {
    name: "Todo",
    cards: [
      {
        title: "Outline realtime sync strategy",
        description:
          "Decide between WebSocket rooms or channel fan-out for list updates.",
        dueInDays: 4,
        labels: ["Infrastructure", "Backend"],
        assignees: ["primary", "memberA"],
        comments: [
          {
            member: "primary",
            text: "Let’s compare Redis streams versus Postgres listen/notify.",
          },
        ],
        createdBy: "primary",
      },
      {
        title: "Spec board permissions matrix",
        description:
          "Capture allowed actions for guests, members, and admins across features.",
        dueInDays: 6,
        labels: ["Docs"],
        assignees: ["memberB"],
        comments: [
          {
            member: "memberB",
            text: "Drafting table format so product can sign off quickly.",
          },
        ],
        createdBy: "memberB",
      },
      {
        title: "Plan analytics event taxonomy",
        description: "List key board interactions to feed product analytics.",
        dueInDays: 7,
        labels: ["Docs", "Backend"],
        assignees: ["memberA"],
        comments: [
          {
            member: "memberA",
            text: "Added draft to shared doc—need naming review tomorrow.",
          },
        ],
        createdBy: "memberA",
      },
      {
        title: "Draft support escalation flow",
        labels: ["Docs"],
        assignees: ["memberB"],
        comments: [
          {
            member: "primary",
            text: "Include a step for cloning the failing board before triage.",
          },
        ],
        createdBy: "memberB",
      },
      {
        title: "Gather inspiration for board backgrounds",
        description: "Collect references for the curated background library.",
        coverImageUrl:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
        assignees: ["memberB"],
        comments: [
          {
            member: "memberB",
            text: "Pinning favorites in the design board—need final pick Monday.",
          },
        ],
        createdBy: "memberB",
      },
    ],
  },
  {
    name: "In Progress",
    cards: [
      {
        title: "Build list drag-and-drop interactions",
        description:
          "Ensure smooth reordering with optimistic updates and position math.",
        dueInDays: 2,
        startInDays: -3,
        labels: ["Frontend", "Backend"],
        assignees: ["primary", "memberA"],
        coverImageUrl:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
        comments: [
          {
            member: "primary",
            text: "Drag ghost renders cleanly; wiring persistence next.",
          },
          {
            member: "memberA",
            text: "API accepts Decimal positions now—ready for integration.",
          },
        ],
        createdBy: "primary",
      },
      {
        title: "Implement card composer inline flow",
        description: "Match Trello-style quick entry with keyboard shortcuts.",
        dueInDays: 3,
        startInDays: -1,
        labels: ["Frontend"],
        assignees: ["memberB"],
        comments: [
          {
            member: "memberB",
            text: "Accessibility pass is halfway—testing screen reader cues.",
          },
        ],
        createdBy: "memberB",
      },
      {
        title: "Wire notification preferences modal",
        description:
          "Allow users to toggle board, list, and card-level alerts.",
        labels: ["Frontend", "Design"],
        assignees: ["memberA", "memberB"],
        comments: [
          {
            member: "memberA",
            text: "Backend endpoints return stubs—need payload shape review.",
          },
        ],
        createdBy: "memberA",
      },
      {
        title: "Polish workspace switcher dropdown",
        description:
          "Add pinned boards section and keyboard navigation states.",
        dueInDays: 5,
        startInDays: -2,
        labels: ["Frontend", "Design"],
        assignees: ["memberB"],
        comments: [
          {
            member: "memberB",
            text: "Animation timing feels off—tweaking easing curves tonight.",
          },
        ],
        createdBy: "memberB",
      },
      {
        title: "Integrate board activity timeline",
        description:
          "Show recent moves, comments, and assignments in a unified feed.",
        dueInDays: 4,
        startInDays: -2,
        labels: ["Backend", "DevOps"],
        assignees: ["primary"],
        comments: [
          {
            member: "primary",
            text: "Need to paginate results; considering cursor on activity id.",
          },
        ],
        createdBy: "primary",
      },
    ],
  },
  {
    name: "Done",
    cards: [
      {
        title: "Workspace creation wizard",
        description:
          "Guided flow to set team name, avatar, and invitation rules.",
        dueInDays: -3,
        labels: ["Frontend", "Backend"],
        assignees: ["primary"],
        comments: [
          {
            member: "primary",
            text: "Merged to main; telemetry shows 96% completion rate.",
          },
        ],
        createdBy: "primary",
      },
      {
        title: "Board background presets",
        description:
          "Seeded curated Unsplash collection with light/dark options.",
        dueInDays: -2,
        labels: ["Design"],
        assignees: ["memberB"],
        comments: [
          {
            member: "memberB",
            text: "Added color-only options for performance sensitive boards.",
          },
        ],
        createdBy: "memberB",
      },
      {
        title: "Email invite templates",
        description:
          "Personalized copy for workspace invites and board sharing.",
        dueInDays: -1,
        labels: ["Docs"],
        assignees: ["memberA"],
        comments: [
          {
            member: "memberA",
            text: "Localized EN + HE versions, queued for proofread.",
          },
        ],
        createdBy: "memberA",
      },
      {
        title: "Board starring service",
        description: "Users can star boards and sync across devices.",
        dueInDays: -4,
        labels: ["Backend", "Infrastructure"],
        assignees: ["primary", "memberA"],
        comments: [
          {
            member: "memberA",
            text: "Redis cache warmup in place—no more dashboard flicker.",
          },
        ],
        createdBy: "memberA",
      },
      {
        title: "Card checklist MVP",
        description:
          "Create, toggle, and reorder checklist items inside a card.",
        dueInDays: -5,
        labels: ["Frontend"],
        assignees: ["memberB"],
        comments: [
          {
            member: "memberB",
            text: "QA passed on mobile and web—ready for rollout.",
          },
        ],
        createdBy: "memberB",
      },
    ],
  },
  {
    name: "Review",
    cards: [
      {
        title: "Board archiving UX copy",
        description:
          "Ensure messaging clarifies how to restore archived boards.",
        dueInDays: 1,
        labels: ["Docs", "Design"],
        assignees: ["memberB"],
        comments: [
          {
            member: "primary",
            text: "Can we add a note about retained automations?",
          },
        ],
        createdBy: "memberB",
      },
      {
        title: "Card cover color palette",
        description: "Review final palette before locking seed data.",
        dueInDays: 2,
        labels: ["Design"],
        assignees: ["memberB"],
        comments: [
          {
            member: "memberA",
            text: "Check contrast with badges; we had a bug last sprint.",
          },
        ],
        createdBy: "memberB",
      },
      {
        title: "Bulk move cards endpoint",
        description: "Confirm rate limits and audit logging before merge.",
        dueInDays: 1,
        labels: ["Backend", "DevOps"],
        assignees: ["primary", "memberA"],
        comments: [
          {
            member: "primary",
            text: "Logs verified; waiting on final approval.",
          },
        ],
        createdBy: "primary",
      },
      {
        title: "Workspace insights dashboard QA notes",
        description: "Triaging remaining visual issues before design signoff.",
        labels: ["Design", "Frontend"],
        assignees: ["memberB"],
        comments: [
          {
            member: "memberB",
            text: "Grid gutters aligned; waiting on chart color tweaks.",
          },
        ],
        createdBy: "memberB",
      },
      {
        title: "Mobile gesture parity checklist",
        description:
          "Ensure swipe to archive and long-press reorder mimic desktop.",
        dueInDays: 3,
        labels: ["Frontend"],
        assignees: ["memberA", "memberB"],
        comments: [
          {
            member: "memberA",
            text: "Android build ready—needs quick pass on iOS devices.",
          },
        ],
        createdBy: "memberA",
      },
    ],
  },
  {
    name: "QA",
    cards: [
      {
        title: "Cross-browser card composer tests",
        description:
          "Verify edge cases on Safari and Firefox for inline composer.",
        dueInDays: 2,
        labels: ["Bug", "Frontend"],
        assignees: ["memberB"],
        comments: [
          {
            member: "memberB",
            text: "Safari occasionally double submits—investigating.",
          },
        ],
        createdBy: "memberB",
      },
      {
        title: "Mobile push notification smoke test",
        description: "Ensure card comment pings arrive within 15 seconds.",
        labels: ["Bug", "Auth"],
        assignees: ["memberA"],
        comments: [
          {
            member: "memberA",
            text: "Need device token rotation scenario before signoff.",
          },
        ],
        createdBy: "memberA",
      },
      {
        title: "List reorder long-run test",
        description: "Run 500 reorder operations to watch for drift.",
        dueInDays: 1,
        labels: ["DevOps", "Backend"],
        assignees: ["primary"],
        comments: [
          {
            member: "primary",
            text: "Positions stable; capturing metrics for regression suite.",
          },
        ],
        createdBy: "primary",
      },
      {
        title: "Automation rules regression",
        description: "Check scheduled card moves and due date reminders.",
        dueInDays: 3,
        labels: ["Backend"],
        assignees: ["memberA", "memberB"],
        comments: [
          {
            member: "memberB",
            text: "Cron expression parsing failed once—retesting now.",
          },
        ],
        createdBy: "memberA",
      },
      {
        title: "Checklist accessibility sweep",
        labels: ["Design", "Frontend"],
        assignees: ["memberB"],
        comments: [
          {
            member: "primary",
            text: "Use aria-live polite when item state toggles.",
          },
        ],
        createdBy: "memberB",
      },
    ],
  },
  {
    name: "Launch Prep",
    cards: [
      {
        title: "Compile release announcement draft",
        description: "Summarize marquee features for marketing email and blog.",
        dueInDays: 5,
        labels: ["Docs"],
        assignees: ["memberB"],
        comments: [
          {
            member: "memberB",
            text: "Adding screenshots once responsive polish lands.",
          },
        ],
        createdBy: "memberB",
      },
      {
        title: "Finalize onboarding checklist for launch day",
        description:
          "Ensure CS team knows how to recreate user issues in staging.",
        labels: ["Docs"],
        assignees: ["memberA"],
        comments: [
          {
            member: "memberA",
            text: "Need confirmation on analytics dashboards before sending.",
          },
        ],
        createdBy: "memberA",
      },
      {
        title: "Prep incident bridge template",
        comments: [
          {
            member: "primary",
            text: "Reused cloud runbook structure—just needs contact updates.",
          },
        ],
        createdBy: "primary",
      },
      {
        title: "Record product walkthrough video",
        description:
          "Highlight live collaboration, filters, and mobile parity.",
        dueInDays: 6,
        labels: ["Design"],
        assignees: ["memberB"],
        comments: [
          {
            member: "memberB",
            text: "Studio booked Tuesday morning—will prep script Monday.",
          },
        ],
        createdBy: "memberB",
      },
      {
        title: "Transform launch checklist into Notion hub",
        description: "Consolidate QA, comms, and escalation docs in one place.",
        labels: ["Docs"],
        assignees: ["primary", "memberA"],
        comments: [
          {
            member: "primary",
            text: "Structure done—waiting on analytics section from Ron.",
          },
        ],
        createdBy: "primary",
      },
    ],
  },
];

export type SeedTrelloExampleOptions = {
  defaultMemberIds?: string[];
  workspaceName?: string;
  boardName?: string;
};

export const seedTrelloExampleWorkspace = async (
  client: SeedClient,
  primaryUserId: string,
  options: SeedTrelloExampleOptions = {}
) => {
  const {
    defaultMemberIds = [],
    workspaceName = "Trello Example Workspace",
    boardName = "Trello Example Board",
  } = options;

  const memberIdsByKey: Record<SeedMemberKey, string> = {
    primary: primaryUserId,
    memberA: defaultMemberIds[0] ?? primaryUserId,
    memberB: defaultMemberIds[1] ?? defaultMemberIds[0] ?? primaryUserId,
  };

  const resolveMemberId = (key: SeedMemberKey) => memberIdsByKey[key];
  const distinctMemberIds = Array.from(
    new Set(Object.values(memberIdsByKey))
  );

  const workspace = await client.workspace.create({
    data: {
      name: workspaceName,
      description: "Cross-functional hub for the Miluim product crew.",
      type: WorkspaceType.EngineeringIt,
      createdBy: resolveMemberId("primary"),
      workspaceMembers: {
        create: distinctMemberIds.map((userId) => ({
          role: WorkspaceRole.Admin,
          user: { connect: { id: userId } },
        })),
      },
    },
  });

  const board = await client.board.create({
    data: {
      name: boardName,
      description: "Delivering a polished Trello-style board experience.",
      workspaceId: workspace.id,
      createdBy: resolveMemberId("primary"),
      background: BoardBackground.Mountain,
      visibility: BoardVisibility.WorkspaceMembers,
      memberManage: MemberManageRestrictions.Members,
      commenting: CommentingRestrictions.BoardMembers,
      boardMembers: {
        create: distinctMemberIds.map((userId) => ({
          role: BoardRole.Admin,
          user: { connect: { id: userId } },
        })),
      },
    },
  });

  const labels = await Promise.all(
    labelDefinitions.map((label) =>
      client.label.create({
        data: {
          boardId: board.id,
          name: label.name,
          color: label.color,
        },
      })
    )
  );

  const labelByName = new Map(labels.map((label) => [label.name ?? "", label]));
  const nextListPosition = positionFactory();

  for (const list of listDefinitions) {
    const nextCardPosition = positionFactory();

    await client.list.create({
      data: {
        boardId: board.id,
        name: list.name,
        position: nextListPosition(),
        cards:
          list.cards.length > 0
            ? {
                create: list.cards.map((card) => {
                  const assigneeIds = Array.from(
                    new Set(
                      (card.assignees ?? []).map((key) => resolveMemberId(key))
                    )
                  );

                  return {
                    title: card.title,
                    description: card.description,
                    position: nextCardPosition(),
                    createdBy: resolveMemberId(card.createdBy),
                    dueDate:
                      card.dueInDays !== undefined
                        ? dueDateFromNow(card.dueInDays)
                        : undefined,
                    startDate:
                      card.startInDays !== undefined
                        ? dueDateFromNow(card.startInDays)
                        : undefined,
                    coverImageUrl: card.coverImageUrl,
                    assignees:
                      assigneeIds.length > 0
                        ? {
                            create: assigneeIds.map((userId) => ({
                              user: { connect: { id: userId } },
                            })),
                          }
                        : undefined,
                    cardLabels:
                      card.labels && card.labels.length > 0
                        ? {
                            create: card.labels.map((labelName) => {
                              const label = labelByName.get(labelName);
                              if (!label) {
                                throw new Error(
                                  `Label ${labelName} not found`
                                );
                              }

                              return {
                                label: { connect: { id: label.id } },
                              };
                            }),
                          }
                        : undefined,
                    comments:
                      card.comments && card.comments.length > 0
                        ? {
                            create: card.comments.map((comment) => ({
                              text: comment.text,
                              user: {
                                connect: { id: resolveMemberId(comment.member) },
                              },
                            })),
                          }
                        : undefined,
                  };
                }),
              }
            : undefined,
      },
    });
  }

  return {
    workspaceId: workspace.id,
    boardId: board.id,
  };
};
