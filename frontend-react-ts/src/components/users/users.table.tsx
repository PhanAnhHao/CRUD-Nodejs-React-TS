import { useEffect } from 'react';
import { Button, Space, Table } from 'antd';
import type { TableProps } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../redux/store';
import { getAllUsers } from '../../redux/slices/users.slice';

export interface IUser {
    id: number;
    email: string;
    fullName: string;
    address: string;
    phone: string;
    avatar: string;
    role: string;
}

const columns: TableProps<IUser>['columns'] = [
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
        render: (text) => <h4>{text}</h4>,
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Full Name',
        dataIndex: 'fullName',
        key: 'fullName',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: 'Avatar',
        dataIndex: 'avatar',
        key: 'avatar',
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        render: (role) => role ? role.name : 'N/A'
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <Button style={{ backgroundColor: 'yellow' }}>Edit</Button>
                <Button style={{ backgroundColor: 'red', color: '#fff' }}>Delete</Button>
            </Space>
        ),
    },
];

const UsersTable = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { data, isFetching } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    return (
        <Table<IUser>
            columns={columns}
            dataSource={data}
            loading={isFetching}
            rowKey="id"
            pagination={false}
        />
    );
};

export default UsersTable;
