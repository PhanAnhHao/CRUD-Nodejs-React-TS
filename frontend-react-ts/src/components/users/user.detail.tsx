import { Avatar, Badge, Descriptions, Drawer } from "antd";
import { IUser } from "./users.table";
import { base64ToUrl } from "../../utils/convert.base64";
import dayjs from "dayjs";
import { FORMATE_DATE_VN } from "../../utils/dayjs";

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IUser | null;
    setDataViewDetail: (v: IUser | null) => void;
}
const DetailUser = (props: IProps) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
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
                    <Descriptions.Item label="Id">{dataViewDetail?.id}</Descriptions.Item>
                    <Descriptions.Item label="Tên hiển thị">{dataViewDetail?.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataViewDetail?.email}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{dataViewDetail?.phone}</Descriptions.Item>

                    <Descriptions.Item label="Role">
                        <Badge
                            status="processing"
                            text={dataViewDetail?.role?.name || "N/A"}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label="Avatar">
                        <Avatar
                            size={40}
                            src={dataViewDetail?.avatar ? base64ToUrl(dataViewDetail.avatar) : undefined}
                        >
                            {!dataViewDetail?.avatar && dataViewDetail?.fullName
                                ? dataViewDetail.fullName.charAt(0).toUpperCase()
                                : null}
                        </Avatar>
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {dayjs(dataViewDetail?.updatedAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}
export default DetailUser;