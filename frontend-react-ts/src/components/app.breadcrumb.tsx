import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { routes } from './app.header';

const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const AppBreadcrumb = () => {
    const location = useLocation();
    const pathSnippets = location.pathname.split('/').filter(i => i);

    const breadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        const route = routes.find(r => r.path === url);
        return {
            key: url,
            title: (
                <Link to={url}>
                    {route?.label || capitalizeFirstLetter(pathSnippets[index])}
                </Link>
            ),
        };
    });

    if (breadcrumbItems.length === 0) {
        breadcrumbItems.push({ key: '/', title: <Link to="/">Home</Link> });
    } else {
        breadcrumbItems.unshift({ key: '/', title: <Link to="/">Home</Link> });
    }

    return <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />;
};

export default AppBreadcrumb;
