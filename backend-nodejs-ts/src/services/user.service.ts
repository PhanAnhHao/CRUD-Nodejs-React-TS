import { prisma } from "config/client";
import getConnection from "config/database";

const handleCreateUser = async (
    fullName: string,
    email: string,
    address: string) => {
};

const getAllUsers = async () => {

};

const handleDeleteUser = async (id: string) => {

}

const getUserById = async (id: string) => {

}

const updateUserById = async (id: string, email: string, address: string, fullName: string) => {

}

export { handleCreateUser, getAllUsers, handleDeleteUser, getUserById, updateUserById }