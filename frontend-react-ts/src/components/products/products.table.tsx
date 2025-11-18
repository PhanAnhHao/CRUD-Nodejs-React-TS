import { useEffect, useState } from 'react';
import { Button, message, Space, Table, Image } from 'antd';
import type { TableProps } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../redux/store';
import { deleteAProduct, getAllProducts, getProductsWithPagination } from '../../redux/slices/products.slice';
import { Link } from 'react-router-dom';
import DetailProduct from './product.detail';
import ProductsTableLoader from './loader/products.table.loader';

export interface IProductImage {
    id: number;
    imageUrl: string;
    isPrimary: boolean;
    productId: number;
    createdAt: string;
    updatedAt: string;
}

export interface IProduct {
    id: number;
    name: string;
    price: number;
    description: string;
    quantity: number;
    sold: number;
    factory: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    images: IProductImage[];
}

const ProductsTable = () => {

    const columns: TableProps<IProduct>['columns'] = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <h4>{text}</h4>,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render(value, record) {
                return (
                    <a
                        onClick={() => {
                            setDataViewDetail(record);
                            setOpenViewDetail(true);
                        }}
                        href="#"
                    >{value}</a>
                )
            },
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `${price.toLocaleString('vi-VN')} ₫`,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Sold',
            dataIndex: 'sold',
            key: 'sold',
        },
        {
            title: 'Factory',
            dataIndex: 'factory',
            key: 'factory',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Images',
            dataIndex: 'images',
            key: 'images',
            render: (images: IProductImage[]) => {
                const primaryImage = images?.find(img => img.isPrimary) || images?.[0];
                return primaryImage ? (
                    <Image
                        width={80}
                        height={80}
                        src={primaryImage.imageUrl}
                        alt="Product"
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    'N/A'
                );
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <Space size="middle">
                    <Button style={{ backgroundColor: 'yellow' }}>
                        <Link to={`/product/update/${record.id}`}>Edit</Link>
                    </Button>
                    <Button
                        style={{ backgroundColor: 'red', color: '#fff' }}
                        onClick={() => handleDelete(record.id)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const dispatch = useDispatch<AppDispatch>();
    const { data, isFetching, pagination } = useSelector((state: RootState) => state.product);

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IProduct | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(pagination.currentPage);
    const [pageSize, setPageSize] = useState<number>(pagination.pageSize);

    useEffect(() => {
        dispatch(getProductsWithPagination({ current: currentPage, pageSize }));
    }, [dispatch, currentPage, pageSize]);

    const handleOnChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        if (pageSize) setPageSize(pageSize);
    };

    const handleDelete = async (id: number) => {
        try {
            await dispatch(deleteAProduct(id)).unwrap();
            dispatch(getAllProducts());
            message.success("Product deleted successfully!");
        } catch (error) {
            message.error("Failed to delete product!");
            console.log(error);
        }
    };

    if (isFetching) {
        return <ProductsTableLoader />;
    }

    return (
        <>
            <div
                style={{
                    marginBottom: 16,
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                <Button type="primary">
                    <Link to="/product/create">Create new product</Link>
                </Button>
            </div>
            <Table<IProduct>
                columns={columns}
                dataSource={data}
                rowKey="id"
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: pagination.totalItems,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    onChange: handleOnChange,
                    showSizeChanger: true,
                }}
            />

            <DetailProduct
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
        </>
    );
};

export default ProductsTable;