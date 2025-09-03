# Card API Documentation

This directory contains the complete card management system for the Trello clone application. It includes APIs for cards, checklists, comments, attachments, and labels with full CRUD operations.

## Directory Structure

```
cards/
├── index.ts                 # Main router that combines all card-related routes
├── card.controller.ts       # Card CRUD operations
├── cardService.ts          # Card business logic
├── card.route.ts           # Card API endpoints
├── checklist.controller.ts # Checklist CRUD operations
├── checklistService.ts     # Checklist business logic
├── checklist.route.ts      # Checklist API endpoints
├── comment.controller.ts    # Comment CRUD operations
├── commentService.ts       # Comment business logic
├── comment.route.ts        # Comment API endpoints
├── attachment.controller.ts # Attachment CRUD operations
├── attachmentService.ts    # Attachment business logic
├── attachment.route.ts     # Attachment API endpoints
├── label.controller.ts      # Label CRUD operations
├── labelService.ts         # Label business logic
├── label.route.ts          # Label API endpoints
└── README.md               # This documentation
```

## API Endpoints

### Cards

#### Base URL: `/cards`

| Method | Endpoint         | Description                          | Auth Required |
| ------ | ---------------- | ------------------------------------ | ------------- |
| POST   | `/`              | Create a new card                    | Yes           |
| GET    | `/:id`           | Get a single card by ID              | Yes           |
| GET    | `/list/:listId`  | Get all cards for a list             | Yes           |
| PUT    | `/:id`           | Update a card                        | Yes           |
| DELETE | `/:id`           | Delete a card                        | Yes           |
| PATCH  | `/:id/move`      | Move card to different list/position | Yes           |
| PATCH  | `/:id/archive`   | Archive/Unarchive a card             | Yes           |
| PATCH  | `/:id/subscribe` | Subscribe/Unsubscribe to card        | Yes           |
| GET    | `/search`        | Search cards using full-text search  | Yes           |
| GET    | `/:id/activity`  | Get card activity log                | Yes           |

#### Card Request/Response Examples

**Create Card**

```json
POST /cards
{
  "listId": "uuid",
  "title": "Card Title",
  "description": "Card description",
  "dueDate": "2024-01-01T00:00:00Z",
  "startDate": "2024-01-01T00:00:00Z",
  "position": 1000,
  "coverImageUrl": "https://example.com/image.jpg"
}
```

**Move Card**

```json
PATCH /cards/:id/move
{
  "listId": "new-list-uuid",
  "position": 2000
}
```

### Checklists

#### Base URL: `/checklists`

| Method | Endpoint | Description            | Auth Required |
| ------ | -------- | ---------------------- | ------------- |
| POST   | `/`      | Create a new checklist | Yes           |
| GET    | `/:id`   | Get checklist by ID    | Yes           |
| PUT    | `/:id`   | Update checklist       | Yes           |
| DELETE | `/:id`   | Delete checklist       | Yes           |

#### Checklist Items

| Method | Endpoint            | Description            | Auth Required |
| ------ | ------------------- | ---------------------- | ------------- |
| POST   | `/items`            | Create checklist item  | Yes           |
| PUT    | `/items/:id`        | Update checklist item  | Yes           |
| DELETE | `/items/:id`        | Delete checklist item  | Yes           |
| PATCH  | `/items/:id/toggle` | Toggle item completion | Yes           |

#### Assignments

| Method | Endpoint                        | Description                   | Auth Required |
| ------ | ------------------------------- | ----------------------------- | ------------- |
| POST   | `/items/assign`                 | Assign user to checklist item | Yes           |
| DELETE | `/items/:itemId/assign/:userId` | Remove user assignment        | Yes           |

#### Checklist Request/Response Examples

**Create Checklist**

```json
POST /checklists
{
  "cardId": "uuid",
  "title": "Checklist Title",
  "position": 1000
}
```

**Create Checklist Item**

```json
POST /checklists/items
{
  "checklistId": "uuid",
  "text": "Item text",
  "dueDate": "2024-01-01T00:00:00Z",
  "position": 1000
}
```

### Comments

#### Base URL: `/comments`

| Method | Endpoint        | Description                 | Auth Required |
| ------ | --------------- | --------------------------- | ------------- |
| POST   | `/`             | Create a new comment        | Yes           |
| GET    | `/:id`          | Get comment by ID           | Yes           |
| GET    | `/card/:cardId` | Get all comments for a card | Yes           |
| PUT    | `/:id`          | Update comment              | Yes           |
| DELETE | `/:id`          | Delete comment              | Yes           |

#### Comment Request/Response Examples

**Create Comment**

```json
POST /comments
{
  "cardId": "uuid",
  "text": "Comment text"
}
```

### Attachments

