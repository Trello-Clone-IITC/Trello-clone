-- Trello Clone Database Schema

-- Enable UUID extension for better ID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE board_role AS ENUM ('admin', 'member', 'observer');
CREATE TYPE board_visibility AS ENUM ('private', 'workspace_members', 'public');
CREATE TYPE member_manage_restrictions AS ENUM ('members', 'admins', 'owners');
CREATE TYPE commenting_restrictions AS ENUM ('board_members', 'workspace_members', 'anybody');
CREATE TYPE workspace_role AS ENUM ('owner', 'admin', 'member');
CREATE TYPE workspace_visibility AS ENUM ('private', 'team', 'public');
CREATE TYPE workspace_type AS ENUM ('other', 'small_business', 'enterprise', 'team', 'marketing', 'product', 'engineering', 'sales', 'hr', 'operations');
CREATE TYPE membership_restrictions AS ENUM ('anybody', 'workspace_member', 'admin_only');
CREATE TYPE board_creation_restrictions AS ENUM ('workspace_member', 'admin_only', 'owner_only');
CREATE TYPE board_sharing AS ENUM ('anybody', 'workspace_member', 'admin_only');
CREATE TYPE slack_sharing AS ENUM ('workspace_member', 'admin_only', 'owner_only');
CREATE TYPE theme AS ENUM ('system', 'light', 'dark');

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id TEXT NOT NULL,
    email TEXT NOT NULL,
    username TEXT,
    full_name TEXT NOT NULL,
    avatar_url TEXT NOT NULL DEFAULT 'default_avatar_url',
    theme theme NOT NULL DEFAULT 'system',
    email_notification BOOLEAN NOT NULL DEFAULT true,
    push_notification BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    bio TEXT
);

-- Workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    visibility workspace_visibility NOT NULL DEFAULT 'private',
    premium BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    type workspace_type NOT NULL DEFAULT 'other',
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workspace_membership_restrictions membership_restrictions NOT NULL DEFAULT 'anybody',
    public_board_creation board_creation_restrictions NOT NULL DEFAULT 'workspace_member',
    workspace_board_creation board_creation_restrictions NOT NULL DEFAULT 'workspace_member',
    private_board_creation board_creation_restrictions NOT NULL DEFAULT 'workspace_member',
    public_board_deletion board_creation_restrictions NOT NULL DEFAULT 'workspace_member',
    workspace_board_deletion board_creation_restrictions NOT NULL DEFAULT 'workspace_member',
    private_board_deletion board_creation_restrictions NOT NULL DEFAULT 'workspace_member',
    allow_guest_sharing board_sharing NOT NULL DEFAULT 'anybody',
    allow_slack_integration slack_sharing NOT NULL DEFAULT 'workspace_member'
);

-- Workspace members table
CREATE TABLE IF NOT EXISTS workspace_members (
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role workspace_role NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (workspace_id, user_id)
);

-- Boards table
CREATE TABLE IF NOT EXISTS boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    background TEXT NOT NULL DEFAULT 'default_background_url',
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    allow_covers BOOLEAN NOT NULL DEFAULT true,
    show_complete BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_activity_at TIMESTAMP WITH TIME ZONE,
    visibility board_visibility NOT NULL DEFAULT 'workspace_members',
    member_manage member_manage_restrictions NOT NULL DEFAULT 'members',
    commenting commenting_restrictions NOT NULL DEFAULT 'board_members'
);

-- Board members table
CREATE TABLE IF NOT EXISTS board_members (
    board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role board_role NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (board_id, user_id)
);

-- Lists table
CREATE TABLE IF NOT EXISTS lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    position NUMERIC NOT NULL,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    subscribed BOOLEAN NOT NULL DEFAULT false
);

-- List watchers table
CREATE TABLE IF NOT EXISTS list_watchers (
    list_id UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (list_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_workspaces_created_by ON workspaces(created_by);
CREATE INDEX IF NOT EXISTS idx_workspaces_visibility ON workspaces(visibility);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_boards_workspace_id ON boards(workspace_id);
CREATE INDEX IF NOT EXISTS idx_boards_created_by ON boards(created_by);
CREATE INDEX IF NOT EXISTS idx_boards_visibility ON boards(visibility);
CREATE INDEX IF NOT EXISTS idx_board_members_board_id ON board_members(board_id);
CREATE INDEX IF NOT EXISTS idx_board_members_user_id ON board_members(user_id);
CREATE INDEX IF NOT EXISTS idx_lists_board_id ON lists(board_id);
CREATE INDEX IF NOT EXISTS idx_lists_position ON lists(position);
CREATE INDEX IF NOT EXISTS idx_list_watchers_list_id ON list_watchers(list_id);
CREATE INDEX IF NOT EXISTS idx_list_watchers_user_id ON list_watchers(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_boards_updated_at BEFORE UPDATE ON boards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - for testing)
INSERT INTO users (id, clerk_id, email, username, full_name, avatar_url) VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'clerk_john_123', 'john@example.com', 'johndoe', 'John Doe', 'https://via.placeholder.com/150'),
    ('550e8400-e29b-41d4-a716-446655440001', 'clerk_jane_456', 'jane@example.com', 'janesmith', 'Jane Smith', 'https://via.placeholder.com/150')
ON CONFLICT (id) DO NOTHING;

INSERT INTO workspaces (id, name, description, created_by) VALUES 
    ('550e8400-e29b-41d4-a716-446655440002', 'Personal Workspace', 'My personal workspace', '550e8400-e29b-41d4-a716-446655440000'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Team Workspace', 'Team collaboration workspace', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id) DO NOTHING;

INSERT INTO workspace_members (workspace_id, user_id, role) VALUES 
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'owner'),
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'owner')
ON CONFLICT (workspace_id, user_id) DO NOTHING;

INSERT INTO boards (id, name, description, workspace_id, created_by) VALUES 
    ('550e8400-e29b-41d4-a716-446655440004', 'Project Planning', 'Main project planning board', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000'),
    ('550e8400-e29b-41d4-a716-446655440005', 'Task Management', 'Daily task management', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id) DO NOTHING;

INSERT INTO board_members (board_id, user_id, role) VALUES 
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'admin'),
    ('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'admin')
ON CONFLICT (board_id, user_id) DO NOTHING;

INSERT INTO lists (id, board_id, name, position) VALUES 
    ('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440004', 'To Do', 1),
    ('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440004', 'In Progress', 2),
    ('550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440004', 'Done', 3)
ON CONFLICT (id) DO NOTHING;


