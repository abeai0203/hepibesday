import { useState, useEffect } from 'react'
import { Users, MousePointerClick, TrendingUp, Loader2, Sparkles, Activity, Target } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({ 
    sessions: 0, 
    clicks: 0, 
    topZodiacs: [], 
    topProducts: [] 
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const currentOrigin = window.location.origin;
        const apiUrl = import.meta.env.VITE_API_URL || (currentOrigin.includes('localhost') ? 'http://localhost:8787' : 'https://hepibesday-api.abeai0203.workers.dev');
        const res = await fetch(`${apiUrl}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        })
        if (res.status === 401) {
          localStorage.removeItem('adminToken')
          window.location.href = '/admin/login'
          return
        }
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
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
        <p className="text-indigo-950 font-black uppercase tracking-widest text-xs">Memuatkan Data...</p>
      </div>
    )
  }

  const ctrValue = stats.sessions > 0 ? ((stats.clicks / stats.sessions) * 100) : 0
  const ctr = ctrValue.toFixed(1)

  return (
    <div className="space-y-12 pb-12">
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border-2 border-blue-100 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shadow-inner">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Jumlah Pelawat</p>
              <h3 className="text-4xl font-black text-indigo-950">{stats.sessions}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-orange-100 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center shadow-inner">
              <MousePointerClick className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Klik Affiliate</p>
              <h3 className="text-4xl font-black text-indigo-950">{stats.clicks}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-green-100 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center shadow-inner">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Kadar Klik (CTR)</p>
              <h3 className="text-4xl font-black text-indigo-950">{ctr}%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border-2 border-slate-50 rounded-[3rem] p-10 shadow-2xl space-y-8">
          <h4 className="text-xl font-black text-indigo-950">Zodiak Paling Ramai</h4>
          <div className="space-y-4">
            {stats.topZodiacs && stats.topZodiacs.length > 0 ? stats.topZodiacs.map((z, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-wider text-slate-500">
                  <span>{z.zodiac_sign}</span>
                  <span>{z.count} Sesi</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${stats.sessions > 0 ? (z.count / stats.sessions) * 100 : 0}%` }}
                    className="h-full bg-indigo-500"
                  />
                </div>
              </div>
            )) : (
              <p className="text-slate-400 italic font-bold">Menunggu data sesi...</p>
            )}
          </div>
        </div>

        <div className="bg-white border-2 border-slate-50 rounded-[3rem] p-10 shadow-2xl space-y-8">
          <h4 className="text-xl font-black text-indigo-950">Produk Paling Laris</h4>
          <div className="space-y-4">
            {stats.topProducts && stats.topProducts.length > 0 ? stats.topProducts.map((p, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-indigo-950 shadow-sm">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-indigo-950 truncate text-sm">{p.name}</p>
                  <p className="text-[10px] font-black text-orange-400 uppercase">{p.count} Klik</p>
                </div>
              </div>
            )) : (
              <p className="text-slate-400 italic font-bold">Menunggu data klik...</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Insight */}
      <div className="bg-indigo-950 text-white rounded-[3rem] p-10 shadow-2xl flex flex-col md:flex-row items-center gap-8">
        <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <div className="text-center md:text-left space-y-2">
          <h4 className="text-2xl font-black">Terus Berikan Magik!</h4>
          <p className="text-indigo-200 font-medium">Gunakan data di atas untuk merancang kempen atau menambah hadiah yang lebih viral.</p>
        </div>
        <button 
          onClick={() => window.location.href = '/admin/products'}
          className="md:ml-auto px-8 py-4 bg-white text-indigo-950 rounded-2xl font-black text-sm hover:bg-pink-500 hover:text-white transition-all shadow-xl"
        >
          Urus Produk
        </button>
      </div>
    </div>
  )
}
