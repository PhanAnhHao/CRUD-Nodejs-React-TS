import axios from "axios";
import { IBackendRes } from "../../types/backend";
import { IUser } from "../../components/users/users.table";

export const postCreateAUserApi = async (data: IUser) => {
    const res = await axios.post<IBackendRes<IUser>>(
        'http://localhost:8080/users',
        data
    );
    return res.data;
};

export const getAllUsersApi = async () => {
    const res = await axios.get<IBackendRes<IUser[]>>('http://localhost:8080/users/all');
    return res.data;
};

export const getUsersWithPaginationApi = async (current: number, pageSize: number) => {
    const res = await axios.get<IBackendRes<IUser[]>>(`http://localhost:8080/users?current=${current}&pageSize=${pageSize}`);
    return res.data;
};
