# Database Setup Guide

This guide will help you set up the PostgreSQL database for the Trello Clone application.

## Prerequisites

1. **PostgreSQL** installed and running on your system
2. **Node.js** and **npm** installed
3. **Environment variables** configured

## Quick Setup

### 1. Create Database

```sql
CREATE DATABASE trello_clone;
```

### 2. Configure Environment

Copy `env.example` to `.env` and update the database connection:

```bash
cp env.example .env
```

Edit `.env` and update:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/trello_clone
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Initialize Database

Run the database initialization script:

```bash
npm run db:init
```

This will:

- Create all necessary tables
- Set up custom types and enums
- Create indexes for performance
- Insert sample data
- Verify the setup

## Database Schema Overview

The application uses the following main tables:

- **`users`** - User accounts with Clerk integration
- **`workspaces`** - Workspace management with permissions
- **`workspace_members`** - User-workspace relationships
- **`boards`** - Board management with visibility controls
- **`board_members`** - User-board relationships with roles
- **`lists`** - List organization within boards
- **`list_watchers`** - User subscriptions to lists

## Custom Types

The schema includes several custom ENUM types for:

- User roles (admin, member, observer)
- Board visibility (private, workspace_members, public)
- Workspace types (team, enterprise, marketing, etc.)
- Permission restrictions and access controls

## Troubleshooting

### Common Issues

1. **Connection refused**: Ensure PostgreSQL is running
2. **Permission denied**: Check database user permissions
3. **Type already exists**: Run `npm run db:reset` to reset

### Reset Database

To completely reset the database:

```bash
npm run db:reset
```

### Manual Schema Execution

If you prefer to run the schema manually:

```bash
psql -U username -d trello_clone -f src/config/schema.sql
```

## Development

During development, you can:

- Use `npm run dev` to start the development server
- The database connection will be tested automatically
- Check logs for any database-related errors

## Production

For production deployment:

1. Ensure `NODE_ENV=production` is set
2. Use a production PostgreSQL instance
3. Configure proper SSL settings
4. Set up database backups and monitoring
