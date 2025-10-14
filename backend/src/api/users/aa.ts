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

const prisma = new PrismaClient();

const USER_IDS = {
    userId1: "952fd012-0294-4bb5-9abb-594bdc2bc850",
    userId2: "b7c53282-8e0f-49c1-916b-3014176846d1",
    userId3: "c5d844ca-8f5a-4e9b-9ed3-fa4b12b55f0a",
} as const;

type CardCommentSpec = {
    userId: string;
    text: string;
};

type CardSpec = {
    title: string;
    description?: string;
    dueInDays?: number;
    startInDays?: number;
    labels?: string[];
    assignees?: string[];
    comments?: CardCommentSpec[];
    coverImageUrl?: string;
    createdBy: string;
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
                assignees: [USER_IDS.userId1, USER_IDS.userId2],
                comments: [
                    {
                        userId: USER_IDS.userId1,
                        text: "Let’s compare Redis streams versus Postgres listen/notify.",
                    },
                ],
                createdBy: USER_IDS.userId1,
            },
            {
                title: "Spec board permissions matrix",
                description:
                    "Capture allowed actions for guests, members, and admins across features.",
                dueInDays: 6,
                labels: ["Docs"],
                assignees: [USER_IDS.userId3],
                comments: [
                    {
                        userId: USER_IDS.userId3,
                        text: "Drafting table format so product can sign off quickly.",
                    },
                ],
                createdBy: USER_IDS.userId3,
            },
            {
                title: "Plan analytics event taxonomy",
                description: "List key board interactions to feed product analytics.",
                dueInDays: 7,
                labels: ["Docs", "Backend"],
                assignees: [USER_IDS.userId2],
                comments: [
                    {
                        userId: USER_IDS.userId2,
                        text: "Added draft to shared doc—need naming review tomorrow.",
                    },
                ],
                createdBy: USER_IDS.userId2,
            },
            {
                title: "Draft support escalation flow",
                labels: ["Docs"],
                assignees: [USER_IDS.userId3],
                comments: [
                    {
                        userId: USER_IDS.userId1,
                        text: "Include a step for cloning the failing board before triage.",
                    },
                ],
                createdBy: USER_IDS.userId3,
            },
            {
                title: "Gather inspiration for board backgrounds",
                description: "Collect references for the curated background library.",
                coverImageUrl:
                    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                assignees: [USER_IDS.userId3],
                comments: [
                    {
                        userId: USER_IDS.userId3,
                        text: "Pinning favorites in the design board—need final pick Monday.",
                    },
                ],
                createdBy: USER_IDS.userId3,
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
                assignees: [USER_IDS.userId1, USER_IDS.userId2],
                coverImageUrl:
                    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                comments: [
                    {
                        userId: USER_IDS.userId1,
                        text: "Drag ghost renders cleanly; wiring persistence next.",
                    },
                    {
                        userId: USER_IDS.userId2,
                        text: "API accepts Decimal positions now—ready for integration.",
                    },
                ],
                createdBy: USER_IDS.userId1,
            },
            {
                title: "Implement card composer inline flow",
                description: "Match Trello-style quick entry with keyboard shortcuts.",
                dueInDays: 3,
                startInDays: -1,
                labels: ["Frontend"],
                assignees: [USER_IDS.userId3],
                comments: [
                    {
                        userId: USER_IDS.userId3,
                        text: "Accessibility pass is halfway—testing screen reader cues.",
                    },
                ],
                createdBy: USER_IDS.userId3,
            },
            {
                title: "Wire notification preferences modal",
                description:
                    "Allow users to toggle board, list, and card-level alerts.",
                labels: ["Frontend", "Design"],
                assignees: [USER_IDS.userId2, USER_IDS.userId3],
                comments: [
                    {
                        userId: USER_IDS.userId2,
                        text: "Backend endpoints return stubs—need payload shape review.",
                    },
                ],
                createdBy: USER_IDS.userId2,
            },
            {
                title: "Polish workspace switcher dropdown",
                description:
                    "Add pinned boards section and keyboard navigation states.",
                dueInDays: 5,
                startInDays: -2,
                labels: ["Frontend", "Design"],
                assignees: [USER_IDS.userId3],
                comments: [
                    {
                        userId: USER_IDS.userId3,
                        text: "Animation timing feels off—tweaking easing curves tonight.",
                    },
                ],
                createdBy: USER_IDS.userId3,
            },
            {
                title: "Integrate board activity timeline",
                description:
                    "Show recent moves, comments, and assignments in a unified feed.",
                dueInDays: 4,
                startInDays: -2,
                labels: ["Backend", "DevOps"],
                assignees: [USER_IDS.userId1],
                comments: [
                    {
                        userId: USER_IDS.userId1,
                        text: "Need to paginate results; considering cursor on activity id.",
                    },
                ],
                createdBy: USER_IDS.userId1,
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
                assignees: [USER_IDS.userId1],
                comments: [
                    {
                        userId: USER_IDS.userId1,
                        text: "Merged to main; telemetry shows 96% completion rate.",
                    },
                ],
                createdBy: USER_IDS.userId1,
            },
            {
                title: "Board background presets",
                description:
                    "Seeded curated Unsplash collection with light/dark options.",
                dueInDays: -2,
                labels: ["Design"],
                assignees: [USER_IDS.userId3],
                comments: [
                    {
                        userId: USER_IDS.userId3,
                        text: "Added color-only options for performance sensitive boards.",
                    },
                ],
                createdBy: USER_IDS.userId3,
            },
            {
                title: "Email invite templates",
                description:
                    "Personalized copy for workspace invites and board sharing.",
                dueInDays: -1,
                labels: ["Docs"],
                assignees: [USER_IDS.userId2],
                comments: [
                    {
                        userId: USER_IDS.userId2,
                        text: "Localized EN + HE versions, queued for proofread.",
                    },
                ],
                createdBy: USER_IDS.userId2,
            },
            {
                title: "Board starring service",
                description: "Users can star boards and sync across devices.",
                dueInDays: -4,
                labels: ["Backend", "Infrastructure"],
                assignees: [USER_IDS.userId1, USER_IDS.userId2],
                comments: [
                    {
                        userId: USER_IDS.userId2,
                        text: "Redis cache warmup in place—no more dashboard flicker.",
                    },
                ],
                createdBy: USER_IDS.userId2,
            },
            {
                title: "Card checklist MVP",
                description:
                    "Create, toggle, and reorder checklist items inside a card.",
                dueInDays: -5,
                labels: ["Frontend"],
                assignees: [USER_IDS.userId3],
                comments: [
                    {
                        userId: USER_IDS.userId3,
                        text: "QA passed on mobile and web—ready for rollout.",
                    },
                ],
                createdBy: USER_IDS.userId3,
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
                assignees: [USER_IDS.userId3],
                comments: [
                    {
                        userId: USER_IDS.userId1,
                        text: "Can we add a note about retained automations?",
                    },
                ],
                createdBy: USER_IDS.userId3,
            },
            {
                title: "Card cover color palette",
                description: "Review final palette before locking seed data.",
                dueInDays: 2,
                labels: ["Design"],
                assignees: [USER_IDS.userId3],
                comments: [
                    {
                        userId: USER_IDS.userId2,
                        text: "Check contrast with badges; we had a bug last sprint.",
                    },
                ],
                createdBy: USER_IDS.userId3,
            },
            {
                title: "Bulk move cards endpoint",
                description: "Confirm rate limits and audit logging before merge.",
                dueInDays: 1,
                labels: ["Backend", "DevOps"],
                assignees: [USER_IDS.userId1, USER_IDS.userId2],
                comments: [
                    {
                        userId: USER_IDS.userId1,
                        text: "Logs verified; waiting on final approval.",
                    },
                ],
                createdBy: USER_IDS.userId1,
            },
            {
                title: "Workspace insights dashboard QA notes",
                description: "Triaging remaining visual issues before design signoff.",
                labels: ["Design", "Frontend"],
                assignees: [USER_IDS.userId3],
                comments: [
                    {
                        userId: USER_IDS.userId3,
                        text: "Grid gutters aligned; waiting on chart color tweaks.",
                    },
                ],
                createdBy: USER_IDS.userId3,
            },
            {
                title: "Mobile gesture parity checklist",
                description:
                    "Ensure swipe to archive and long-press reorder mimic desktop.",
                dueInDays: 3,
                labels: ["Frontend"],
                assignees: [USER_IDS.userId2, USER_IDS.userId3],
                comments: [
                    {
                        userId: USER_IDS.userId2,
                        text: "Android build ready—needs quick pass on iOS devices.",
                    },
                ],
                createdBy: USER_IDS.userId2,
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
                assignees: [USER_IDS.userId3],
                comments: [
                    {
                        userId: USER_IDS.userId3,
                        text: "Safari occasionally double submits—investigating.",
                    },
                ],
                createdBy: USER_IDS.userId3,
            },
            {
                title: "Mobile push notification smoke test",
                description: "Ensure card comment pings arrive within 15 seconds.",
                labels: ["Bug", "Auth"],
                assignees: [USER_IDS.userId2],
                comments: [
                    {
                        userId: USER_IDS.userId2,
                        text: "Need device token rotation scenario before signoff.",
                    },
                ],
                createdBy: USER_IDS.userId2,
            },
            {
                title: "List reorder long-run test",
                description: "Run 500 reorder operations to watch for drift.",
                dueInDays: 1,
                labels: ["DevOps", "Backend"],
                assignees: [USER_IDS.userId1],
                comments: [
                    {
                        userId: USER_IDS.userId1,
                        text: "Positions stable; capturing metrics for regression suite.",
                    },
                ],
                createdBy: USER_IDS.userId1,
            },
            {
                title: "Automation rules regression",
                description: "Check scheduled card moves and due date reminders.",
                dueInDays: 3,
                labels: ["Backend"],
                assignees: [USER_IDS.userId2, USER_IDS.userId3],
                comments: [
                    {
                        userId: USER_IDS.userId3,
                        text: "Cron expression parsing failed once—retesting now.",
                    },
                ],
                createdBy: USER_IDS.userId2,
            },
            {
                title: "Checklist accessibility sweep",
                labels: ["Design", "Frontend"],
                assignees: [USER_IDS.userId3],
                comments: [
                    {
                        userId: USER_IDS.userId1,
                        text: "Use aria-live polite when item state toggles.",
                    },
                ],
                createdBy: USER_IDS.userId3,
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
                assignees: [USER_IDS.userId3],
                comments: [
                    {
                        userId: USER_IDS.userId3,
                        text: "Adding screenshots once responsive polish lands.",
                    },
                ],
                createdBy: USER_IDS.userId3,
            },
            {
                title: "Finalize onboarding checklist for launch day",
                description:
                    "Ensure CS team knows how to recreate user issues in staging.",
                labels: ["Docs"],
                assignees: [USER_IDS.userId2],
                comments: [
                    {
                        userId: USER_IDS.userId2,
                        text: "Need confirmation on analytics dashboards before sending.",
                    },
                ],
                createdBy: USER_IDS.userId2,
            },
            {
                title: "Prep incident bridge template",
                comments: [
                    {
                        userId: USER_IDS.userId1,
                        text: "Reused cloud runbook structure—just needs contact updates.",
                    },
                ],
                createdBy: USER_IDS.userId1,
            },
            {
                title: "Record product walkthrough video",
                description:
                    "Highlight live collaboration, filters, and mobile parity.",
                dueInDays: 6,
                labels: ["Design"],
                assignees: [USER_IDS.userId3],
                comments: [
                    {
                        userId: USER_IDS.userId3,
                        text: "Studio booked Tuesday morning—will prep script Monday.",
                    },
                ],
                createdBy: USER_IDS.userId3,
            },
            {
                title: "Transform launch checklist into Notion hub",
                description: "Consolidate QA, comms, and escalation docs in one place.",
                labels: ["Docs"],
                assignees: [USER_IDS.userId1, USER_IDS.userId2],
                comments: [
                    {
                        userId: USER_IDS.userId1,
                        text: "Structure done—waiting on analytics section from Ron.",
                    },
                ],
                createdBy: USER_IDS.userId1,
            },
        ],
    },
];

