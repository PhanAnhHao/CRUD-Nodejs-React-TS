import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LayoutApp from './layout.app';
import HomePage from './screens/home';
import UsersPage from './screens/users';
import CreateUserPage from './components/users/create.user';
import ProductsPage from './screens/products';
import OrdersPage from './screens/orders';
import './App.css'
import UpdateUserPage from './components/users/updata.user';
import CreateProductPage from './components/products/create.product';
import UpdateProductPage from './components/products/update.product';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutApp />}>
          <Route index element={<HomePage />} />
          <Route path="user" element={<UsersPage />} />
          <Route path="user/create" element={<CreateUserPage />} />
          <Route path="user/update/:id" element={<UpdateUserPage />} />
          <Route path="product" element={<ProductsPage />} />
          <Route path="product/create" element={<CreateProductPage />} />
          <Route path="product/update/:id" element={<UpdateProductPage />} />
          <Route path="order" element={<OrdersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
