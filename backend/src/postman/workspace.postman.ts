/**
 * Postman Collection for Workspace API Routes
 * 
 * This file contains all workspace endpoints with their request bodies and examples.
 * Copy these requests into your Postman collection for testing the workspace API.
 * 
 * Base URL: http://localhost:3000/api/workspaces
 */

// ============================================================================
// WORKSPACE CRUD OPERATIONS
// ============================================================================

/**
 * 1. CREATE WORKSPACE
 * POST /api/workspaces
 */
const createWorkspaceRequest = {
  method: "POST",
  url: "{{baseUrl}}/api/workspaces",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer {{token}}"
  },
  body: {
    mode: "raw",
    raw: JSON.stringify({
      "name": "My New Workspace",
      "description": "A workspace for managing our team projects",
      "createdBy": "123e4567-e89b-12d3-a456-426614174000",
      "visibility": "Private",
      "premium": false,
      "type": "EngineeringIt",
      "workspaceMembershipRestrictions": "Anybody",
      "publicBoardCreation": "WorkspaceMember",
      "workspaceBoardCreation": "WorkspaceMember",
      "privateBoardCreation": "WorkspaceMember",
      "publicBoardDeletion": "WorkspaceAdmin",
      "workspaceBoardDeletion": "WorkspaceAdmin",
      "privateBoardDeletion": "WorkspaceMember",
      "allowGuestSharing": "OnlyWorkspaceMember",
      "allowSlackIntegration": "WorkspaceMember"
    }, null, 2)
  }
};

/**
 * 2. GET ALL WORKSPACES
 * GET /api/workspaces
 */
const getAllWorkspacesRequest = {
  method: "GET",
  url: "{{baseUrl}}/api/workspaces",
  headers: {
    "Authorization": "Bearer {{token}}"
  }
};

/**
 * 3. SEARCH WORKSPACES
 * GET /api/workspaces/search?q=searchTerm&limit=10
 */
const searchWorkspacesRequest = {
  method: "GET",
  url: "{{baseUrl}}/api/workspaces/search?q=engineering&limit=10",
  headers: {
    "Authorization": "Bearer {{token}}"
  }
};

/**
 * 4. GET WORKSPACES BY USER
 * GET /api/workspaces/user/:userId
 */
const getWorkspacesByUserRequest = {
  method: "GET",
  url: "{{baseUrl}}/api/workspaces/user/123e4567-e89b-12d3-a456-426614174000",
  headers: {
    "Authorization": "Bearer {{token}}"
  }
};

/**
 * 5. GET WORKSPACES BY CREATOR
 * GET /api/workspaces/creator/:userId
 */
const getWorkspacesByCreatorRequest = {
  method: "GET",
  url: "{{baseUrl}}/api/workspaces/creator/123e4567-e89b-12d3-a456-426614174000",
  headers: {
    "Authorization": "Bearer {{token}}"
  }
};

/**
 * 6. GET WORKSPACE BY ID
 * GET /api/workspaces/:id
 */
const getWorkspaceRequest = {
  method: "GET",
  url: "{{baseUrl}}/api/workspaces/123e4567-e89b-12d3-a456-426614174000",
  headers: {
    "Authorization": "Bearer {{token}}"
  }
};

/**
 * 7. UPDATE WORKSPACE
 * PUT /api/workspaces/:id
 */
const updateWorkspaceRequest = {
  method: "PUT",
  url: "{{baseUrl}}/api/workspaces/123e4567-e89b-12d3-a456-426614174000",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer {{token}}"
  },
  body: {
    mode: "raw",
    raw: JSON.stringify({
      "name": "Updated Workspace Name",
      "description": "Updated description for the workspace",
      "visibility": "Public",
      "premium": true,
      "type": "Marketing",
      "workspaceMembershipRestrictions": "SpecificDomain",
      "publicBoardCreation": "WorkspaceAdmin",
      "workspaceBoardCreation": "WorkspaceAdmin",
      "privateBoardCreation": "WorkspaceMember",
      "publicBoardDeletion": "Nobody",
      "workspaceBoardDeletion": "WorkspaceAdmin",
      "privateBoardDeletion": "WorkspaceMember",
      "allowGuestSharing": "Anybody",
      "allowSlackIntegration": "Admins"
    }, null, 2)
  }
};

/**
 * 8. DELETE WORKSPACE
 * DELETE /api/workspaces/:id
 */
