import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound, Lock, Loader2 } from 'lucide-react'
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
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase })
      })
      
      const data = await res.json()
      
      if (res.ok && data.token) {
        localStorage.setItem('adminToken', data.token)
        navigate('/admin')
      } else {
        setError(data.error || 'Invalid passphrase')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white shadow-xl p-8 space-y-8 relative overflow-hidden rounded-3xl border border-slate-200">
          {/* Decorative blur */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-200 rounded-full blur-3xl" />
          
          <div className="text-center space-y-2 relative z-10">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-purple-100 rounded-full">
                <Lock className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <h1 className="text-3xl font-heading font-bold text-slate-800">Admin Access</h1>
            <p className="text-slate-500 font-medium">Enter your secure passphrase to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-5 h-5" />
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Passphrase..."
                  className="w-full bg-slate-50 border border-purple-200 rounded-xl py-4 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm pl-2 font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || !passphrase}
              className="w-full flex items-center justify-center py-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl font-bold text-lg transition-all shadow-sm"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
