import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, LogOut } from 'lucide-react'

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="p-6">
          <h1 className="text-xl font-heading font-bold text-slate-800">Hepibesday Admin</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link
            to="/admin"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin') ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link
            to="/admin/products"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/products') ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            <Package className="w-5 h-5" />
            <span className="font-medium">Products</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
