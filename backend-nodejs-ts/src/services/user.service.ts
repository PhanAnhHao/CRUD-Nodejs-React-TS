import { prisma } from "config/client";
import bcrypt from "bcrypt";

const saltRounds = 10;

// Hash password
const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, saltRounds);
};

// Compare password
const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Create user
const handleCreateUser = async (
    email: string,
    password: string,
    fullName: string,
    address: string,
    phone: string,
    avatar: string,
    roleId: number
) => {
    try {
        const hashedPassword = await hashPassword(password);
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                fullName,
                address,
                phone,
                avatar,
                roleId,
            },
        });
        return newUser;
    } catch (error) {
        console.error("handleCreateUser error:", error);
        throw error;
    }
};

// Get all users
const handleGetAllUsers = async () => {
    const users = await prisma.user.findMany({
        include: {
            role: true,
        },
    });
    return users.map(({ password, ...rest }) => rest); // destructuring
};
;

// Pagination
const handleGetUsersWithPaginate = async (currentPage: number, pageSize: number) => {
    try {
        const totalItems = await prisma.user.count();
        const totalPages = Math.ceil(totalItems / pageSize);
        const skip = (currentPage - 1) * pageSize;

        const users = await prisma.user.findMany({
            skip,
            take: pageSize,
        });

        return {
            success: true,
            users,
            totalItems,
            totalPages,
        };
    } catch (error) {
        console.error("getUsersWithPaginate error:", error);
        return {
            success: false,
            users: [],
            totalItems: 0,
            totalPages: 0,
            errorMessage: "Database error when fetching users.",
        };
    }
};

// Get user by id
const handleGetUserById = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: +id },
        });
        if (!user) {
            return { success: false, message: "User not found", data: null };
        }
        return { success: true, message: "Get user success", data: user };
    } catch (error) {
        console.error("getUserById error:", error);
        return { success: false, message: "Internal server error", data: null };
    }
};

// Delete user
const handleDeleteUser = async (id: string) => {
    try {
        const result = await prisma.user.delete({
            where: { id: +id },
        });
        return { success: true, message: "User deleted successfully", data: result };
    } catch (error: any) {
        if (error.code === "P2025") {
            return { success: false, message: "User not found", data: null };
        }
        console.error("Delete user error:", error);
        return { success: false, message: "Internal server error", data: null };
    }
};

// Update user
const handleUpdateUserById = async (
    id: string,
    email: string,
    fullName: string,
    address: string,
    phone: string,
    avatar: string,
    roleId: number
) => {
    try {
        const updatedUser = await prisma.user.update({
            where: { id: +id },
            data: {
                email,
                fullName,
                address,
                phone,
                ...(avatar && { avatar }),
                roleId,
            },
        });
        return updatedUser;
    } catch (error) {
        console.error("updateUserById error:", error);
        return null;
    }
};

export {
    hashPassword,
    comparePassword,
    handleCreateUser,
    handleGetAllUsers,
    handleGetUsersWithPaginate,
    handleGetUserById,
    handleDeleteUser,
    handleUpdateUserById,
};
