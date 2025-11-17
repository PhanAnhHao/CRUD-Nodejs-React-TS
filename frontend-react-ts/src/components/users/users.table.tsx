import { useEffect, useState } from 'react';
import { Button, message, Space, Table, Upload } from 'antd';
import type { TableProps } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../redux/store';
import { deleteAUser, getAllUsers, getUsersWithPagination } from '../../redux/slices/users.slice';
import { Link } from 'react-router-dom';
import { base64ToUrl } from '../../utils/convert.base64';
import DetailUser from './user.detail';

export interface IUser {
    id: number;
    email: string;
    fullName: string;
    address: string;
    phone: string;
    avatar: string;
    role: IRole | null;
    roleId: number;
}

export interface IRole {
    id: number;
    name: string;
    description: string;
}

const UsersTable = () => {

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
            render: (avatar) =>
                avatar ? (
                    <Upload
                        listType="picture-card"
                        fileList={[
                            {
                                uid: '-1',
                                name: 'avatar.jpg',
                                url: base64ToUrl(avatar),
                            },
                        ]}
                        showUploadList={true}
                        disabled
                    />
                ) : (
                    'N/A'
                ),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => {
                if (!role) return 'N/A';
                // nếu role là object
                if (typeof role === 'object') return role.name || JSON.stringify(role);
                // nếu role là string
                return role;
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <Space size="middle">
                    <Button style={{ backgroundColor: 'yellow' }}>
                        <Link to={`/user/update/${record.id}`}>Edit</Link>
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
    const { data, isFetching, pagination } = useSelector((state: RootState) => state.user);

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IUser | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(pagination.currentPage);
    const [pageSize, setPageSize] = useState<number>(pagination.pageSize);

    useEffect(() => {
        dispatch(getUsersWithPagination({ current: currentPage, pageSize }));
    }, [dispatch, currentPage, pageSize]);

    const handleOnChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        if (pageSize) setPageSize(pageSize);
    };

    const handleDelete = async (id: number) => {
        try {
            await dispatch(deleteAUser(id)).unwrap();
            dispatch(getAllUsers()); // load lại danh sách
            message.success("User deleted successfully!");
        } catch (error) {
            message.error("Failed to delete user!");
            console.log(error);
        }
    };


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
                    <Link to="/user/create">Create new user</Link>
                </Button>
            </div>
            <Table<IUser>
                columns={columns}
                dataSource={data}
                loading={isFetching}
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

            <DetailUser
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
        </>
    );
};

export default UsersTable;
