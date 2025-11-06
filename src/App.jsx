import { Routes, Route } from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import ProductForm from "./pages/admin/ProductForm";
import ProductEdit from "./pages/admin/ProductEdit";
import TransactionManagement from "./pages/admin/TransactionManagement";
import TransactionDetail from "./pages/admin/TransactionDetail";
import MemberManagement from "./pages/admin/MemberManagement";
import MemberForm from "./pages/admin/MemberForm";
import TransactionRecap from "./pages/admin/TransactionRecap";

// User Pages
import Home from "./pages/user/Home";
import About from "./pages/user/About";
import Checkout from "./pages/user/Checkout";
import ProductDetail from "./pages/user/ProductDetail";
import TransactionForm from "./pages/admin/TransactionForm";

export default function App() {
  return (
    <Routes>
      {/* USER ROUTES */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="product/:id" element={<ProductDetail />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        {/* allow /admin/products to show the Dashboard (product management) */}
        <Route path="products" element={<Dashboard />} />
        <Route path="add-product" element={<ProductForm />} />
        <Route path="edit-product/:id" element={<ProductEdit />} />

        {/* Transaction Management */}
        <Route path="add-transaction" element={<TransactionForm />} />
        <Route path="transactions" element={<TransactionManagement />} />
        <Route path="transaction/:id" element={<TransactionDetail />} />
        <Route path="recap" element={<TransactionRecap />} />

        {/* Member Management */}
        <Route path="add-member" element={<MemberForm />} />
        <Route path="members" element={<MemberManagement />} />
        <Route path="member/:id" element={<div>Member Detail - Coming Soon</div>} />
      </Route>

      {/* Catch-all route for 404 */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}