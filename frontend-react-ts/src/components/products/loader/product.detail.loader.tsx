import { Descriptions, Drawer, Skeleton } from "antd";

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
}

const DetailProductLoader = (props: IProps) => {
    const { openViewDetail, setOpenViewDetail } = props;

    const onClose = () => {
        setOpenViewDetail(false);
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
                    <Descriptions.Item label="Id">
                        <Skeleton.Input active size="small" style={{ width: 50 }} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên sản phẩm">
                        <Skeleton.Input active size="small" style={{ width: 200 }} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Giá">
                        <Skeleton.Input active size="small" style={{ width: 150 }} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Số lượng">
                        <Skeleton.Input active size="small" style={{ width: 80 }} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Đã bán">
                        <Skeleton.Input active size="small" style={{ width: 80 }} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Nhà máy">
                        <Skeleton.Input active size="small" style={{ width: 120 }} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Danh mục" span={2}>
                        <Skeleton.Input active size="small" style={{ width: 150 }} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Mô tả" span={2}>
                        <Skeleton paragraph={{ rows: 3 }} active />
                    </Descriptions.Item>
                    <Descriptions.Item label="Hình ảnh" span={2}>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <Skeleton.Image active style={{ width: 150, height: 150 }} />
                            <Skeleton.Image active style={{ width: 150, height: 150 }} />
                            <Skeleton.Image active style={{ width: 150, height: 150 }} />
                        </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        <Skeleton.Input active size="small" style={{ width: 180 }} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        <Skeleton.Input active size="small" style={{ width: 180 }} />
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}

export default DetailProductLoader;