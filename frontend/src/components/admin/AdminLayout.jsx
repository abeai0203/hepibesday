import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, LogOut, Heart, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-[#FDFCF0] flex flex-col md:flex-row">
      {/* Sidebar - Mobile Top Bar / Desktop Sidebar */}
      <aside className="w-full md:w-72 bg-indigo-950 text-white flex flex-col shadow-2xl relative z-20">
        <div className="p-8 flex items-center justify-between md:flex-col md:items-start md:space-y-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
              <Heart className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <h1 className="text-xl font-black tracking-tight">Hepi Admin</h1>
          </div>
          
          <div className="hidden md:block w-full space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 pl-4 mb-4">Menu Utama</p>
            <Link
              to="/admin"
              className={`flex items-center space-x-4 px-6 py-4 rounded-[1.5rem] transition-all group ${isActive('/admin') ? 'bg-pink-500 text-white shadow-xl translate-x-2' : 'text-indigo-200 hover:bg-white/5 hover:text-white'}`}
            >
              <LayoutDashboard className={`w-5 h-5 ${isActive('/admin') ? 'text-white' : 'text-indigo-400 group-hover:text-white'}`} />
              <span className="font-black text-sm">Dashboard</span>
            </Link>
            <Link
              to="/admin/products"
              className={`flex items-center space-x-4 px-6 py-4 rounded-[1.5rem] transition-all group ${isActive('/admin/products') ? 'bg-pink-500 text-white shadow-xl translate-x-2' : 'text-indigo-200 hover:bg-white/5 hover:text-white'}`}
            >
              <Package className={`w-5 h-5 ${isActive('/admin/products') ? 'text-white' : 'text-indigo-400 group-hover:text-white'}`} />
              <span className="font-black text-sm">Urus Produk</span>
            </Link>
          </div>
        </div>
        
        {/* Mobile Navigation Icons */}
        <div className="flex md:hidden bg-indigo-900/50 p-2 border-t border-white/5">
          <Link to="/admin" className={`flex-1 flex flex-col items-center py-3 rounded-xl ${isActive('/admin') ? 'bg-pink-500' : ''}`}>
            <LayoutDashboard size={20} />
            <span className="text-[8px] font-black uppercase mt-1">Stats</span>
          </Link>
          <Link to="/admin/products" className={`flex-1 flex flex-col items-center py-3 rounded-xl ${isActive('/admin/products') ? 'bg-pink-500' : ''}`}>
            <Package size={20} />
            <span className="text-[8px] font-black uppercase mt-1">Produk</span>
          </Link>
        </div>

        <div className="hidden md:block mt-auto p-6">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-4 px-6 py-4 w-full text-indigo-300 hover:text-white hover:bg-red-500/10 rounded-[1.5rem] transition-all font-black text-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative">
        {/* Background Blobs for Content */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-100/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/20 blur-[120px] rounded-full" />
        </div>

        <div className="p-6 md:p-12 max-w-7xl mx-auto">
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-indigo-950 tracking-tight">Selamat Datang, Admin 👋</h2>
              <p className="text-slate-500 font-bold mt-1 italic">Uruskan magik hari jadi hari ini.</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-pink-50">
                <Sparkles className="text-pink-500 w-6 h-6" />
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  )
}
