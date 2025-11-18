import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, message, Select, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../redux/store';
import { getAllProducts, getProductById, updateAProduct } from '../../redux/slices/products.slice';
import { getBase64 } from '../../utils/convert.base64';
import type { UploadFile } from 'antd';

const FACTORIES = ['ASUS', 'DELL', 'LENOVO', 'APPLE', 'LG', 'ACER'];
const CATEGORIES = ['Điện thoại', 'Laptop', 'Tai nghe', 'Dây chuyển đổi', 'Chuột', 'Bàn phím', 'Loa'];

const UpdateProductPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { selectedProduct, isFetching } = useSelector((state: RootState) => state.product);
    const navigate = useNavigate();
    const [imagesList, setImagesList] = useState<string[]>([]);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [form] = Form.useForm();

    // Lấy dữ liệu product theo id khi load page
    useEffect(() => {
        if (id) {
            dispatch(getProductById(+id));
        }
    }, [dispatch, id]);

    // Set dữ liệu vào form khi selectedProduct thay đổi
    useEffect(() => {
        if (selectedProduct) {
            form.setFieldsValue({
                name: selectedProduct.name,
                description: selectedProduct.description,
                price: selectedProduct.price,
                quantity: selectedProduct.quantity,
                factory: selectedProduct.factory,
                category: selectedProduct.category,
            });

            // Convert IProductImage[] thành base64 string[]
            if (selectedProduct.images && selectedProduct.images.length > 0) {
                const base64Images = selectedProduct.images.map(img => img.imageUrl);
                setImagesList(base64Images);

                // Set fileList cho Upload component
                const uploadFileList: UploadFile[] = selectedProduct.images.map((img, index) => ({
                    uid: String(img.id || index),
                    name: `image-${index + 1}.jpg`,
                    url: img.imageUrl,
                }));
                setFileList(uploadFileList);
            } else {
                setImagesList([]);
                setFileList([]);
            }
        }
    }, [selectedProduct, form]);

    // Handle submit form
    const onFinish = async (values: any) => {
        if (!selectedProduct?.id) return;

        const payload = {
            id: selectedProduct.id,
            data: {
                name: values.name,
                description: values.description,
                price: values.price,
                quantity: values.quantity,
                factory: values.factory,
                category: values.category,
                images: imagesList,
            },
        };

        try {
            await dispatch(updateAProduct(payload)).unwrap();
            dispatch(getAllProducts());
            message.success('Product updated successfully!');
            navigate('/product');
        } catch (error) {
            console.log(error);
            message.error('Failed to update product!');
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
        setImagesList(prev => [...prev, base64]);

        return false;
    };

    const handleRemove = (file: UploadFile) => {
        const index = fileList.indexOf(file);
        if (index > -1) {
            setImagesList(prev => prev.filter((_, i) => i !== index));
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: "50%" }}>
                <h1 style={{ marginBottom: 16, color: "#1677ff" }}>Update a product</h1>
                <Form
                    form={form}
                    name="updateProduct"
                    onFinish={onFinish}
                    onFinishFailed={(err) => console.log(err)}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        label="Product Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input product name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input description!' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Please input price!' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            addonAfter="₫"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Quantity"
                        name="quantity"
                        rules={[{ required: true, message: 'Please input quantity!' }]}
                    >
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>

                    <Form.Item
                        label="Factory"
                        name="factory"
                        rules={[{ required: true, message: 'Please select factory!' }]}
                    >
                        <Select placeholder="Select a factory">
                            {FACTORIES.map(factory => (
                                <Select.Option key={factory} value={factory}>
                                    {factory}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Category"
                        name="category"
                        rules={[{ required: true, message: 'Please select category!' }]}
                    >
                        <Select placeholder="Select a category">
                            {CATEGORIES.map(category => (
                                <Select.Option key={category} value={category}>
                                    {category}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Upload Images">
                        <Upload
                            listType="picture-card"
                            beforeUpload={handleBeforeUpload}
                            fileList={fileList}
                            onChange={({ fileList }) => setFileList(fileList)}
                            onRemove={handleRemove}
                            multiple
                        >
                            {fileList.length >= 5 ? null : (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            )}
                        </Upload>
                        <span style={{ color: '#999', fontSize: '12px' }}>
                            First image will be set as primary. Maximum 5 images.
                        </span>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button style={{ marginRight: 16 }}>
                            <Link to="/product">Back</Link>
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

export default UpdateProductPage;