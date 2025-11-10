import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AppHeader from './components/app.header';
import AppFooter from './components/app.footer';
import AppBreadcrumb from './components/app.breadcrumb';
import { theme } from 'antd';

const { Content } = Layout;

const LayoutApp = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content style={{ padding: '0 48px' }}>
        <AppBreadcrumb />
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default LayoutApp;
