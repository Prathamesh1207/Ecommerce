import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/layout/Headers/Header.js"
import Footer from "./components/layout/Footer/Footer.js"
import {BrowserRouter as Router, Routes} from "react-router-dom"
import { Route } from 'react-router-dom';
import WebFont from "webfontloader";
import Home from "./components/Home/Home.js"
import ProductDetails from "./components/Product/ProductsDetails.js"
import Products from "./components/Product/Products.js"
import Search from "./components/Product/Search.js"
import LoginSignup from "./components/user/LoginSignup";
import store from "./store"
import { loadUser } from "./actions/userAction";
import UserOptions from "./components/layout/Headers/UserOptions.js"
import { useSelector } from "react-redux";
import Profile from "./components/user/Profile.js"
import ProtectedRoute from "./components/Route/ProtectedRoute";
import UpdateProfile from "./components/user/UpdateProfile.js"
import UpdatePassword from "./components/user/UpdatePassword.js"
import ForgotPassword from "./components/user/ForgotPassword.js"
import ResetPassword from "./components/user/ResetPassword.js"
import Cart from "./components/Cart/Cart.js"
import Shipping from "./components/Cart/Shipping.js"
import ConfirmOrder from "./components/Cart/ConfirmOrder.js"
import axios from "axios";
import Payment from "./components/Cart/Payment.js"
import { Elements} from "@stripe/react-stripe-js"
import {loadStripe} from "@stripe/stripe-js"
import OrderSuccess from "./components/Cart/OrderSuccess.js"
import MyOrders from "./components/Order/MyOrders.js"
import Dashboard from "./components/Admin/Dashboard.js"
import ProductList from "./components/Admin/ProductList.js"
import NewProduct from "./components/Admin/NewProduct.js"
import UpdateProduct from "./components/Admin/UpdateProduct.js"
import OrderList from "./components/Admin/OrderList.js"
import UserLists from "./components/Admin/UserLists";
import ProductReviews from "./components/Admin/ProductReviews";
import ContactUs from "./components/user/ContactUs.js";


function App() {

  const {isAuthenticated,user} = useSelector((state)=>state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }


  useEffect(()=>{
  WebFont.load({
    google:{
      families:["Roboto" , "Droid Sans" ,"Chilanka"]
    }
  })
  store.dispatch(loadUser())
    getStripeApiKey();
},[])


window.addEventListener("contextmenu",(e)=>e.preventDefault());
  



  return (
    <Router> 
      <Header />
      {isAuthenticated && <UserOptions user={user} />}

      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/product/:id" element={<ProductDetails />} />
        <Route exact path="/products" element={<Products />}/>
        <Route path="/products/:keyword" element={<Products />}/>
        
        <Route exact path="/search" element={<Search />}/>
        <Route exact path="/contact" element={<ContactUs />}/>
        
        <Route exact path="/login" element={<LoginSignup />}/>

        { isAuthenticated && <Route exact path="/account" element={<Profile />} />} 
        { isAuthenticated && <Route exact path="/me/update" element={<UpdateProfile />} />}
        { isAuthenticated && <Route exact path="/password/update" element={<UpdatePassword />}/>}

        <Route exact path="/password/forgot" element={<ForgotPassword />} />
        <Route exact path="/password/reset/:token" element={<ResetPassword />} />
        <Route exact path="/cart" element={<Cart />} />

        {isAuthenticated && <Route exact path="/shipping" element={<Shipping />} />}
        {isAuthenticated && <Route exact path="/order/confirm" element={<ConfirmOrder />} />}


        <Route exact path="/process/payment" element={stripeApiKey && <Elements stripe={loadStripe(stripeApiKey)}> <Payment /> </Elements>} />
        {isAuthenticated && <Route exact path="/success" element={<OrderSuccess />} />}
        {isAuthenticated && <Route exact path="/orders" element={<MyOrders />} />}



        
        {isAuthenticated && <Route exact path="/admin/dashboard" element={<Dashboard />} />}
        {isAuthenticated && <Route exact path="/admin/products" element={<ProductList />}  /> }
        {isAuthenticated && <Route exact path="/admin/product" element={<NewProduct />}  /> }
        {isAuthenticated && <Route exact path="/admin/product/:id" element={<UpdateProduct />} />}
        {isAuthenticated && <Route exact path="/admin/orders" element={<OrderList />} />}
        {isAuthenticated && <Route exact path="/admin/users" element={<UserLists />} />}
        {isAuthenticated && <Route exact path="/admin/reviews" element={<ProductReviews />} />}


      </Routes>


      


      <Footer />
    </Router>
    
  );
}

export default App;




