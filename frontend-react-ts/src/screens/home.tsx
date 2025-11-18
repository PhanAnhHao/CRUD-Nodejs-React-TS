import { Layout, Card, Row, Col, Statistic } from "antd";
import { UserOutlined, ShoppingOutlined, ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons';
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import CountUp from "react-countup";

const { Header, Content } = Layout;

const revenueData = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3200 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 4200 },
];

const orderStatusData = [
    { name: "Completed", value: 65 },
    { name: "Pending", value: 20 },
    { name: "Cancelled", value: 15 },
];

const COLORS = ["#0088FE", "#FFBB28", "#FF8042"];

const HomePage = () => {

    const formatter = (value: string | number) => (
        <CountUp end={+value} duration={1.2} separator="," />
    );

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Layout>
                <Header style={{ background: "#fff", padding: 0 }}>
                    <h2 style={{ marginLeft: 20 }}>Admin Dashboard</h2>
                </Header>

                <Content style={{ margin: "24px 16px 0" }}>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Total Users"
                                    value={1240}
                                    prefix={<UserOutlined />}
                                    valueStyle={{ color: "#3f8600" }}
                                    formatter={formatter}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Total Products"
                                    value={320}
                                    prefix={<ShoppingOutlined />}
                                    valueStyle={{ color: "#1890ff" }}
                                    formatter={formatter}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Orders This Month"
                                    value={142}
                                    prefix={<ShoppingCartOutlined />}
                                    valueStyle={{ color: '#cf1322' }}
                                    formatter={formatter}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Revenue"
                                    value={12340}
                                    prefix={<DollarOutlined />}
                                    valueStyle={{ color: "#faad14" }}
                                    formatter={(value) => (
                                        <>
                                            ₫
                                            <CountUp
                                                end={Number(value)}
                                                separator="."
                                                decimal=","
                                                duration={1.5}
                                                decimals={0}
                                            />
                                        </>
                                    )}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginTop: 20 }}>
                        <Col span={12}>
                            <Card title="Revenue Over Time">
                                <LineChart width={500} height={300} data={revenueData}>
                                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                                    <CartesianGrid stroke="#ccc" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                </LineChart>
                                <p style={{ margin: "10px 20px", fontSize: 14, textAlign: "center" }}>
                                    This chart shows the monthly revenue trend over time.
                                </p>
                                <p style={{ margin: "0 20px", fontSize: 13 }}>
                                    <span style={{ color: COLORS[0], fontSize: 16 }}>• Blue line:</span> Revenue over months
                                </p>
                            </Card>
                        </Col>


                        <Col span={12}>
                            <Card title="Order Status Breakdown">
                                <PieChart width={400} height={300}>
                                    <Pie
                                        data={orderStatusData}
                                        cx={200}
                                        cy={150}
                                        outerRadius={100}
                                        label
                                        dataKey="value"
                                    >
                                        {orderStatusData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                                <p style={{ margin: "10px 20px", fontSize: 14, textAlign: "center" }}>
                                    This chart displays the distribution of order statuses.
                                </p>
                                <div style={{ margin: "5px 20px", fontSize: 13 }}>
                                    <span style={{ color: COLORS[0], fontSize: 16 }}>●</span> Completed &nbsp;&nbsp;
                                    <span style={{ color: COLORS[1], fontSize: 16 }}>●</span> Pending &nbsp;&nbsp;
                                    <span style={{ color: COLORS[2], fontSize: 16 }}>●</span> Cancelled
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </Layout >
    );
};

export default HomePage;