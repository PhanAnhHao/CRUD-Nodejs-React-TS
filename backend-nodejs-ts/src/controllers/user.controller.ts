import { Request, Response } from "express";
import {
    handleCreateUser,
    handleGetAllUsers,
    handleGetUsersWithPaginate,
    handleGetUserById,
    handleDeleteUser,
    handleUpdateUserById
} from "services/user.service";

// Create
export const createUser = async (req: Request, res: Response) => {
    try {
        const { email, password, fullName, address, phone, avatar, roleId } = req.body;

        if (!email || !password || !fullName) {
            return res.status(400).json({
                status: 400,
                message: "Missing email/password/fullName",
            });
        }

        const newUser = await handleCreateUser(
            email,
            password,
            fullName,
            address,
            phone,
            avatar,
            roleId
        );

        return res.status(201).json({
            status: 201,
            message: "Create user success",
            data: newUser,
        });
    } catch (error: any) {
        console.error("postCreateUser error:", error);
        return res.status(500).json({
            status: 500,
            message: error?.message || "Internal server error",
        });
    }
};

// Get all
// dùng _req thay cho req ở đây vì hàm này ko dùng đến req
// tránh tình trạng: warning "variable 'req' is declared but its value is never read
export const getUsersPage = async (_req: Request, res: Response) => {
    try {
        const users = await handleGetAllUsers();
        return res.status(200).json({
            status: 200,
            message: "Get all users success",
            data: users,
        });
    } catch (error) {
        console.error("getUsersPage error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};

// Pagination
export const getUsersPageWithPaginate = async (req: Request, res: Response) => {
    try {
        const { current, pageSize } = req.query;
        const currentPage = Math.max(Number(current) || 1, 1);
        const size = Math.max(Number(pageSize) || 10, 1);

        const result = await handleGetUsersWithPaginate(currentPage, size);

        if (!result.success) {
            return res.status(500).json({
                status: 500,
                message: result.errorMessage || "Failed to get users with pagination",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Get users with pagination success",
            data: result.users,
            pagination: {
                currentPage,
                pageSize: size,
                totalItems: result.totalItems,
                totalPages: result.totalPages,
            },
        });
    } catch (error) {
        console.error("getUsersPageWithPaginate error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};

// Get by ID
export const getViewUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await handleGetUserById(id);

        if (!result.success) {
            const status = result.message === "User not found" ? 404 : 500;
            return res.status(status).json({
                status,
                message: result.message,
            });
        }

        return res.status(200).json({
            status: 200,
            message: result.message,
            data: result.data,
        });
    } catch (error) {
        console.error("getViewUser error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};

// Delete
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await handleDeleteUser(id);

        if (!result.success) {
            const status = result.message === "User not found" ? 404 : 500;
            return res.status(status).json({
                status,
                message: result.message,
            });
        }

        return res.status(200).json({
            status: 200,
            message: result.message,
            data: result.data,
        });
    } catch (error) {
        console.error("deleteUser error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};

// Update
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { email, fullName, address, phone, avatar, roleId } = req.body;

        const updatedUser = await handleUpdateUserById(
            id,
            email,
            fullName,
            address,
            phone,
            avatar,
            roleId
        );

        if (!updatedUser) {
            return res.status(404).json({
                status: 404,
                message: "User not found or update failed",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Update user success",
            data: updatedUser,
        });
    } catch (error) {
        console.error("updateUser error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};
