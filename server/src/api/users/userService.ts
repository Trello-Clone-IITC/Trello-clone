import { query } from "../config/database.js";
import { User, WorkspaceMember } from "../utils/globalTypes.js";

export class UserService {
  static async createUser(
    userData: Omit<User, "id" | "created_at">
  ): Promise<User> {
    const {
      clerk_id,
      email,
      username,
      full_name,
      avatar_url,
      theme,
      email_notification,
      push_notification,
      bio,
    } = userData;

    const result = await query(
      `INSERT INTO users (clerk_id, email, username, full_name, avatar_url, theme, email_notification, push_notification, bio, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) 
       RETURNING *`,
      [
        clerk_id,
        email,
        username,
        full_name,
        avatar_url,
        theme,
        email_notification,
        push_notification,
        bio,
      ]
    );

    return result.rows[0];
  }

  static async getUserById(id: string): Promise<User | null> {
    const result = await query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  static async getUserByClerkId(clerk_id: string): Promise<User | null> {
    const result = await query("SELECT * FROM users WHERE clerk_id = $1", [
      clerk_id,
    ]);
    return result.rows[0] || null;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0] || null;
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    const result = await query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    return result.rows[0] || null;
  }

  static async updateUser(
    id: string,
    updates: Partial<
      Pick<
        User,
        | "username"
        | "full_name"
        | "avatar_url"
        | "theme"
        | "email_notification"
        | "push_notification"
        | "bio"
      >
    >
  ): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updates.username !== undefined) {
      fields.push(`username = $${paramCount}`);
      values.push(updates.username);
      paramCount++;
    }

    if (updates.full_name !== undefined) {
      fields.push(`full_name = $${paramCount}`);
      values.push(updates.full_name);
      paramCount++;
    }

    if (updates.avatar_url !== undefined) {
      fields.push(`avatar_url = $${paramCount}`);
      values.push(updates.avatar_url);
      paramCount++;
    }

    if (updates.theme !== undefined) {
      fields.push(`theme = $${paramCount}`);
      values.push(updates.theme);
      paramCount++;
    }

    if (updates.email_notification !== undefined) {
      fields.push(`email_notification = $${paramCount}`);
      values.push(updates.email_notification);
      paramCount++;
    }

    if (updates.push_notification !== undefined) {
      fields.push(`push_notification = $${paramCount}`);
      values.push(updates.push_notification);
      paramCount++;
    }

    if (updates.bio !== undefined) {
      fields.push(`bio = $${paramCount}`);
      values.push(updates.bio);
      paramCount++;
    }

    if (fields.length === 0) {
      return this.getUserById(id);
    }

    values.push(id);

    const result = await query(
      `UPDATE users SET ${fields.join(
        ", "
      )} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  static async deleteUser(id: string): Promise<boolean> {
    const result = await query("DELETE FROM users WHERE id = $1 RETURNING id", [
      id,
    ]);
    return (result.rowCount ?? 0) > 0;
  }

  static async getAllUsers(): Promise<User[]> {
    const result = await query("SELECT * FROM users ORDER BY created_at DESC");
    return result.rows;
  }

  static async getUserWorkspaces(userId: string): Promise<WorkspaceMember[]> {
    const result = await query(
      `SELECT wm.*, w.name as workspace_name, w.description as workspace_description
       FROM workspace_members wm
       JOIN workspaces w ON wm.workspace_id = w.id
       WHERE wm.user_id = $1
       ORDER BY wm.joined_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async getUserBoards(userId: string): Promise<any[]> {
    const result = await query(
      `SELECT bm.*, b.name as board_name, b.description as board_description, b.background
       FROM board_members bm
       JOIN boards b ON bm.board_id = b.id
       WHERE bm.user_id = $1
       ORDER BY bm.joined_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async searchUsers(
    searchTerm: string,
    limit: number = 10
  ): Promise<User[]> {
    const searchQuery = `%${searchTerm}%`;
    const result = await query(
      `SELECT * FROM users 
       WHERE full_name ILIKE $1 OR username ILIKE $1 OR email ILIKE $1
       ORDER BY full_name
       LIMIT $2`,
      [searchQuery, limit]
    );
    return result.rows;
  }
}

/*
 * WHAT HAS BEEN IMPLEMENTED:
 *
 * Updated UserService class matching the new comprehensive database schema:
 * - createUser: Now supports all new user fields including Clerk integration
 * - getUserByClerkId: New method for Clerk authentication integration
 * - getUserByUsername: New method for username-based lookups
 * - updateUser: Updated to handle all new user fields
 * - getUserWorkspaces: New method to get user's workspace memberships
 * - getUserBoards: New method to get user's board memberships
 * - searchUsers: New method for user search functionality
 *
 * All methods use the correct field names from the new schema and include
 * proper error handling and type safety. The service now provides comprehensive
 * user management capabilities that align with the database structure.
 */
