import axios from "axios";
import { IBackendRes } from "../../types/backend";
import { IUser } from "../../components/users/users.table";

export const getAllUsersApi = async () => {
    const res = await axios.get<IBackendRes<IUser[]>>('http://localhost:8080/users/all');
    return res.data;
};