#### Base URL: `/attachments`

| Method | Endpoint        | Description                    | Auth Required |
| ------ | --------------- | ------------------------------ | ------------- |
| POST   | `/`             | Create a new attachment        | Yes           |
| GET    | `/:id`          | Get attachment by ID           | Yes           |
| GET    | `/card/:cardId` | Get all attachments for a card | Yes           |
| PUT    | `/:id`          | Update attachment              | Yes           |
| DELETE | `/:id`          | Delete attachment              | Yes           |

#### Attachment Request/Response Examples

**Create Attachment**

```json
POST /attachments
{
  "cardId": "uuid",
  "url": "https://example.com/file.pdf",
  "filename": "document.pdf",
  "bytes": 1024000,
  "meta": {
    "type": "pdf",
    "size": "1MB"
  }
}
```

### Labels

#### Base URL: `/labels`

| Method | Endpoint          | Description                | Auth Required |
| ------ | ----------------- | -------------------------- | ------------- |
| POST   | `/`               | Create a new label         | Yes           |
| GET    | `/:id`            | Get label by ID            | Yes           |
| GET    | `/board/:boardId` | Get all labels for a board | Yes           |
| PUT    | `/:id`            | Update label               | Yes           |
| DELETE | `/:id`            | Delete label               | Yes           |

#### Label-Card Relationships

| Method | Endpoint                 | Description            | Auth Required |
| ------ | ------------------------ | ---------------------- | ------------- |
| POST   | `/card`                  | Add label to card      | Yes           |
| DELETE | `/card/:cardId/:labelId` | Remove label from card | Yes           |

#### Label Request/Response Examples

**Create Label**

```json
POST /labels
{
  "boardId": "uuid",
  "name": "High Priority",
  "color": "#ff0000"
}
```

**Add Label to Card**

```json
POST /labels/card
{
  "cardId": "uuid",
  "labelId": "uuid"
}
```

## Features

### 1. **Full CRUD Operations**

- Create, read, update, and delete for all entities
- Comprehensive validation using Zod schemas
- Proper error handling and status codes

### 2. **Access Control**

- User authentication required for all endpoints
- Board membership verification
- Role-based permissions (admin, member, observer)

### 3. **Activity Logging**

- All card operations are logged with detailed payloads
- Tracks user actions for audit trails
- Supports different action types (created, updated, moved, etc.)

### 4. **Position Management**

- Decimal-based positioning system for precise ordering
- Automatic position calculation for new items
- Support for drag-and-drop operations

### 5. **Full-Text Search**

- PostgreSQL tsvector integration for card content search
- Search across title and description fields
- Relevance-based result ordering

### 6. **Rich Relationships**

- Cards can have multiple labels, assignees, and watchers
- Checklists with items and assignments
- Comments with user attribution
- File attachments with metadata

### 7. **Data Validation**

- Input validation using Zod schemas
- UUID validation for all IDs
- Proper data type checking and conversion

## Error Handling

The API uses a consistent error response format:

```json
{
  "status": "error",
  "message": "Error description",
  "code": 400
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `204` - No Content (for deletions)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (access denied)
- `404` - Not Found
- `500` - Internal Server Error

## Authentication

All endpoints require user authentication. The user ID is extracted from the request object (`req.user.id`) which should be set by the authentication middleware.

## Database Schema

The card system uses the following Prisma models:

- `cards` - Main card entity
- `checklists` - Card checklists
- `checklist_items` - Individual checklist items
- `comments` - Card comments
- `attachments` - File attachments
- `labels` - Board labels
- `card_labels` - Many-to-many relationship between cards and labels
- `card_assignees` - Many-to-many relationship between cards and users
- `card_watchers` - Many-to-many relationship between cards and users (for notifications)
- `activity_log` - Audit trail for all card operations

## Usage Examples

### Frontend Integration

```typescript
// Create a new card
const createCard = async (cardData: CreateCardData) => {
  const response = await fetch("/api/cards", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cardData),
  });

  return response.json();
};

// Get cards for a list
const getCardsByList = async (listId: string) => {
  const response = await fetch(`/api/cards/list/${listId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};
```

### Real-time Updates

The API is designed to work with real-time updates. After any modification operation, the frontend should:

1. Update the local state with the response data
2. Trigger any necessary UI updates
3. Update activity feeds and notifications
4. Refresh related components if needed

## Performance Considerations

- Database queries are optimized with proper indexing
- Related data is fetched in single queries using Prisma includes
- Pagination support for large datasets
- Efficient full-text search using PostgreSQL GIN indexes

## Security Features

- Input sanitization and validation
- SQL injection prevention through Prisma ORM
- XSS protection through proper output encoding
- CSRF protection through authentication tokens
- Rate limiting support (can be added at the middleware level)