async function main() {
    const workspaceName = "my Trello App Workspace";

    await prisma.workspace.deleteMany({ where: { name: workspaceName } });

    const workspace = await prisma.workspace.create({
        data: {
            name: workspaceName,
            description: "Cross-functional hub for the Miluim product crew.",
            type: WorkspaceType.EngineeringIt,
            createdBy: USER_IDS.userId1,
            workspaceMembers: {
                create: Object.values(USER_IDS).map((id) => ({
                    role: WorkspaceRole.Admin,
                    user: { connect: { id } },
                })),
            },
        },
    });

    const board = await prisma.board.create({
        data: {
            name: "trello clone- project",
            description: "Delivering a polished Trello-style board experience.",
            workspaceId: workspace.id,
            createdBy: USER_IDS.userId1,
            background: BoardBackground.Mountain,
            visibility: BoardVisibility.WorkspaceMembers,
            memberManage: MemberManageRestrictions.Members,
            commenting: CommentingRestrictions.BoardMembers,
            boardMembers: {
                create: Object.values(USER_IDS).map((id) => ({
                    role: BoardRole.Admin,
                    user: { connect: { id } },
                })),
            },
        },
    });

    const labels = await Promise.all(
        labelDefinitions.map((label) =>
            prisma.label.create({
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

        await prisma.list.create({
            data: {
                boardId: board.id,
                name: list.name,
                position: nextListPosition(),
                cards:
                    list.cards.length > 0
                        ? {
                            create: list.cards.map((card) => ({
                                title: card.title,
                                description: card.description,
                                position: nextCardPosition(),
                                createdBy: card.createdBy,
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
                                    card.assignees && card.assignees.length > 0
                                        ? {
                                            create: card.assignees.map((userId) => ({
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
                                                    throw new Error(`Label ${labelName} not found`);
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
                                                user: { connect: { id: comment.userId } },
                                            })),
                                        }
                                        : undefined,
                            })),
                        }
                        : undefined,
            },
        });
    }

    console.log(
        'Seeded workspace "Miluim Tech" with board "trello clone- project".'
    );
}

main()
    .catch((error) => {
        console.error("Seeding failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
