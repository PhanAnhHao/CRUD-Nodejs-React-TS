import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllUsersApi } from '../../services/apis/user.api';
import { IUser } from '../../components/users/users.table';
import { IBackendRes, IPagination } from '../../types/backend';

interface IState {
    isFetching: boolean;
    pagination: IPagination;
    data: IUser[];
}

// ✅ Dùng generic type cho thunk
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
            .addCase(getAllUsers.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(getAllUsers.rejected, (state) => {
                state.isFetching = false;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isFetching = false;

                if (action.payload.data) {
                    state.data = action.payload.data;
                }
                if (action.payload.pagination) {
                    state.pagination = action.payload.pagination;
                }
            });
    },
});

export default userSlice.reducer;
