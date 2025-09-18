import type {
  BoardFullDto,
  ListDto,
  CardDto,
  UserDto,
  WorkspaceDto,
  LabelDto,
  BoardMemberDto,
} from "@ronmordo/contracts";

// Dummy User data
const dummyUser: UserDto = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  clerkId: "user_2abc123def456",
  email: "john.doe@example.com",
  username: "johndoe",
  fullName: "John Doe",
  avatarUrl: "/src/assets/background-3-hd.webp",
  theme: "dark",
  emailNotification: true,
  pushNotification: true,
  createdAt: "2024-01-15T10:30:00.000Z",
  bio: "Product Manager at TechCorp",
};

// Dummy Workspace data
const dummyWorkspace: WorkspaceDto = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  name: "TechCorp Workspace",
  description: "Main workspace for TechCorp development team",
  visibility: "private",
  premium: true,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-15T10:30:00.000Z",
  type: "engineering_it",
  createdBy: "550e8400-e29b-41d4-a716-446655440000",
  workspaceMembershipRestrictions: "anybody",
  publicBoardCreation: "workspace_member",
  workspaceBoardCreation: "workspace_member",
  privateBoardCreation: "workspace_member",
  publicBoardDeletion: "workspace_admin",
  workspaceBoardDeletion: "workspace_admin",
  privateBoardDeletion: "workspace_admin",
  allowGuestSharing: "anybody",
  allowSlackIntegration: "workspace_member",
};

// Dummy Labels data
const dummyLabels: LabelDto[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440010",
    boardId: "550e8400-e29b-41d4-a716-446655440002",
    name: "High Priority",
    color: "red",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440011",
    boardId: "550e8400-e29b-41d4-a716-446655440002",
    name: "Bug",
    color: "bold_red",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440012",
    boardId: "550e8400-e29b-41d4-a716-446655440002",
    name: "Feature",
    color: "blue",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440013",
    boardId: "550e8400-e29b-41d4-a716-446655440002",
    name: "In Progress",
    color: "yellow",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440014",
    boardId: "550e8400-e29b-41d4-a716-446655440002",
    name: "Done",
    color: "green",
  },
];

// Dummy Board Member data
const dummyBoardMember: BoardMemberDto = {
  boardId: "550e8400-e29b-41d4-a716-446655440002",
  userId: "550e8400-e29b-41d4-a716-446655440000",
  role: "admin",
  joinedAt: "2024-01-15T10:30:00.000Z",
};

// Dummy Cards data
const dummyCards: CardDto[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440020",
    listId: "550e8400-e29b-41d4-a716-446655440003",
    title: "Design new dashboard layout",
    description:
      "Create a modern and intuitive dashboard design for the main application",
    dueDate: "2024-02-15T17:00:00.000Z",
    startDate: "2024-01-20T09:00:00.000Z",
    position: 0,
    isWatch: true,
    cardAssignees: [
      {
        id: "550e8400-e29b-41d4-a716-446655440000",
        avatarUrl: "/src/assets/background-4-hd.webp",
        fullName: "John Doe",
        username: "johndoe",
      },
    ],
    attachmentsCount: 3,
    commentsCount: 5,
    checklistItemsCount: 8,
    completedChecklistItemsCount: 3,
    labels: [
      {
        name: "High Priority",
        color: "red",
      },
      {
        name: "Feature",
        color: "blue",
      },
    ],
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: "San Francisco, CA",
    },
    isArchived: false,
    createdBy: "550e8400-e29b-41d4-a716-446655440000",
    coverImageUrl: "/src/assets/background-2-hd.webp",
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-20T14:22:00.000Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440021",
    listId: "550e8400-e29b-41d4-a716-446655440003",
    title: "Fix authentication bug",
    description: "Users are unable to log in with Google OAuth",
    dueDate: "2024-01-25T17:00:00.000Z",
    startDate: "2024-01-18T09:00:00.000Z",
    position: 1,
    isWatch: false,
    cardAssignees: [],
    attachmentsCount: 1,
    commentsCount: 2,
    checklistItemsCount: 4,
    completedChecklistItemsCount: 1,
    labels: [
      {
        name: "Bug",
        color: "bold_red",
      },
    ],
    location: null,
    isArchived: false,
    createdBy: "550e8400-e29b-41d4-a716-446655440000",
    coverImageUrl: null,
    createdAt: "2024-01-18T09:15:00.000Z",
    updatedAt: "2024-01-19T16:45:00.000Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440022",
    listId: "550e8400-e29b-41d4-a716-446655440004",
    title: "Implement user profile page",
    description:
      "Create a comprehensive user profile page with settings and preferences",
    dueDate: null,
    startDate: "2024-01-22T09:00:00.000Z",
    position: 0,
    isWatch: true,
    cardAssignees: [
      {
        id: "550e8400-e29b-41d4-a716-446655440000",
        avatarUrl: "/src/assets/background-4-hd.webp",
        fullName: "John Doe",
        username: "johndoe",
      },
    ],
    attachmentsCount: 0,
    commentsCount: 0,
    checklistItemsCount: 6,
    completedChecklistItemsCount: 0,
    labels: [
      {
        name: "Feature",
        color: "blue",
      },
      {
        name: "In Progress",
        color: "yellow",
      },
    ],
    location: null,
    isArchived: false,
    createdBy: "550e8400-e29b-41d4-a716-446655440000",
    coverImageUrl: null,
    createdAt: "2024-01-22T09:00:00.000Z",
    updatedAt: "2024-01-22T09:00:00.000Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440023",
    listId: "550e8400-e29b-41d4-a716-446655440004",
    title: "Write API documentation",
    description:
      "Document all REST API endpoints with examples and response schemas",
    dueDate: "2024-02-01T17:00:00.000Z",
    startDate: null,
    position: 1,
    isWatch: false,
    cardAssignees: [],
    attachmentsCount: 2,
    commentsCount: 1,
    checklistItemsCount: 3,
    completedChecklistItemsCount: 0,
    labels: [
      {
        name: "Feature",
        color: "blue",
      },
    ],
    location: null,
    isArchived: false,
    createdBy: "550e8400-e29b-41d4-a716-446655440000",
    coverImageUrl: null,
    createdAt: "2024-01-20T11:30:00.000Z",
    updatedAt: "2024-01-20T11:30:00.000Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440024",
    listId: "550e8400-e29b-41d4-a716-446655440005",
    title: "Deploy to production",
    description: "Deploy the latest version to production environment",
    dueDate: "2024-01-30T17:00:00.000Z",
    startDate: "2024-01-28T09:00:00.000Z",
    position: 0,
    isWatch: true,
    cardAssignees: [
      {
        id: "550e8400-e29b-41d4-a716-446655440000",
        avatarUrl: "/src/assets/background-4-hd.webp",
        fullName: "John Doe",
        username: "johndoe",
      },
    ],
    attachmentsCount: 0,
    commentsCount: 3,
    checklistItemsCount: 5,
    completedChecklistItemsCount: 5,
    labels: [
      {
        name: "Done",
        color: "green",
      },
    ],
    location: null,
    isArchived: false,
    createdBy: "550e8400-e29b-41d4-a716-446655440000",
    coverImageUrl: null,
    createdAt: "2024-01-28T09:00:00.000Z",
    updatedAt: "2024-01-30T16:30:00.000Z",
  },
];

