# Trello Clone Backend

A Node.js/Express backend for a Trello clone application with PostgreSQL database.

## 🏗️ Project Structure

```
src/
├── api/                    # API routes
│   ├── boards/            # Board-related endpoints
│   │   ├── board.controller.ts
│   │   └── board.route.ts
│   ├── users/             # User-related endpoints
│   │   ├── user.controller.ts
│   │   └── user.route.ts
│   ├── workspaces/        # Workspace-related endpoints
│   │   ├── workspace.controller.ts
│   │   └── workspace.route.ts
│   └── index.ts           # Main router
├── config/                 # Configuration files
│   ├── database.ts        # Database connection and helpers
│   └── schema.sql         # PostgreSQL schema
├── middlewares/            # Custom middleware
│   ├── errorHandler.ts     # Global error handling
│   └── validation.ts      # Request validation
├── services/               # Business logic layer
│   ├── userService.ts      # User operations
│   ├── workspaceService.ts # Workspace operations
│   └── boardService.ts     # Board operations
├── utils/                  # Utility functions
│   ├── appError.ts         # Custom error class
│   └── globalTypes.ts      # TypeScript interfaces
└── server.ts               # Main server file
```

## 🚀 Features

- **RESTful API** with Express.js
- **PostgreSQL** database with connection pooling
- **TypeScript** for type safety
- **Error handling** middleware with custom error classes
- **Request validation** middleware
- **Service layer** architecture for business logic
- **CORS** support
- **Health check** endpoint
- **Graceful shutdown** handling

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## 🛠️ Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Install PostgreSQL dependencies:**

   ```bash
   npm install pg @types/pg
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:

   ```env
   PORT=3000
   DATABASE_URL=postgresql://username:password@localhost:5432/trello_clone
   SESSION_SECRET=your-secret-key
   NODE_ENV=development
   ```

4. **Set up the database:**

   ```bash
   # Connect to your PostgreSQL database
   psql -U username -d trello_clone

   # Run the schema file
   \i src/config/schema.sql
   ```

## 🏃‍♂️ Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

## 📚 API Endpoints

### Health Check

- `GET /health` - Server health status

### Users

- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Workspaces

- `POST /api/workspaces` - Create workspace
- `GET /api/workspaces/:id` - Get workspace by ID
- `PUT /api/workspaces/:id` - Update workspace
- `DELETE /api/workspaces/:id` - Delete workspace
- `GET /api/workspaces/:id/boards` - Get workspace boards

### Boards

- `POST /api/boards` - Create board
- `GET /api/boards/:id` - Get board by ID
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

## 🗄️ Database Schema

### Users Table

- `id` (UUID, Primary Key)
- `email` (VARCHAR, Unique)
- `name` (VARCHAR)
- `avatar` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Workspaces Table

- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `description` (TEXT)
- `owner_id` (UUID, Foreign Key to users.id)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Boards Table

- `id` (UUID, Primary Key)
- `title` (VARCHAR)
- `description` (TEXT)
- `workspace_id` (UUID, Foreign Key to workspaces.id)
- `owner_id` (UUID, Foreign Key to users.id)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 🔧 Error Handling

The application uses a centralized error handling system:

- **AppError Class**: Custom error class with status codes and operational flags
- **Global Error Handler**: Catches all errors and formats responses consistently
- **Validation Middleware**: Validates request parameters and body data

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 Environment Variables

| Variable         | Description                  | Default           |
| ---------------- | ---------------------------- | ----------------- |
| `PORT`           | Server port                  | 3000              |
| `DATABASE_URL`   | PostgreSQL connection string | Required          |
| `SESSION_SECRET` | Session secret key           | "your-secret-key" |
| `NODE_ENV`       | Environment mode             | "development"     |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please open an issue in the repository.
