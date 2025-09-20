import { query } from "../config/database.js";
export class WorkspaceService {
    static async createWorkspace(workspaceData) {
        const { name, description, visibility, premium, type, created_by, workspace_membership_restrictions, public_board_creation, workspace_board_creation, private_board_creation, public_board_deletion, workspace_board_deletion, private_board_deletion, allow_guest_sharing, allow_slack_integration, } = workspaceData;
        const result = await query(`INSERT INTO workspaces (
        name, description, visibility, premium, type, created_by,
        workspace_membership_restrictions, public_board_creation,
        workspace_board_creation, private_board_creation,
        public_board_deletion, workspace_board_deletion, private_board_deletion,
        allow_guest_sharing, allow_slack_integration, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW()) 
      RETURNING *`, [
            name,
            description,
            visibility,
            premium,
            type,
            created_by,
            workspace_membership_restrictions,
            public_board_creation,
            workspace_board_creation,
            private_board_creation,
            public_board_deletion,
            workspace_board_deletion,
            private_board_deletion,
            allow_guest_sharing,
            allow_slack_integration,
        ]);
        return result.rows[0];
    }
    static async getWorkspaceById(id) {
        const result = await query("SELECT * FROM workspaces WHERE id = $1", [id]);
        return result.rows[0] || null;
    }
    static async getWorkspaceWithMembers(id) {
        const workspace = await this.getWorkspaceById(id);
        if (!workspace)
            return null;
        const members = await this.getWorkspaceMembers(id);
        const boards = await this.getWorkspaceBoards(id);
        return {
            ...workspace,
            members,
            boards,
        };
    }
    static async getWorkspacesByUser(userId) {
        const result = await query(`SELECT w.* FROM workspaces w
       JOIN workspace_members wm ON w.id = wm.workspace_id
       WHERE wm.user_id = $1
       ORDER BY w.created_at DESC`, [userId]);
        return result.rows;
    }
    static async getWorkspacesByCreator(createdBy) {
        const result = await query("SELECT * FROM workspaces WHERE created_by = $1 ORDER BY created_at DESC", [createdBy]);
        return result.rows;
    }
    static async updateWorkspace(id, updates) {
        const fields = [];
        const values = [];
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
        if (updates.visibility !== undefined) {
            fields.push(`visibility = $${paramCount}`);
            values.push(updates.visibility);
            paramCount++;
        }
        if (updates.premium !== undefined) {
            fields.push(`premium = $${paramCount}`);
            values.push(updates.premium);
            paramCount++;
        }
        if (updates.type !== undefined) {
            fields.push(`type = $${paramCount}`);
            values.push(updates.type);
            paramCount++;
        }
        if (updates.workspace_membership_restrictions !== undefined) {
            fields.push(`workspace_membership_restrictions = $${paramCount}`);
            values.push(updates.workspace_membership_restrictions);
            paramCount++;
        }
        if (updates.public_board_creation !== undefined) {
            fields.push(`public_board_creation = $${paramCount}`);
            values.push(updates.public_board_creation);
            paramCount++;
        }
        if (updates.workspace_board_creation !== undefined) {
            fields.push(`workspace_board_creation = $${paramCount}`);
            values.push(updates.workspace_board_creation);
            paramCount++;
        }
        if (updates.private_board_creation !== undefined) {
            fields.push(`private_board_creation = $${paramCount}`);
            values.push(updates.private_board_creation);
            paramCount++;
        }
        if (updates.public_board_deletion !== undefined) {
            fields.push(`public_board_deletion = $${paramCount}`);
            values.push(updates.public_board_deletion);
            paramCount++;
        }
        if (updates.workspace_board_deletion !== undefined) {
            fields.push(`workspace_board_deletion = $${paramCount}`);
            values.push(updates.workspace_board_deletion);
            paramCount++;
        }
        if (updates.private_board_deletion !== undefined) {
            fields.push(`private_board_deletion = $${paramCount}`);
            values.push(updates.private_board_deletion);
            paramCount++;
        }
        if (updates.allow_guest_sharing !== undefined) {
            fields.push(`allow_guest_sharing = $${paramCount}`);
            values.push(updates.allow_guest_sharing);
            paramCount++;
        }
        if (updates.allow_slack_integration !== undefined) {
            fields.push(`allow_slack_integration = $${paramCount}`);
            values.push(updates.allow_slack_integration);
            paramCount++;
        }
        if (fields.length === 0) {
            return this.getWorkspaceById(id);
        }
        values.push(id);
        const result = await query(`UPDATE workspaces SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`, values);
        return result.rows[0] || null;
    }
    static async deleteWorkspace(id) {
        const result = await query("DELETE FROM workspaces WHERE id = $1 RETURNING id", [id]);
        return (result.rowCount ?? 0) > 0;
    }
    static async getAllWorkspaces() {
        const result = await query("SELECT * FROM workspaces ORDER BY created_at DESC");
        return result.rows;
    }
    // Workspace Member Management
    static async addWorkspaceMember(workspaceId, userId, role = "member") {
        const result = await query(`INSERT INTO workspace_members (workspace_id, user_id, role, joined_at) 
       VALUES ($1, $2, $3, NOW()) 
       RETURNING *`, [workspaceId, userId, role]);
        return result.rows[0];
    }
    static async removeWorkspaceMember(workspaceId, userId) {
        const result = await query("DELETE FROM workspace_members WHERE workspace_id = $1 AND user_id = $2 RETURNING *", [workspaceId, userId]);
        return (result.rowCount ?? 0) > 0;
    }
    static async updateWorkspaceMemberRole(workspaceId, userId, newRole) {
        const result = await query(`UPDATE workspace_members SET role = $1 
       WHERE workspace_id = $2 AND user_id = $3 
       RETURNING *`, [newRole, workspaceId, userId]);
        return result.rows[0] || null;
    }
    static async getWorkspaceMembers(workspaceId) {
        const result = await query(`SELECT wm.*, u.full_name, u.username, u.avatar_url
       FROM workspace_members wm
       JOIN users u ON wm.user_id = u.id
       WHERE wm.workspace_id = $1
       ORDER BY wm.joined_at ASC`, [workspaceId]);
        return result.rows;
    }
    static async getWorkspaceBoards(workspaceId) {
        const result = await query(`SELECT * FROM boards WHERE workspace_id = $1 ORDER BY created_at DESC`, [workspaceId]);
        return result.rows;
    }
    static async searchWorkspaces(searchTerm, limit = 10) {
        const searchQuery = `%${searchTerm}%`;
        const result = await query(`SELECT * FROM workspaces 
       WHERE name ILIKE $1 OR description ILIKE $1
       ORDER BY name
       LIMIT $2`, [searchQuery, limit]);
        return result.rows;
    }
}
/*
 * WHAT HAS BEEN IMPLEMENTED:
 *
 * Updated WorkspaceService class matching the new comprehensive database schema:
 * - createWorkspace: Now supports all new workspace fields and permission controls
 * - getWorkspaceWithMembers: Gets workspace with members and boards
 * - getWorkspacesByUser: Gets workspaces where user is a member
 * - updateWorkspace: Updated to handle all new workspace fields
 * - addWorkspaceMember: New method for adding members to workspaces
 * - removeWorkspaceMember: New method for removing members
 * - updateWorkspaceMemberRole: New method for changing member roles
 * - getWorkspaceMembers: New method for getting workspace members
 * - getWorkspaceBoards: New method for getting workspace boards
 * - searchWorkspaces: New method for workspace search
 *
 * All methods use the correct field names from the new schema and include
 * comprehensive workspace management capabilities that align with the database structure.
 */
