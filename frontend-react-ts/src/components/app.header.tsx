import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

export const routes = [
    { path: '/', label: 'Home' },
    { path: '/user', label: 'User' },
    { path: '/product', label: 'Product' },
    { path: '/order', label: 'Order' },
];

const { Header } = Layout;

const AppHeader = () => {
    const location = useLocation();

    const selectedKey =
        routes.find(r => r.path === location.pathname)?.path ||
        routes.find(r => location.pathname.startsWith(r.path))?.path;

    const menuItems = routes.map(route => ({
        key: route.path,
        label: <Link to={route.path}>{route.label}</Link>,
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
