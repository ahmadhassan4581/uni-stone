import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Contacts from './pages/Contacts'
import Newsletter from './pages/Newsletter'
import Orders from './pages/Orders'
import Users from './pages/Users'
import Consultations from './pages/Consultations'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="newsletter" element={<Newsletter />} />
            <Route path="orders" element={<Orders />} />
            <Route path="consultations" element={<Consultations />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
