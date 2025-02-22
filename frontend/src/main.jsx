//import { StrictMode } from 'react'
import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css";
import { Route,RouterProvider,createRoutesFromElements } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store.js';

//Private Route
import PrivateRoutes from './components/PrivateRoutes.jsx';

//Auth
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import Profile from './pages/User/Profile.jsx';

import AdminRoute from './pages/Admin/AdminRoute.jsx';
import UserList from './pages/Admin/UserList.jsx';
import CategoryList from './pages/Admin/CategoryList.jsx';
import ProductList from './pages/Admin/ProductList.jsx';
import AllProducts from './pages/Admin/AllProducts.jsx';
import ProductUpdate from './pages/Admin/ProductUpdate.jsx';
import Home from './pages/Home.jsx';

import Favorites from './pages/Products/Favorites.jsx';
import ProductDetails from './pages/Products/ProductDetails.jsx';

import Cart from './pages/Cart.jsx';

const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App/>}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> 
      <Route index={true} path="/" element={<Home />} />
      <Route path='/favorite' element={<Favorites />} />
      <Route path="/product/:id" element={<ProductDetails />} /> 
      <Route path="/cart" element={<Cart />} />

      <Route path="" element={<PrivateRoutes />} >
        <Route path='/profile' element={<Profile />} />
      </Route>

      {/* admin route */}
      <Route path="/admin" element={<AdminRoute />}>
          <Route path="userlist" element={<UserList />} />
          <Route path="categorylist" element={<CategoryList />} /> 
          <Route path='productlist' element={<ProductList />} />
          <Route path="allproductslist" element={<AllProducts />} />
          <Route path="product/update/:_id" element={<ProductUpdate />} />
      </Route>



    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>,
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  
);
