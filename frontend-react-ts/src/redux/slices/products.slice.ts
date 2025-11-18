import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteAProductApi, getAllProductsApi, getProductByIdApi, getProductsWithPaginationApi, postCreateAProductApi, putUpdateAProductApi } from '../../services/apis/product.api';
import { IProduct } from '../../components/products/products.table';
import { IBackendRes, IPagination } from '../../types/backend';
import { IProductPayload } from '../../components/products/create.product';

interface IState {
    isFetching: boolean;
    pagination: IPagination;
    data: IProduct[];
    selectedProduct: IProduct | null; // để lưu getProductById
}

export const getAllProducts = createAsyncThunk<
    IBackendRes<IProduct[]>,
    void
>(
    'product/getAllProducts',
    async () => {
        const response = await getAllProductsApi();
        return response;
    }
);

export const createAProduct = createAsyncThunk<
    IBackendRes<IProduct>,
    IProductPayload
>(
    'product/createAProduct',
    async (data: IProductPayload) => {
        const response = await postCreateAProductApi(data);
        return response;
    }
);

export const getProductsWithPagination = createAsyncThunk<
    IBackendRes<IProduct[]>,
    { current: number; pageSize: number }
>(
    'product/getProductsWithPagination',
    async ({ current, pageSize }) => {
        const response = await getProductsWithPaginationApi(current, pageSize);
        return response;
    }
);

export const getProductById = createAsyncThunk<IBackendRes<IProduct>, number>(
    'product/getProductById',
    async (id: number) => {
        const response = await getProductByIdApi(id);
        return response;
    }
);

export const updateAProduct = createAsyncThunk<
    IBackendRes<IProduct>,
    { id: number; data: IProductPayload }
>(
    'product/updateAProduct',
    async ({ id, data }) => {
        const response = await putUpdateAProductApi(id, data);
        return response;
    }
);

export const deleteAProduct = createAsyncThunk<IBackendRes<null>, number>(
    'product/deleteAProduct',
    async (id: number) => {
        const response = await deleteAProductApi(id);
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
    selectedProduct: null,
};

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // getAllProducts
            .addCase(getAllProducts.pending, (state) => { state.isFetching = true; })
            .addCase(getAllProducts.rejected, (state) => { state.isFetching = false; })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.isFetching = false;
                if (action.payload?.data) state.data = action.payload.data;
                if (action.payload?.pagination) state.pagination = action.payload.pagination;
            })

            // createAProduct
            .addCase(createAProduct.pending, (state) => { state.isFetching = true; })
            .addCase(createAProduct.rejected, (state) => { state.isFetching = false; })
            .addCase(createAProduct.fulfilled, (state, action) => {
                state.isFetching = false;
                if (action.payload?.data) state.data.push(action.payload.data);
            })

            // getProductsWithPagination
            .addCase(getProductsWithPagination.pending, (state) => { state.isFetching = true; })
            .addCase(getProductsWithPagination.rejected, (state) => { state.isFetching = false; })
            .addCase(getProductsWithPagination.fulfilled, (state, action) => {
                state.isFetching = false;
                if (action.payload?.data) state.data = action.payload.data;
                if (action.payload?.pagination) state.pagination = action.payload.pagination;
            })

            // getProductById
            .addCase(getProductById.pending, (state) => { state.isFetching = true; state.selectedProduct = null; })
            .addCase(getProductById.rejected, (state) => { state.isFetching = false; state.selectedProduct = null; })
            .addCase(getProductById.fulfilled, (state, action) => {
                state.isFetching = false;
                state.selectedProduct = action.payload.data || null;
            })

            // updateAProduct
            .addCase(updateAProduct.pending, (state) => { state.isFetching = true; })
            .addCase(updateAProduct.rejected, (state) => { state.isFetching = false; })
            .addCase(updateAProduct.fulfilled, (state, action) => {
                state.isFetching = false;
                const updatedProduct = action.payload.data;
                if (updatedProduct) {
                    const index = state.data.findIndex(p => p.id === updatedProduct.id);
                    if (index !== -1) state.data[index] = updatedProduct;
                    if (state.selectedProduct?.id === updatedProduct.id) state.selectedProduct = updatedProduct;
                }
            })

            // deleteAProduct
            .addCase(deleteAProduct.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(deleteAProduct.rejected, (state) => {
                state.isFetching = false;
            })
            .addCase(deleteAProduct.fulfilled, (state, action) => {
                state.isFetching = false;

                const deletedId = action.meta.arg; // id gửi vào thunk

                // Xóa product trong list data
                state.data = state.data.filter(p => p.id !== deletedId);

                // Nếu product đang xem là product bị xóa → clear selectedProduct
                if (state.selectedProduct?.id === deletedId) {
                    state.selectedProduct = null;
                }
            });
    }
});

export default productSlice.reducer;