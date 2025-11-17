import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllUsersApi, getUsersWithPaginationApi, postCreateAUserApi } from '../../services/apis/user.api';
import { IUser } from '../../components/users/users.table';
import { IBackendRes, IPagination } from '../../types/backend';

interface IState {
    isFetching: boolean;
    pagination: IPagination;
    data: IUser[];
}

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

const initialState: IState = {
    isFetching: false,
    pagination: {
        currentPage: 1,
        pageSize: 5,
        totalItems: 0,
        totalPages: 0,
    },
    data: [],
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // getAllUsers
            .addCase(getAllUsers.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(getAllUsers.rejected, (state) => {
                state.isFetching = false;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isFetching = false;

                if (action.payload?.data) {
                    state.data = action.payload.data;
                }
                if (action.payload?.pagination) {
                    state.pagination = action.payload.pagination;
                }
            })

            // createAUser
            .addCase(createAUser.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(createAUser.rejected, (state) => {
                state.isFetching = false;
            })
            .addCase(createAUser.fulfilled, (state, action) => {
                state.isFetching = false;
                if (action.payload?.data) {
                    state.data.push(action.payload.data);
                }
            });

        // getUsersWithPagination
        builder
            .addCase(getUsersWithPagination.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(getUsersWithPagination.rejected, (state) => {
                state.isFetching = false;
            })
            .addCase(getUsersWithPagination.fulfilled, (state, action) => {
                state.isFetching = false;
                if (action.payload?.data) state.data = action.payload.data;
                if (action.payload?.pagination) state.pagination = action.payload.pagination;
            });
    }
});

export default userSlice.reducer;