const deleteWorkspaceRequest = {
  method: "DELETE",
  url: "{{baseUrl}}/api/workspaces/123e4567-e89b-12d3-a456-426614174000",
  headers: {
    "Authorization": "Bearer {{token}}"
  }
};

// ============================================================================
// WORKSPACE BOARDS
// ============================================================================

/**
 * 9. GET WORKSPACE BOARDS
 * GET /api/workspaces/:id/boards
 */
const getWorkspaceBoardsRequest = {
  method: "GET",
  url: "{{baseUrl}}/api/workspaces/123e4567-e89b-12d3-a456-426614174000/boards",
  headers: {
    "Authorization": "Bearer {{token}}"
  }
};

// ============================================================================
// WORKSPACE MEMBER MANAGEMENT
// ============================================================================

/**
 * 10. GET WORKSPACE MEMBERS
 * GET /api/workspaces/:id/members
 */
const getWorkspaceMembersRequest = {
  method: "GET",
  url: "{{baseUrl}}/api/workspaces/123e4567-e89b-12d3-a456-426614174000/members",
  headers: {
    "Authorization": "Bearer {{token}}"
  }
};

/**
 * 11. ADD WORKSPACE MEMBER
 * POST /api/workspaces/:id/members
 */
const addWorkspaceMemberRequest = {
  method: "POST",
  url: "{{baseUrl}}/api/workspaces/123e4567-e89b-12d3-a456-426614174000/members",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer {{token}}"
  },
  body: {
    mode: "raw",
    raw: JSON.stringify({
      "userId": "987fcdeb-51a2-43d7-8f9e-123456789abc",
      "role": "Member"
    }, null, 2)
  }
};

/**
 * 12. UPDATE WORKSPACE MEMBER ROLE
 * PUT /api/workspaces/:id/members/:userId
 */
const updateWorkspaceMemberRequest = {
  method: "PUT",
  url: "{{baseUrl}}/api/workspaces/123e4567-e89b-12d3-a456-426614174000/members/987fcdeb-51a2-43d7-8f9e-123456789abc",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer {{token}}"
  },
  body: {
    mode: "raw",
    raw: JSON.stringify({
      "role": "Admin"
    }, null, 2)
  }
};

/**
 * 13. REMOVE WORKSPACE MEMBER
 * DELETE /api/workspaces/:id/members/:userId
 */
const removeWorkspaceMemberRequest = {
  method: "DELETE",
  url: "{{baseUrl}}/api/workspaces/123e4567-e89b-12d3-a456-426614174000/members/987fcdeb-51a2-43d7-8f9e-123456789abc",
  headers: {
    "Authorization": "Bearer {{token}}"
  }
};

// ============================================================================
// POSTMAN ENVIRONMENT VARIABLES
// ============================================================================

/**
 * Environment Variables to set in Postman:
 * 
 * baseUrl: http://localhost:3000
 * token: your-jwt-token-here
 * 
 * Example UUIDs (replace with actual IDs from your database):
 * - Workspace ID: 123e4567-e89b-12d3-a456-426614174000
 * - User ID: 987fcdeb-51a2-43d7-8f9e-123456789abc
 */

// ============================================================================
// VALIDATION SCHEMA REFERENCE
// ============================================================================

/**
 * Workspace Types:
 * - Marketing
 * - SalesCrm
 * - HumenResources
 * - SmallBusiness
 * - EngineeringIt
 * - Education
 * - Operations
 * - Other
 * 
 * Visibility Options:
 * - Private
 * - Public
 * 
 * Membership Restrictions:
 * - Anybody
 * - SpecificDomain
 * 
 * Board Creation/Deletion Permissions:
 * - WorkspaceMember
 * - WorkspaceAdmin
 * - Nobody
 * 
 * Guest Sharing Options:
 * - Anybody
 * - OnlyWorkspaceMember
 * 
 * Slack Integration Options:
 * - WorkspaceMember
 * - Admins
 * 
 * Member Roles:
 * - Admin
 * - Member
 * - Guest
 */

export {
  createWorkspaceRequest,
  getAllWorkspacesRequest,
  searchWorkspacesRequest,
  getWorkspacesByUserRequest,
  getWorkspacesByCreatorRequest,
  getWorkspaceRequest,
  updateWorkspaceRequest,
  deleteWorkspaceRequest,
  getWorkspaceBoardsRequest,
  getWorkspaceMembersRequest,
  addWorkspaceMemberRequest,
  updateWorkspaceMemberRequest,
  removeWorkspaceMemberRequest
};
