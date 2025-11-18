import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Radio, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../redux/store';
import { getAllUsers, getUserById, updateAUser } from '../../redux/slices/users.slice';
import { getBase64 } from '../../utils/convert.base64';

const UpdateUserPage = () => {
    const { id } = useParams(); // Lấy id từ URL
    const dispatch = useDispatch<AppDispatch>();
    const { selectedUser, isFetching } = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();
    const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
    const [form] = Form.useForm();

    // Lấy dữ liệu user theo id khi load page
    useEffect(() => {
        if (id) {
            dispatch(getUserById(+id));
        }
    }, [dispatch, id]);

    // Set dữ liệu vào form khi selectedUser thay đổi
    useEffect(() => {
        if (selectedUser) {
            form.setFieldsValue({
                email: selectedUser.email,
                fullName: selectedUser.fullName,
                address: selectedUser.address,
                phone: selectedUser.phone,
                roleId: Number(selectedUser.roleId),
            });

            // Nếu user có avatar → set base64
            // Nếu KHÔNG có avatar → xóa avatar cũ
            setAvatarBase64(selectedUser.avatar ?? null);
        }
    }, [selectedUser, form]);

    // Handle submit form
    const onFinish = async (values: any) => {
        if (!selectedUser?.id) return;

        const payload = {
            id: selectedUser.id,
            data: {
                ...values,
                avatar: avatarBase64,
            },
        };

        try {
            await dispatch(updateAUser(payload)).unwrap();
            dispatch(getAllUsers());
            form.resetFields();
            message.success('User updated successfully!');
            navigate('/user');
        } catch (error) {
            console.log(error);
            message.error('Failed to update user!');
        }
    };


    const handleBeforeUpload = async (file: File) => {
        if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
            message.error('You can only upload JPG/PNG file!');
            return Upload.LIST_IGNORE;
        }
        if (file.size / 1024 / 1024 > 3) {
            message.error('Image must smaller than 3MB!');
            return Upload.LIST_IGNORE;
        }
        const base64 = await getBase64(file);
        setAvatarBase64(base64);
        return false; // ngăn upload tự động
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: "50%" }}>
                <h1 style={{ marginBottom: 16, color: "#1677ff" }}>Update a user</h1>
                <Form
                    form={form}
                    name="updateUser"
                    onFinish={onFinish}
                    onFinishFailed={(err) => console.log(err)}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Invalid email!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                    >
                        <Input.Password disabled />
                    </Form.Item>

                    <Form.Item
                        label="Full Name"
                        name="fullName"
                        rules={[{ required: true, message: 'Please input your full name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Please input your address!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Please input your phone!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Upload Avatar">
                        <Upload
                            listType="picture-card"
                            beforeUpload={handleBeforeUpload}
                            fileList={
                                avatarBase64
                                    ? [
                                        {
                                            uid: '-1',
                                            name: 'avatar.jpg',
                                            url: avatarBase64, // base64 URL
                                        },
                                    ]
                                    : []
                            }
                            showUploadList={{ showPreviewIcon: true }}
                        >
                            {avatarBase64 ? null : (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Role"
                        name="roleId"
                        rules={[{ required: true, message: 'Please select a role!' }]}
                    >
                        <Radio.Group>
                            <Radio value={1}>Admin</Radio>
                            <Radio value={2}>User</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button style={{ marginRight: 16 }}>
                            <Link to="/user">Back</Link>
                        </Button>
                        <Button type="primary" htmlType="submit" loading={isFetching}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default UpdateUserPage;
