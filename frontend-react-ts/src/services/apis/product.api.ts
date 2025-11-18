import axios from "axios";
import { IBackendRes } from "../../types/backend";
import { IProduct } from "../../components/products/products.table";
import { IProductPayload } from "../../components/products/create.product";

export const getAllProductsApi = async () => {
    const res = await axios.get<IBackendRes<IProduct[]>>('http://localhost:8080/products/all');
    return res.data;
};

export const postCreateAProductApi = async (data: IProductPayload) => {
    const res = await axios.post<IBackendRes<IProduct>>(
        'http://localhost:8080/products',
        data
    );
    return res.data;
};

export const getProductsWithPaginationApi = async (current: number, pageSize: number) => {
    const res = await axios.get<IBackendRes<IProduct[]>>(`http://localhost:8080/products?current=${current}&pageSize=${pageSize}`,
        {
            headers: {
                delay: 3000
            }
        }
    );
    return res.data;
};

export const getProductByIdApi = async (id: number) => {
    const res = await axios.get<IBackendRes<IProduct>>(`http://localhost:8080/products/${id}`);
    return res.data;
};

export const putUpdateAProductApi = async (id: number, data: IProductPayload) => {
    const res = await axios.put<IBackendRes<IProduct>>(
        `http://localhost:8080/products/${id}`,
        data
    );
    return res.data;
};

export const deleteAProductApi = async (id: number) => {
    const res = await axios.delete<IBackendRes<null>>(`http://localhost:8080/products/${id}`);
    return res.data;
};