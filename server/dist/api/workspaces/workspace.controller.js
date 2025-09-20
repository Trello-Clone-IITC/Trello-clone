import { AppError } from "../../utils/appError.js";
import {} from "@ronmordo/contracts";
import workspaceService from "./workspace.service.js";
import { mapWorkspaceToDto } from "./workspace.mapper.js";
import { mapWorkspaceMemberToDto } from "../workspace-members/workspace-members.mapper.js";
import { userService } from "../users/user.service.js";
const createWorkspace = async (req, res, next) => {
    try {
        const userId = await userService.getUserIdByRequest(req);
        if (!userId) {
            throw new AppError("Missing user in database", 500);
        }
        const workspace = await workspaceService.createWorkspace(req.body, userId);
        return res.status(201).json({
            success: true,
            data: workspace,
        });
    }
    catch (error) {
        return next(error);
    }
};
const getWorkspace = async (req, res, next) => {
    try {
        const workspace = await workspaceService.getWorkspaceById(req.params.id);
        return res.status(200).json({
            success: true,
            data: workspace,
        });
    }
    catch (error) {
        return next(error);
    }
};
const updateWorkspace = async (req, res, next) => {
    try {
        const updatedWorkspace = await workspaceService.updateWorkspace(req.params.id, req.body);
        return res.status(200).json({
            success: true,
            data: updatedWorkspace,
        });
    }
    catch (error) {
        return next(error);
    }
};
const deleteWorkspace = async (req, res, next) => {
    try {
        await workspaceService.deleteWorkspace(req.params.id);
        return res.status(200).json({
            success: true,
            data: { message: "Workspace deleted successfully" },
        });
    }
    catch (error) {
        return next(error);
    }
};
const getWorkspaceBoards = async (req, res, next) => {
    try {
        const boards = await workspaceService.getWorkspaceBoards(req.params.id);
        return res.status(200).json({
            success: true,
            data: boards,
        });
    }
    catch (error) {
        return next(error);
    }
};
const getAllWorkspaces = async (_req, res, next) => {
    try {
        const workspaces = await workspaceService.getAllWorkspaces();
        const workspacesDto = workspaces.map(mapWorkspaceToDto);
        return res.status(200).json({
            success: true,
            data: workspacesDto,
        });
    }
    catch (error) {
        return next(error);
    }
};
const getWorkspacesByCreator = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const workspaces = await workspaceService.getWorkspacesByCreator(userId);
        const workspacesDto = workspaces.map(mapWorkspaceToDto);
        return res.status(200).json({
            success: true,
            data: workspacesDto,
        });
    }
    catch (error) {
        return next(error);
    }
};
const getWorkspaceMembers = async (req, res, next) => {
    try {
        const { id } = req.params;
        const members = await workspaceService.getWorkspaceMembers(id);
        // Transform Prisma workspace members to DTO format
        const memberDtos = members.map(mapWorkspaceMemberToDto);
        return res.status(200).json({
            success: true,
            data: memberDtos,
        });
    }
    catch (error) {
        return next(error);
    }
};
const addWorkspaceMember = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role, userId: newMemberId } = req.body;
        const userId = (await userService.getUserIdByRequest(req)) ||
            "8d81cbd4-4343-436a-8864-9918194f157f";
        console.log("-------------------------");
        const member = await workspaceService.addWorkspaceMember(id, newMemberId, role);
        // Transform Prisma workspace member to DTO format
        const memberDto = mapWorkspaceMemberToDto(member);
        return res.status(201).json({
            success: true,
            data: memberDto,
        });
    }
    catch (error) {
        return next(error);
    }
};
const removeWorkspaceMember = async (req, res, next) => {
    try {
        const { id, userId: userIdToDelete } = req.params;
        const userId = (await userService.getUserIdByRequest(req)) || "";
        await workspaceService.removeWorkspaceMember(id, userId, userIdToDelete);
        return res.status(200).json({
            success: true,
            data: { message: "Workspace member removed successfully" },
        });
    }
    catch (error) {
        return next(error);
    }
};
const updateWorkspaceMemberRole = async (req, res, next) => {
    try {
        const { id, userId: memberId } = req.params;
        const { role } = req.body;
        const userId = (await userService.getUserIdByRequest(req)) ||
            "8d81cbd4-4343-436a-8864-9918194f157f";
        const member = await workspaceService.updateWorkspaceMemberRole(id, memberId, role);
        if (!member) {
            throw new AppError("Workspace member not found", 404);
        }
        // Transform Prisma workspace member to DTO format
        const memberDto = mapWorkspaceMemberToDto(member);
        return res.status(200).json({
            success: true,
            data: memberDto,
        });
    }
    catch (error) {
        return next(error);
    }
};
const searchWorkspaces = async (req, res, next) => {
    try {
        const { q, limit } = req.query;
        const workspaces = await workspaceService.searchWorkspaces(q, limit ? parseInt(limit) : 10);
        const workspacesDto = workspaces.map(mapWorkspaceToDto);
        return res.status(200).json({
            success: true,
            data: workspacesDto,
        });
    }
    catch (error) {
        return next(error);
    }
};
export default {
    createWorkspace,
    getWorkspace,
    updateWorkspace,
    deleteWorkspace,
    getWorkspaceBoards,
    getAllWorkspaces,
    getWorkspacesByCreator,
    getWorkspaceMembers,
    addWorkspaceMember,
    removeWorkspaceMember,
    updateWorkspaceMemberRole,
    searchWorkspaces,
};
