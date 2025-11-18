import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { HomeOutlined, UserOutlined, ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons';

export const routes = [
    { path: '/', label: 'Home', icon: <HomeOutlined /> },
    { path: '/user', label: 'User', icon: <UserOutlined /> },
    { path: '/product', label: 'Product', icon: <ShoppingOutlined /> },
    { path: '/order', label: 'Order', icon: <ShoppingCartOutlined /> },
];

const { Header } = Layout;

const AppHeader = () => {
    const location = useLocation();

    const selectedKey = routes
        .slice()
        .sort((a, b) => b.path.length - a.path.length)
        .find(r => location.pathname.startsWith(r.path))?.path || '/';

    const menuItems = routes.map(route => ({
        key: route.path,
        label: <Link to={route.path}>{route.label}</Link>,
        icon: route.icon,
    }));

    return (
        <Header style={{ display: 'flex', alignItems: 'center' }}>
            <div className="demo-logo" />
            <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[selectedKey || '/']}
                items={menuItems}
                style={{ flex: 1, minWidth: 0 }}
            />
        </Header>
    );
};

export default AppHeader;