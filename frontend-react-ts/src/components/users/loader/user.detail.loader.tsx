import { Descriptions, Drawer, Skeleton } from "antd";

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
}

const DetailUserLoader = (props: IProps) => {
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
                    title="Thông tin user"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Id">
                        <Skeleton.Input active size="small" style={{ width: 50 }} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                        <Skeleton.Input active size="small" style={{ width: 200 }} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên hiển thị">
                        <Skeleton.Input active size="small" style={{ width: 150 }} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Role">
                        <Skeleton.Input active size="small" style={{ width: 100 }} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Avatar" span={2}>
                        <Skeleton.Avatar active size={100} shape="circle" />
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

export default DetailUserLoader;