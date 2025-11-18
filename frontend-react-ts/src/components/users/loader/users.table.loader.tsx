import { Skeleton, Table } from 'antd';
import type { TableProps } from 'antd';

interface ISkeletonUser {
    key: string;
}

const UsersTableLoader = () => {
    const columns: TableProps<ISkeletonUser>['columns'] = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            render: () => <Skeleton.Input active size="small" style={{ width: 50 }} />,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: () => <Skeleton.Input active size="small" style={{ width: 200 }} />,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: () => <Skeleton.Input active size="small" style={{ width: 150 }} />,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: () => <Skeleton.Input active size="small" style={{ width: 80 }} />,
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: () => <Skeleton.Avatar active size={50} shape="circle" />,
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
    const skeletonData: ISkeletonUser[] = Array.from({ length: 5 }, (_, index) => ({
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
            <Table<ISkeletonUser>
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

export default UsersTableLoader;