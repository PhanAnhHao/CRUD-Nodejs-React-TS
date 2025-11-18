import { Badge, Descriptions, Drawer, Image } from "antd";
import { IProduct } from "./products.table";
import dayjs from 'dayjs';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import DetailProductLoader from "./loader/product.detail.loader";

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IProduct | null;
    setDataViewDetail: (v: IProduct | null) => void;
}

const DetailProduct = (props: IProps) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;
    const { isFetching } = useSelector((state: RootState) => state.product);

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    }

    if (isFetching) {
        return (
            <DetailProductLoader
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
            />
        );
    }

    return (
        <>
            <Drawer
                title="Chức năng xem chi tiết"
                width={"50vw"}
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions
                    title="Thông tin sản phẩm"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Id">{dataViewDetail?.id}</Descriptions.Item>
                    <Descriptions.Item label="Tên sản phẩm">{dataViewDetail?.name}</Descriptions.Item>
                    <Descriptions.Item label="Giá">
                        {dataViewDetail?.price.toLocaleString('vi-VN')} ₫
                    </Descriptions.Item>
                    <Descriptions.Item label="Số lượng">{dataViewDetail?.quantity}</Descriptions.Item>
                    <Descriptions.Item label="Đã bán">{dataViewDetail?.sold}</Descriptions.Item>
                    <Descriptions.Item label="Nhà máy">{dataViewDetail?.factory}</Descriptions.Item>
                    <Descriptions.Item label="Danh mục" span={2}>
                        <Badge
                            status="processing"
                            text={dataViewDetail?.category || "N/A"}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label="Mô tả" span={2}>
                        {dataViewDetail?.description}
                    </Descriptions.Item>
                    <Descriptions.Item label="Hình ảnh" span={2}>
                        {dataViewDetail?.images && dataViewDetail.images.length > 0 ? (
                            <Image.PreviewGroup>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {dataViewDetail.images.map((img) => (
                                        <div key={img.id} style={{ position: 'relative' }}>
                                            <Image
                                                width={150}
                                                height={150}
                                                src={img.imageUrl}
                                                alt="Product"
                                                style={{ objectFit: 'cover' }}
                                            />
                                            {img.isPrimary && (
                                                <Badge
                                                    count="Primary"
                                                    style={{
                                                        position: 'absolute',
                                                        top: 5,
                                                        right: 5,
                                                        backgroundColor: '#52c41a'
                                                    }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Image.PreviewGroup>
                        ) : (
                            'N/A'
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {dayjs(dataViewDetail?.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {dayjs(dataViewDetail?.updatedAt).format('DD/MM/YYYY HH:mm:ss')}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}

export default DetailProduct;