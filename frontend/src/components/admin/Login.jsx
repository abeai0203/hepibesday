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
        <div className="glass-card p-8 space-y-8 relative overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
          
          <div className="text-center space-y-2 relative z-10">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-accent/10 rounded-full">
                <Lock className="w-8 h-8 text-accent" />
              </div>
            </div>
            <h1 className="text-3xl font-heading font-bold text-white">Admin Access</h1>
            <p className="text-slate-400">Enter your secure passphrase to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Passphrase..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all color-scheme-dark"
                  required
                />
              </div>
              {error && <p className="text-red-400 text-sm pl-2">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || !passphrase}
              className="w-full flex items-center justify-center py-4 bg-accent hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-400 text-slate-900 rounded-xl font-semibold text-lg transition-all"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
