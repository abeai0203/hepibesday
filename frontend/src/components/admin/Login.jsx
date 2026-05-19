import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound, Lock, Loader2, ShieldCheck, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Login() {
  const [passphrase, setPassphrase] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const apiUrl = import.meta.env.VITE_API_URL || (window.location.origin.includes('localhost') ? 'http://localhost:8787' : 'https://api.hepibesday.com')
      const res = await fetch(`${apiUrl}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase })
      })
      
      const data = await res.json()
      
      if (res.ok && data.token) {
        localStorage.setItem('adminToken', data.token)
        navigate('/admin')
      } else {
        setError(data.error || 'Passphrase tidak sah')
      }
    } catch (err) {
      setError('Gagal menyambung ke pelayan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#FDFCF0] relative overflow-hidden flex items-center justify-center p-6">
      {/* Background Blobs - Consistent with Brand */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-indigo-100/40 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-[550px] h-[550px] bg-pink-100/40 blur-[100px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Decorative Sparkles */}
        <div className="absolute -top-6 -right-6 text-orange-300 animate-pulse hidden md:block">
          <Sparkles size={48} />
        </div>

        <div className="bg-white/80 backdrop-blur-2xl border-2 border-white p-10 rounded-[3rem] shadow-2xl space-y-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-indigo-950 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
              <Lock className="w-10 h-10 text-pink-400" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-indigo-950">Akses Admin</h1>
              <p className="text-slate-500 font-bold text-sm">Sila masukkan frasa laluan rahsia</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                  <KeyRound className="w-6 h-6 text-indigo-950/30" />
                </div>
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Taip di sini..."
                  className="w-full bg-white border-2 border-slate-50 rounded-2xl py-5 pl-14 pr-6 text-indigo-950 font-black placeholder-slate-300 shadow-inner focus:outline-none focus:border-pink-300 focus:ring-8 focus:ring-pink-100/50 transition-all"
                  required
                />
              </div>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-500 text-xs font-black uppercase tracking-widest pl-2"
                >
                  ⚠️ {error}
                </motion.p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !passphrase}
              className="w-full py-5 bg-indigo-950 text-white rounded-2xl font-black text-lg shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all hover:bg-indigo-900"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>Masuk Dashboard</span>
                  <ShieldCheck className="w-6 h-6 text-pink-400" />
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex items-center justify-center space-x-2 opacity-30">
          <ShieldCheck className="w-4 h-4 text-indigo-950" />
          <span className="text-[10px] font-black text-indigo-950 uppercase tracking-widest">Sistem Kawalan Hepibesday v2.0</span>
        </div>
      </motion.div>
    </div>
  )
}
