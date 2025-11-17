import { Button, Form, Input, message, Radio, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { getBase64 } from '../../utils/convert.base64';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { createAUser, getAllUsers } from '../../redux/slices/users.slice';
import { useNavigate } from 'react-router-dom';

const CreateUserPage = () => {

    const dispatch = useDispatch<AppDispatch>();
    const { isFetching } = useSelector((state: RootState) => state.user);

    const navigate = useNavigate();

    const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

    const onFinish = async (values: any) => {
        const payload = { ...values, avatar: avatarBase64 }; // gộp avatar vào form data
        console.log('Submit payload:', payload);

        try {
            const res = await dispatch(createAUser(payload)).unwrap();
            console.log('User created:', res);
            // Sau khi tạo xong, có thể reload danh sách
            dispatch(getAllUsers());
            message.success('User created successfully!');
            navigate('/user');
        } catch (error) {
            console.log('Failed to create user:', error);
            message.error('Failed to create user!');
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
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
        return false; // false để ngăn upload tự động
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div style={{
                width: "50%"
            }}>
                <h1
                    style={{
                        marginBottom: 16,
                        color: "#1677ff"
                    }}
                >Create a new user</h1>
                <Form
                    name="basic"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'invalid email!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
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
                        rules={[{ required: true, message: 'Please input your full address!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Please input your full phone!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Upload Avatar">
                        <Upload
                            listType="picture-card"
                            beforeUpload={handleBeforeUpload}
                            fileList={avatarBase64 ? [{ uid: '-1', name: 'avatar.jpg', url: avatarBase64 }] : []} // <-- use fileList
                            showUploadList={{ showPreviewIcon: true }} // optional
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
                        <Button type="primary" htmlType="submit" loading={isFetching}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default CreateUserPage;