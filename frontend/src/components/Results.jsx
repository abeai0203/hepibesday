import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, RefreshCw, Gift, Star, ShoppingBag, ArrowRight } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

export default function Results({ sessionData, onRestart }) {
  // Defensive check for sessionData
  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="bg-red-50 p-6 rounded-2xl">
          <p className="text-red-500 font-bold">Data sesi hilang. Sila mula semula.</p>
          <button onClick={onRestart} className="mt-4 px-6 py-2 bg-red-500 text-white rounded-xl">Mula Semula</button>
        </div>
      </div>
    )
  }

  const { zodiac, gender, sessionId, targetName } = sessionData
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchRecommendations = async () => {
      try {
        console.log('Fetching recommendations for:', { zodiac, gender, targetName });
        const response = await fetch(`${API_URL}/api/recommendations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionData)
        })
        
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Gagal memuatkan cadangan: ${response.status}`);
        }
        
        const data = await response.json()
        console.log('Received recommendations:', data);
        
        if (isMounted) {
          setProducts(data.products || [])
          setLoading(false)
        }
      } catch (err) {
        console.error('Fetch error:', err);
        if (isMounted) {
          setError(err.message)
          setLoading(false)
        }
      }
    }

    fetchRecommendations()
    return () => { isMounted = false }
  }, [zodiac, gender, targetName])

  const handleProductClick = async (productId, url) => {
    fetch(`${API_URL}/api/track-click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, productId })
    }).catch(console.error)

    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#FDFCF0] flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-20 h-20 bg-white rounded-3xl shadow-2xl flex items-center justify-center mb-6 border border-pink-50"
        >
          <Gift className="w-10 h-10 text-pink-500" />
        </motion.div>
        <h2 className="text-2xl font-black text-indigo-950">Menyusun hadiah terbaik...</h2>
        <p className="text-slate-400 text-sm mt-2 font-bold uppercase tracking-widest">Keajaiban sedang diproses</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#FDFCF0] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border-2 border-red-50 max-w-sm">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-black text-indigo-950 mb-2">Alamak! Tergendala</h3>
          <p className="text-slate-500 font-bold mb-8 text-sm">{error}</p>
          <button 
            onClick={onRestart} 
            className="w-full py-4 bg-indigo-950 text-white rounded-2xl font-black shadow-xl hover:bg-pink-500 transition-colors"
          >
            Cuba Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[#FDFCF0] relative overflow-hidden flex flex-col p-6 pb-20">
      {/* Background Blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-pink-100/50 to-transparent" />
        <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-pink-100/30 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-purple-100/30 blur-[100px] rounded-full" />
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto text-center mb-12 pt-8"
      >
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-xl border border-pink-50 mb-8">
          <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
          <span className="text-[10px] font-black text-indigo-950 uppercase tracking-widest">Keputusan Akhir</span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-black text-indigo-950 leading-tight mb-4">
          Hadiah Paling Ngam Untuk <br/>
          <span className="text-pink-500 underline decoration-pink-200 underline-offset-8">{targetName || 'Si Dia'}</span>
        </h2>
        <p className="text-slate-500 font-bold text-lg">
          Dipilih secara magik mengikut aura personaliti dan bintang {targetName || 'dia'}.
        </p>
      </motion.div>

      {/* Products Grid */}
      <div className="w-full max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.map((product, index) => (
          <motion.div
            key={product.id || index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border-2 border-white rounded-[2.5rem] overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col shadow-xl"
          >
            {/* Image Container */}
            <div className="relative h-64 w-full bg-white p-8 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="max-w-full max-h-full object-contain relative z-10 drop-shadow-2xl"
              />
              {product.price_range && (
                <div className="absolute top-4 right-4 bg-pink-500 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg transform rotate-6">
                  {product.price_range}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-8 flex-1 flex flex-col space-y-4">
              <h3 className="text-2xl font-black text-indigo-950 leading-tight group-hover:text-pink-500 transition-colors">
                {product.name}
              </h3>
              <p className="text-slate-500 font-bold text-sm leading-relaxed flex-1 italic">
                "{product.reason || 'Pilihan terbaik untuk si dia.'}"
              </p>
              
              <button
                onClick={() => handleProductClick(product.id, product.shopee_url)}
                className="w-full py-4 bg-indigo-950 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl hover:bg-pink-500 transition-all active:scale-95"
              >
                <ShoppingBag className="w-5 h-5" />
                Beli Sekarang
                <ExternalLink className="w-4 h-4 opacity-50" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="w-full max-w-lg mx-auto bg-white/70 backdrop-blur-xl border-2 border-dashed border-pink-200 rounded-[2.5rem] p-12 text-center shadow-xl">
          <Gift className="w-16 h-16 text-pink-200 mx-auto mb-4" />
          <p className="text-indigo-950 font-black text-xl">Alamak, tiada cadangan spesifik buat masa ini. Kami akan cari lagi!</p>
        </div>
      )}

      {/* Restart */}
      <div className="mt-16 text-center">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-3 text-pink-500 font-black uppercase tracking-widest text-[10px] hover:text-pink-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Mula Semula
        </button>
      </div>
    </div>
  )
}