// Dummy Lists data
const dummyLists: ListDto[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    boardId: "550e8400-e29b-41d4-a716-446655440002",
    name: "To Do",
    position: 0,
    isArchived: false,
    subscribed: true,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    boardId: "550e8400-e29b-41d4-a716-446655440002",
    name: "In Progress",
    position: 1,
    isArchived: false,
    subscribed: true,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    boardId: "550e8400-e29b-41d4-a716-446655440002",
    name: "Done",
    position: 2,
    isArchived: false,
    subscribed: false,
  },
];

// Dummy Board data
export const dummyBoardData: BoardFullDto = {
  id: "550e8400-e29b-41d4-a716-446655440002",
  workspaceId: "550e8400-e29b-41d4-a716-446655440001",
  name: "Sprint Planning Board",
  description: "Main board for tracking sprint tasks and user stories",
  background: "/src/assets/background-1-hd.webp",
  createdBy: "550e8400-e29b-41d4-a716-446655440000",
  allowCovers: true,
  showComplete: true,
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-30T16:30:00.000Z",
  lastActivityAt: "2024-01-30T16:30:00.000Z",
  visibility: "workspace_members",
  memberManage: "members",
  commenting: "workspace_members",
  labels: dummyLabels,
  members: [
    {
      ...dummyBoardMember,
      user: dummyUser,
    },
  ],
  lists: [
    {
      ...dummyLists[0],
      watchers: [],
      cards: dummyCards.filter((card) => card.listId === dummyLists[0].id),
    },
    {
      ...dummyLists[1],
      watchers: [],
      cards: dummyCards.filter((card) => card.listId === dummyLists[1].id),
    },
    {
      ...dummyLists[2],
      watchers: [],
      cards: dummyCards.filter((card) => card.listId === dummyLists[2].id),
    },
  ],
  creator: dummyUser,
  workspace: dummyWorkspace,
};

// Helper function to create a new list with dummy data
export const createDummyList = (
  name: string,
  position: number,
  boardId: string
): ListDto & { cards: CardDto[] } => ({
  id: `dummy-list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  boardId,
  name,
  position,
  isArchived: false,
  subscribed: true,
  cards: [], // Add empty cards array for new lists
});

// Helper function to create a new card with dummy data
export const createDummyCard = (
  title: string,
  listId: string,
  position: number
): CardDto => ({
  id: `dummy-card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  listId,
  title,
  description: null,
  dueDate: null,
  startDate: null,
  position,
  isWatch: false,
  cardAssignees: [],
  attachmentsCount: 0,
  commentsCount: 0,
  checklistItemsCount: 0,
  completedChecklistItemsCount: 0,
  labels: [],
  location: null,
  isArchived: false,
  createdBy: "550e8400-e29b-41d4-a716-446655440000",
  coverImageUrl: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
