import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LayoutApp from './layout.app';
import HomePage from './screens/home';
import UsersPage from './screens/users';
import ProductsPage from './screens/products';
import OrdersPage from './screens/orders';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutApp />}>
          <Route index element={<HomePage />} />
          <Route path="user" element={<UsersPage />} />
          <Route path="product" element={<ProductsPage />} />
          <Route path="order" element={<OrdersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
