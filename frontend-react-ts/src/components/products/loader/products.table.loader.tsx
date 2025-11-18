import { Skeleton, Table } from 'antd';
import type { TableProps } from 'antd';

interface ISkeletonProduct {
    key: string;
}

const ProductsTableLoader = () => {
    const columns: TableProps<ISkeletonProduct>['columns'] = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            render: () => <Skeleton.Input active size="small" style={{ width: 50 }} />,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: () => <Skeleton.Input active size="small" style={{ width: 150 }} />,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: () => <Skeleton.Input active size="small" style={{ width: 100 }} />,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: () => <Skeleton.Input active size="small" style={{ width: 60 }} />,
        },
        {
            title: 'Sold',
            dataIndex: 'sold',
            key: 'sold',
            render: () => <Skeleton.Input active size="small" style={{ width: 60 }} />,
        },
        {
            title: 'Factory',
            dataIndex: 'factory',
            key: 'factory',
            render: () => <Skeleton.Input active size="small" style={{ width: 100 }} />,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: () => <Skeleton.Input active size="small" style={{ width: 100 }} />,
        },
        {
            title: 'Images',
            dataIndex: 'images',
            key: 'images',
            render: () => <Skeleton.Image active style={{ width: 80, height: 80 }} />,
        },
        {
            title: 'Action',
            key: 'action',
            render: () => (
                <div style={{ display: 'flex', gap: 8 }}>
                    <Skeleton.Button active size="small" style={{ width: 60 }} />
                    <Skeleton.Button active size="small" style={{ width: 60 }} />
                </div>
            ),
        },
    ];

    // Tạo data giả để hiển thị skeleton
    const skeletonData: ISkeletonProduct[] = Array.from({ length: 5 }, (_, index) => ({
        key: `skeleton-${index}`,
    }));

    return (
        <>
            <div
                style={{
                    marginBottom: 16,
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                <Skeleton.Button active style={{ width: 150 }} />
            </div>
            <Table<ISkeletonProduct>
                columns={columns}
                dataSource={skeletonData}
                pagination={{
                    current: 1,
                    pageSize: 5,
                    total: 5,
                    showTotal: () => <Skeleton.Input active size="small" style={{ width: 100 }} />,
                }}
                rowKey="key"
            />
        </>
    );
};

export default ProductsTableLoader;