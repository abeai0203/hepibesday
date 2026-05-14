import { useState, useEffect } from 'react'
import { Users, MousePointerClick, TrendingUp, Loader2, Sparkles, Activity, Target, PieChart, BarChart } from 'lucide-react'
import { motion } from 'framer-motion'

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
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787'
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

  // Calculate estimated CTR
  const ctrValue = stats.sessions > 0 ? ((stats.clicks / stats.sessions) * 100) : 0
  const ctr = ctrValue.toFixed(1)

  const cards = [
    {
      title: 'Jumlah Pelawat',
      value: stats.sessions,
      icon: <Users className="w-6 h-6 text-blue-500" />,
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      label: 'Sesi Aktif'
    },
    {
      title: 'Klik Affiliate',
      value: stats.clicks,
      icon: <MousePointerClick className="w-6 h-6 text-orange-500" />,
      bg: 'bg-orange-50',
      border: 'border-orange-100',
      label: 'Trafik Shopee'
    },
    {
      title: 'Kadar Klik (CTR)',
      value: `${ctr}%`,
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      bg: 'bg-green-50',
      border: 'border-green-100',
      label: 'Prestasi Jualan'
    }
  ]

  return (
    <div className="space-y-12 pb-12">
      {/* Welcome Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-white border-2 ${card.border} rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group hover:scale-105 transition-all duration-300`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${card.bg} rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-110 transition-transform`} />
            
            <div className="relative z-10 space-y-6">
              <div className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center shadow-inner`}>
                {card.icon}
              </div>
              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">{card.title}</p>
                <div className="flex items-baseline space-x-2">
                  <h3 className="text-4xl font-black text-indigo-950">{card.value}</h3>
                  <span className="text-[10px] font-black text-slate-400 uppercase">{card.label}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Zodiacs */}
        <div className="bg-white border-2 border-slate-50 rounded-[3rem] p-10 shadow-2xl space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <PieChart className="w-5 h-5 text-purple-500" />
              </div>
              <h4 className="text-xl font-black text-indigo-950">Zodiak Paling Ramai</h4>
            </div>
          </div>
          
          <div className="space-y-4">
            {stats.topZodiacs.length > 0 ? stats.topZodiacs.map((z, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-wider text-slate-500">
                  <span>{z.zodiac_sign}</span>
                  <span>{z.count} Sesi</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.sessions > 0 ? (z.count / stats.sessions) * 100 : 0}%` }}
                    className={`h-full bg-gradient-to-r ${i === 0 ? 'from-purple-500 to-indigo-500' : 'from-slate-400 to-slate-300'}`}
                  />
                </div>
              </div>
            )) : (
              <p className="text-center py-10 text-slate-400 italic font-bold">Menunggu data sesi...</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white border-2 border-slate-50 rounded-[3rem] p-10 shadow-2xl space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <BarChart className="w-5 h-5 text-orange-500" />
              </div>
              <h4 className="text-xl font-black text-indigo-950">Produk Paling Laris (Klik)</h4>
            </div>
          </div>
          
          <div className="space-y-4">
            {stats.topProducts.length > 0 ? stats.topProducts.map((p, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl group hover:bg-orange-50 transition-colors">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-indigo-950 shadow-sm">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-indigo-950 truncate text-sm">{p.name}</p>
                  <p className="text-[10px] font-black text-orange-400 uppercase">{p.count} Klik</p>
                </div>
              </div>
            )) : (
              <p className="text-center py-10 text-slate-400 italic font-bold">Menunggu data klik...</p>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Stats/Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-indigo-950 text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Activity size={120} />
          </div>
          <div className="relative z-10 space-y-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-black">Ringkasan Prestasi</h4>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <p className="text-indigo-200 font-bold text-sm mb-4">Potensi Penukaran (*Conversion*)</p>
                <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(ctrValue * 2, 100)}%` }}
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-400"
                  />
                </div>
                <p className="text-[10px] text-indigo-300 mt-2 font-black uppercase tracking-widest">
                  {ctrValue > 5 ? 'Prestasi Sangat Baik' : 'Boleh Diperbaiki'}
                </p>
              </div>

              <p className="text-indigo-200/70 text-sm leading-relaxed font-medium italic">
                "Tip: Fokus tambah produk untuk zodiak {stats.topZodiacs[0]?.zodiac_sign || 'popular'} kerana mereka pelawat paling aktif."
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-white rounded-[3rem] p-10 shadow-2xl flex flex-col justify-center text-center space-y-6">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-10 h-10 text-orange-400" />
          </div>
          <h4 className="text-2xl font-black text-indigo-950">Terus Berikan Magik!</h4>
          <p className="text-slate-500 font-bold text-sm max-w-xs mx-auto">
            Gunakan data di atas untuk merancang kempen atau menambah hadiah yang lebih viral.
          </p>
          <button 
            onClick={() => window.location.href = '/admin/products'}
            className="mt-4 px-8 py-4 bg-indigo-950 text-white rounded-2xl font-black text-sm hover:bg-pink-500 transition-all shadow-xl"
          >
            Urus Produk Sekarang
          </button>
        </div>
      </div>
    </div>
  )
}
