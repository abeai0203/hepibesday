import { useState, useEffect } from 'react'
import { Users, MousePointerClick, TrendingUp, Loader2 } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({ sessions: 0, clicks: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + '/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        })
        const data = await res.json()
        if (res.ok) {
          setStats(data)
        }
      } catch (err) {
        console.error('Failed to fetch stats')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-accent animate-spin" /></div>
  }

  // Calculate estimated CTR
  const ctr = stats.sessions > 0 ? ((stats.clicks / stats.sessions) * 100).toFixed(1) : 0

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-semibold text-white mb-8">Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Sessions</p>
              <h3 className="text-3xl font-bold text-white">{stats.sessions}</h3>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-l-4 border-l-accent">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-accent/20 rounded-lg">
              <MousePointerClick className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Affiliate Clicks</p>
              <h3 className="text-3xl font-bold text-white">{stats.clicks}</h3>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-l-4 border-l-green-500">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Est. Click-Through Rate</p>
              <h3 className="text-3xl font-bold text-white">{ctr}%</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
