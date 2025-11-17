import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllUsersApi, getUserByIdApi, getUsersWithPaginationApi, postCreateAUserApi, putUpdateAUserApi } from '../../services/apis/user.api';
import { IUser } from '../../components/users/users.table';
import { IBackendRes, IPagination } from '../../types/backend';

interface IState {
    isFetching: boolean;
    pagination: IPagination;
    data: IUser[];
    selectedUser: IUser | null; // để lưu getUserById
}

export const getAllUsers = createAsyncThunk<
    IBackendRes<IUser[]>,
    void
>(
    'user/getAllUsers',
    async () => {
        const response = await getAllUsersApi();
        return response;
    }
);

export const createAUser = createAsyncThunk<
    IBackendRes<IUser>, // kiểu dữ liệu trả về
    IUser // kiểu dữ liệu payload khi dispatch
>(
    'user/createAUser',
    async (data: IUser) => {
        const response = await postCreateAUserApi(data);
        return response;
    }
);

export const getUsersWithPagination = createAsyncThunk<
    IBackendRes<IUser[]>,
    { current: number; pageSize: number }
>(
    'user/getUsersWithPagination',
    async ({ current, pageSize }) => {
        const response = await getUsersWithPaginationApi(current, pageSize);
        return response;
    }
);

export const getUserById = createAsyncThunk<IBackendRes<IUser>, number>(
    'user/getUserById',
    async (id: number) => {
        const response = await getUserByIdApi(id);
        return response;
    }
);

export const updateAUser = createAsyncThunk<
    IBackendRes<IUser>, // kiểu trả về từ API
    { id: number; data: Partial<IUser> } // payload khi dispatch, Partial để update 1 số trường
>(
    'user/updateAUser',
    async ({ id, data }) => {
        const response = await putUpdateAUserApi(id, data);
        return response;
    }
);

const initialState: IState = {
    isFetching: false,
    pagination: {
        currentPage: 1,
        pageSize: 5,
        totalItems: 0,
        totalPages: 0,
    },
    data: [],
    selectedUser: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // getAllUsers
            .addCase(getAllUsers.pending, (state) => { state.isFetching = true; })
            .addCase(getAllUsers.rejected, (state) => { state.isFetching = false; })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isFetching = false;
                if (action.payload?.data) state.data = action.payload.data;
                if (action.payload?.pagination) state.pagination = action.payload.pagination;
            })

            // createAUser
            .addCase(createAUser.pending, (state) => { state.isFetching = true; })
            .addCase(createAUser.rejected, (state) => { state.isFetching = false; })
            .addCase(createAUser.fulfilled, (state, action) => {
                state.isFetching = false;
                if (action.payload?.data) state.data.push(action.payload.data);
            })

            // getUsersWithPagination
            .addCase(getUsersWithPagination.pending, (state) => { state.isFetching = true; })
            .addCase(getUsersWithPagination.rejected, (state) => { state.isFetching = false; })
            .addCase(getUsersWithPagination.fulfilled, (state, action) => {
                state.isFetching = false;
                if (action.payload?.data) state.data = action.payload.data;
                if (action.payload?.pagination) state.pagination = action.payload.pagination;
            })

            // getUserById
            .addCase(getUserById.pending, (state) => { state.isFetching = true; state.selectedUser = null; })
            .addCase(getUserById.rejected, (state) => { state.isFetching = false; state.selectedUser = null; })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.isFetching = false;
                state.selectedUser = action.payload.data || null;
            })

            // updateAUser
            .addCase(updateAUser.pending, (state) => { state.isFetching = true; })
            .addCase(updateAUser.rejected, (state) => { state.isFetching = false; })
            .addCase(updateAUser.fulfilled, (state, action) => {
                state.isFetching = false;
                const updatedUser = action.payload.data;
                if (updatedUser) {
                    const index = state.data.findIndex(u => u.id === updatedUser.id);
                    if (index !== -1) state.data[index] = updatedUser;
                    if (state.selectedUser?.id === updatedUser.id) state.selectedUser = updatedUser;
                }
            });
    }
});

export default userSlice.reducer;
