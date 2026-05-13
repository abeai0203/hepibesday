import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PublicFlow from './PublicFlow'
import AdminLayout from './components/admin/AdminLayout'
import Login from './components/admin/Login'
import Dashboard from './components/admin/Dashboard'
import ProductManager from './components/admin/ProductManager'

// Protect admin routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken')
  if (!token) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public App Flow */}
        <Route path="/*" element={<PublicFlow />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
