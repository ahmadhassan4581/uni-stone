import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import BlankLayout from './layouts/BlankLayout'
import Layout from './layouts/Layout'
import About from './pages/About'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Contact from './pages/Contact'
import DeliveryDetails from './pages/DeliveryDetails'
import Home from './pages/Home'
import InfoPage from './pages/InfoPage'
import NotFound from './pages/NotFound'
import Auth from './pages/Auth'
import Payment from './pages/Payment'
import CheckoutSummary from './pages/CheckoutSummary'
import CheckoutPayment from './pages/CheckoutPayment'
import CheckoutComplete from './pages/CheckoutComplete'
import ProductDetails from './pages/ProductDetails'
import Products from './pages/Products'
import Profile from './pages/Profile'
import MyOrders from './pages/MyOrders'
import Account from './pages/Account'
import Wishlist from './pages/Wishlist'
import Addresses from './pages/Addresses'
import Sale from './pages/Sale'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BlankLayout />}>
          <Route path="checkout/delivery" element={<DeliveryDetails />} />
          <Route path="checkout/summary" element={<CheckoutSummary />} />
          <Route path="checkout/payment" element={<CheckoutPayment />} />
          <Route path="checkout/complete" element={<CheckoutComplete />} />
        </Route>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="products" element={<Products />} />
          <Route path="sale" element={<Sale />} />
          <Route path="products/:slug" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="contact" element={<Contact />} />
          <Route path="auth" element={<Auth />} />
          <Route path="profile" element={<Profile />} />
          <Route path="account" element={<Account />} />
          <Route path="account/profile" element={<Profile />} />
          <Route path="account/wishlist" element={<Wishlist />} />
          <Route path="account/addresses" element={<Addresses />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="consultation" element={<Payment />} />
          <Route path="payment" element={<Navigate to="/consultation" replace />} />
          <Route path="info/:slug" element={<InfoPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
