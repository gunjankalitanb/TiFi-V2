import React from "react";
import { createRoot } from "react-dom/client";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import reportWebVitals from "./reportWebVitals";

import Home from "./pages/Home.js";
import About from "./pages/About.js";
import Contact from "./pages/Contact.js";
import Footer from "./pages/Footer.js";
import Menu from "./pages/Menu.js";
import Navbar from "./pages/Navbar.js";
import Register from "./pages/Auth/Register.js";
import Login from "./pages/Auth/Login.js";
import { AuthProvider } from "./context/auth";
import { SearchProvider } from "./context/search";
import "./pages/Styles.css";
import Pagenotfound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/user/Dashboard";
import Policy from "./pages/Policy";
import PrivateRoute from "./pages/routes/Private";
import AdminRoute from "./pages/routes/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import Users from "./pages/Admin/Users";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import "antd/dist/reset.css";
import Items from "./pages/Admin/Items";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import Search from "./pages/Search";
import Categories from "./pages/Categories";
import CategoryItem from "./pages/CategoryItem";
import { CartProvider } from "./context/cart";
import CartPage from "./pages/CartPage";
import PaymentPage from "./pages/PaymentPage";
import AdminOrders from "./pages/Admin/AdminOrders";
import PaymentForm from "./pages/PaymentForm.js";
import ForgotPassword from "./pages/ForgotPassword";
const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <SearchProvider>
        <CartProvider>
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/category/:slug" element={<CategoryItem />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/menu" element={<Menu />} />
            {/* <Route path="/cartpage" element={<CartPage />} /> */}
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/footer" element={<Footer />} />

            <Route path="/dashboard" element={<PrivateRoute />}>
              <Route path="user" element={<Dashboard />} />
              <Route path="user/orders" element={<Orders />} />
              <Route path="user/cartpage" element={<CartPage />} />
              <Route path="user/profile" element={<Profile />} />
            </Route>

            <Route path="/dashboard" element={<AdminRoute />}>
              <Route path="admin" element={<AdminDashboard />} />
              <Route
                path="admin/create-category"
                element={<CreateCategory />}
              />
              <Route path="admin/create-product" element={<CreateProduct />} />
              <Route path="admin/items/:slug" element={<UpdateProduct />} />
              <Route path="admin/items" element={<Items />} />
              <Route path="admin/users" element={<Users />} />
              <Route path="admin/orders" element={<AdminOrders />} />
            </Route>
            <Route path="/pform" element={<PaymentForm />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot" element={<ForgotPassword />} />

            <Route path="/policy" element={<Policy />} />
            <Route path="*" element={<Pagenotfound />} />
            {/* <Route path="/Signup" element={<Signup />} /> */}
          </Routes>
          <Toaster />
          <Footer />
        </CartProvider>
      </SearchProvider>
    </AuthProvider>
  </BrowserRouter>
);

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <RouterProvider router={router}/>
//   </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
