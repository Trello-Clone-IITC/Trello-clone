import { query } from "../config/database.js";
import {
  Board,
  BoardMember,
  BoardWithMembers,
  List,
} from "../../utils/globalTypes.js";

export class BoardService {
  static async createBoard(
    boardData: Omit<Board, "id" | "created_at" | "updated_at">
  ): Promise<Board> {
    const {
      workspace_id,
      name,
      description,
      background,
      created_by,
      allow_covers,
      show_complete,
      visibility,
      member_manage,
      commenting,
    } = boardData;

    const result = await query(
      `INSERT INTO boards (
        workspace_id, name, description, background, created_by,
        allow_covers, show_complete, visibility, member_manage, commenting,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) 
      RETURNING *`,
      [
        workspace_id,
        name,
        description,
        background,
        created_by,
        allow_covers,
        show_complete,
        visibility,
        member_manage,
        commenting,
      ]
    );

    return result.rows[0];
  }

  static async getBoardById(id: string): Promise<Board | null> {
    const result = await query("SELECT * FROM boards WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  static async getBoardWithMembers(
    id: string
  ): Promise<BoardWithMembers | null> {
    const board = await this.getBoardById(id);
    if (!board) return null;

    const members = await this.getBoardMembers(id);
    const lists = await this.getBoardLists(id);

    return {
      ...board,
      members,
      lists,
    };
  }

  static async getBoardsByWorkspace(workspaceId: string): Promise<Board[]> {
    const result = await query(
      "SELECT * FROM boards WHERE workspace_id = $1 ORDER BY created_at DESC",
      [workspaceId]
    );
    return result.rows;
  }

  static async getBoardsByUser(userId: string): Promise<Board[]> {
    const result = await query(
      `SELECT b.* FROM boards b
       JOIN board_members bm ON b.id = bm.board_id
       WHERE bm.user_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async updateBoard(
    id: string,
    updates: Partial<
      Pick<
        Board,
        | "name"
        | "description"
        | "background"
        | "allow_covers"
        | "show_complete"
        | "visibility"
        | "member_manage"
        | "commenting"
        | "last_activity_at"
      >
    >
  ): Promise<Board | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updates.name !== undefined) {
      fields.push(`name = $${paramCount}`);
      values.push(updates.name);
      paramCount++;
    }

    if (updates.description !== undefined) {
      fields.push(`description = $${paramCount}`);
      values.push(updates.description);
      paramCount++;
    }

    if (updates.background !== undefined) {
      fields.push(`background = $${paramCount}`);
      values.push(updates.background);
      paramCount++;
    }

    if (updates.allow_covers !== undefined) {
      fields.push(`allow_covers = $${paramCount}`);
      values.push(updates.allow_covers);
      paramCount++;
    }

    if (updates.show_complete !== undefined) {
      fields.push(`show_complete = $${paramCount}`);
      values.push(updates.show_complete);
      paramCount++;
    }

    if (updates.visibility !== undefined) {
      fields.push(`visibility = $${paramCount}`);
      values.push(updates.visibility);
      paramCount++;
    }

    if (updates.member_manage !== undefined) {
      fields.push(`member_manage = $${paramCount}`);
      values.push(updates.member_manage);
      paramCount++;
    }

    if (updates.commenting !== undefined) {
      fields.push(`commenting = $${paramCount}`);
      values.push(updates.commenting);
      paramCount++;
    }

    if (updates.last_activity_at !== undefined) {
      fields.push(`last_activity_at = $${paramCount}`);
      values.push(updates.last_activity_at);
      paramCount++;
    }

    if (fields.length === 0) {
      return this.getBoardById(id);
    }

    values.push(id);

    const result = await query(
      `UPDATE boards SET ${fields.join(
        ", "
      )} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  static async deleteBoard(id: string): Promise<boolean> {
    const result = await query(
      "DELETE FROM boards WHERE id = $1 RETURNING id",
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }

  static async getAllBoards(): Promise<Board[]> {
    const result = await query("SELECT * FROM boards ORDER BY created_at DESC");
    return result.rows;
  }

  // Board Member Management
  static async addBoardMember(
    boardId: string,
    userId: string,
    role: string = "member"
  ): Promise<BoardMember> {
    const result = await query(
      `INSERT INTO board_members (board_id, user_id, role, joined_at) 
       VALUES ($1, $2, $3, NOW()) 
       RETURNING *`,
      [boardId, userId, role]
    );
    return result.rows[0];
  }

  static async removeBoardMember(
    boardId: string,
    userId: string
  ): Promise<boolean> {
    const result = await query(
      "DELETE FROM board_members WHERE board_id = $1 AND user_id = $2 RETURNING *",
      [boardId, userId]
    );
    return (result.rowCount ?? 0) > 0;
  }

  static async updateBoardMemberRole(
    boardId: string,
    userId: string,
    newRole: string
  ): Promise<BoardMember | null> {
    const result = await query(
      `UPDATE board_members SET role = $1 
       WHERE board_id = $2 AND user_id = $3 
       RETURNING *`,
      [newRole, boardId, userId]
    );
    return result.rows[0] || null;
  }

  static async getBoardMembers(boardId: string): Promise<BoardMember[]> {
    const result = await query(
      `SELECT bm.*, u.full_name, u.username, u.avatar_url
       FROM board_members bm
       JOIN users u ON bm.user_id = u.id
       WHERE bm.board_id = $1
       ORDER BY bm.joined_at ASC`,
      [boardId]
    );
    return result.rows;
  }

  // List Management
  static async createList(listData: Omit<List, "id">): Promise<List> {
    const { board_id, name, position, is_archived, subscribed } = listData;

    const result = await query(
      `INSERT INTO lists (board_id, name, position, is_archived, subscribed) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [board_id, name, position, is_archived, subscribed]
    );

    return result.rows[0];
  }

  static async getBoardLists(boardId: string): Promise<List[]> {
    const result = await query(
      "SELECT * FROM lists WHERE board_id = $1 ORDER BY position ASC",
      [boardId]
    );
    return result.rows;
  }

  static async updateListPosition(
    listId: string,
    newPosition: number
  ): Promise<List | null> {
    const result = await query(
      `UPDATE lists SET position = $1 WHERE id = $2 RETURNING *`,
      [newPosition, listId]
    );
    return result.rows[0] || null;
  }

  static async archiveList(
    listId: string,
    archived: boolean = true
  ): Promise<List | null> {
    const result = await query(
      `UPDATE lists SET is_archived = $1 WHERE id = $2 RETURNING *`,
      [archived, listId]
    );
    return result.rows[0] || null;
  }

  static async searchBoards(
    searchTerm: string,
    limit: number = 10
  ): Promise<Board[]> {
    const searchQuery = `%${searchTerm}%`;
    const result = await query(
      `SELECT * FROM boards 
       WHERE name ILIKE $1 OR description ILIKE $1
       ORDER BY name
       LIMIT $2`,
      [searchQuery, limit]
    );
    return result.rows;
  }
}

/*
 * WHAT HAS BEEN IMPLEMENTED:
 *
 * Updated BoardService class matching the new comprehensive database schema:
 * - createBoard: Now supports all new board fields and permission controls
 * - getBoardWithMembers: Gets board with members and lists
 * - getBoardsByWorkspace: Gets boards in a specific workspace
 * - getBoardsByUser: Gets boards where user is a member
 * - updateBoard: Updated to handle all new board fields
 * - addBoardMember: New method for adding members to boards
 * - removeBoardMember: New method for removing members
 * - updateBoardMemberRole: New method for changing member roles
 * - getBoardMembers: New method for getting board members
 * - createList: New method for creating lists
 * - getBoardLists: New method for getting board lists
 * - updateListPosition: New method for reordering lists
 * - archiveList: New method for archiving lists
 * - searchBoards: New method for board search
 *
 * All methods use the correct field names from the new schema and include
 * comprehensive board and list management capabilities that align with the database structure.
 */
