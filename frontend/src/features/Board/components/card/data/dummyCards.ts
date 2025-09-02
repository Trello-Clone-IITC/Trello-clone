import type { Card } from "../../list/redux/listSlice";

// Dummy card data that matches real Trello usage patterns
export const dummyCards: Card[] = [
  // Landing Page List Cards
  {
    id: "card-auth",
    title: "Full Authentication ( Login + Register)",
    description:
      "Implement user authentication system with JWT tokens, password hashing, and session management",
    listId: "list-landing",
    position: 0,
    labels: [
      { id: "label-easy", title: "Easy", color: "green" },
      { id: "label-must-have", title: "Must Have", color: "pink" },
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "card-navbar",
    title: "Navbar Component",
    description:
      "Create responsive navigation component with user menu and search functionality",
    listId: "list-landing",
    position: 1,
    labels: [
      { id: "label-easy", title: "Easy", color: "green" },
      { id: "label-must-have", title: "Must Have", color: "pink" },
    ],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "card-homepage",
    title: "Homepage Design",
    description:
      "Design and implement landing page with hero section, features, and call-to-action",
    listId: "list-landing",
    position: 2,
    labels: [
      { id: "label-easy", title: "Easy", color: "green" },
      { id: "label-must-have", title: "Must Have", color: "pink" },
    ],
    createdAt: "2024-01-15T11:00:00Z",
    updatedAt: "2024-01-15T11:00:00Z",
  },
  {
    id: "card-other-pages",
    title: "Rest of Pages",
    description: "Implement about, contact, pricing, and other static pages",
    listId: "list-landing",
    position: 3,
    labels: [
      { id: "label-easy", title: "Easy", color: "green" },
      { id: "label-nice-to-have", title: "Nice to have", color: "blue" },
    ],
    createdAt: "2024-01-15T11:30:00Z",
    updatedAt: "2024-01-15T11:30:00Z",
  },
  {
    id: "card-seo",
    title: "SEO Optimization",
    description:
      "Implement meta tags, structured data, and performance optimization",
    listId: "list-landing",
    position: 4,
    labels: [
      { id: "label-medium", title: "Medium", color: "yellow" },
      { id: "label-nice-to-have", title: "Nice to have", color: "blue" },
    ],
    createdAt: "2024-01-15T12:00:00Z",
    updatedAt: "2024-01-15T12:00:00Z",
  },

  // In Progress List Cards
  {
    id: "card-database",
    title: "Database Setup",
    description:
      "Configure PostgreSQL database with Prisma ORM and set up migrations",
    listId: "list-progress",
    position: 0,
    labels: [
      { id: "label-medium", title: "Medium", color: "yellow" },
      { id: "label-must-have", title: "Must Have", color: "pink" },
    ],
    createdAt: "2024-01-16T09:00:00Z",
    updatedAt: "2024-01-16T09:00:00Z",
  },
  {
    id: "card-api",
    title: "API Development",
    description:
      "Build RESTful API endpoints for user management and core features",
    listId: "list-progress",
    position: 1,
    labels: [
      { id: "label-hard", title: "Hard", color: "red" },
      { id: "label-must-have", title: "Must Have", color: "pink" },
    ],
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z",
  },
  {
    id: "card-testing",
    title: "Testing Setup",
    description:
      "Set up Jest and React Testing Library for unit and integration tests",
    listId: "list-progress",
    position: 2,
    labels: [{ id: "label-medium", title: "Medium", color: "yellow" }],
    createdAt: "2024-01-16T11:00:00Z",
    updatedAt: "2024-01-16T11:00:00Z",
  },

  // Done List Cards
  {
    id: "card-project-setup",
    title: "Project Setup",
    description:
      "Initialize Next.js project with TypeScript, Tailwind CSS, and ESLint configuration",
    listId: "list-done",
    position: 0,
    labels: [{ id: "label-easy", title: "Easy", color: "green" }],
    createdAt: "2024-01-14T09:00:00Z",
    updatedAt: "2024-01-14T09:00:00Z",
  },
  {
    id: "card-design-system",
    title: "Design System",
    description:
      "Create component library with shadcn/ui and establish design tokens",
    listId: "list-done",
    position: 1,
    labels: [
      { id: "label-easy", title: "Easy", color: "green" },
      { id: "label-must-have", title: "Must Have", color: "pink" },
    ],
    createdAt: "2024-01-14T10:00:00Z",
    updatedAt: "2024-01-14T10:00:00Z",
  },
  {
    id: "card-git-setup",
    title: "Git Repository Setup",
    description:
      "Initialize Git repository, set up GitHub Actions, and configure branch protection",
    listId: "list-done",
    position: 2,
    labels: [{ id: "label-easy", title: "Easy", color: "green" }],
    createdAt: "2024-01-14T11:00:00Z",
    updatedAt: "2024-01-14T11:00:00Z",
  },

  // Backlog List Cards
  {
    id: "card-deployment",
    title: "Deployment Setup",
    description:
      "Configure Vercel deployment with environment variables and CI/CD pipeline",
    listId: "list-backlog",
    position: 0,
    labels: [
      { id: "label-medium", title: "Medium", color: "yellow" },
      { id: "label-nice-to-have", title: "Nice to have", color: "blue" },
    ],
    createdAt: "2024-01-17T09:00:00Z",
    updatedAt: "2024-01-17T09:00:00Z",
  },
  {
    id: "card-monitoring",
    title: "Monitoring & Analytics",
    description:
      "Set up error tracking with Sentry and analytics with Google Analytics",
    listId: "list-backlog",
    position: 1,
    labels: [
      { id: "label-nice-to-have", title: "Nice to have", color: "blue" },
    ],
    createdAt: "2024-01-17T10:00:00Z",
    updatedAt: "2024-01-17T10:00:00Z",
  },
  {
    id: "card-documentation",
    title: "Documentation",
    description: "Write API documentation, README, and user guides",
    listId: "list-backlog",
    position: 2,
    labels: [
      { id: "label-easy", title: "Easy", color: "green" },
      { id: "label-nice-to-have", title: "Nice to have", color: "blue" },
    ],
    createdAt: "2024-01-17T11:00:00Z",
    updatedAt: "2024-01-17T11:00:00Z",
  },
];

// Helper function to get cards by list ID
export const getCardsByListId = (listId: string): Card[] => {
  return dummyCards.filter((card) => card.listId === listId);
};

// Helper function to get all unique list IDs
export const getListIds = (): string[] => {
  return [...new Set(dummyCards.map((card) => card.listId))];
};
