import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, RefreshCw, Gift, Star, ShoppingBag, Heart, Sparkles, Wand2 } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || (window.location.origin.includes('localhost') ? 'http://localhost:8787' : 'https://api.hepibesday.com')

const waitingQuotes = [
  "Kejap ya, tengah tanya kawan-kawan dia...",
  "Tengah check Shopee jap, mana yang paling murah tapi style...",
  "Uish, susah betul nak cari hadiah yang sesuai dengan aura dia ni!",
  "Bintang-bintang tengah bermesyuarat kejap...",
  "Tengah bungkus hadiah secara virtual... zap zap!",
  "Tengah filter hadiah yang 'common', kita nak yang unik je!",
  "Tunggu jap, tengah nak make sure hadiah ni dia tak beli sendiri lagi.",
  "Dah nak siap! Sikit je lagi aura dia tengah loading..."
]

export default function Results({ sessionData, onRestart }) {
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
  const [quoteIdx, setQuoteIdx] = useState(0)
  const [maxBudget, setMaxBudget] = useState(500)

  // Cycle through quotes every 3 seconds
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setQuoteIdx(prev => (prev + 1) % waitingQuotes.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [loading])

  useEffect(() => {
    let isMounted = true

    const fetchRecommendations = async () => {
      try {
        const response = await fetch(`${API_URL}/api/recommendations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionData)
        })
        
        if (!response.ok) {
          throw new Error(`Gagal memuatkan cadangan: ${response.status}`);
        }
        
        const data = await response.json()
        
        if (isMounted) {
          setProducts(data.products || [])
          // Artificial delay to show at least 2 quotes
          setTimeout(() => {
            if (isMounted) setLoading(false)
          }, 4500)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message)
          setLoading(false)
        }
      }
    }

    fetchRecommendations()
    return () => { isMounted = false }
  }, [zodiac, gender, targetName])

  // Parse numerical price from string like "RM 50 - 150"
  const getMinPrice = (priceStr) => {
    if (!priceStr) return 0
    const numbers = priceStr.match(/\d+/g)
    if (!numbers) return 0
    return Math.min(...numbers.map(Number))
  }

  const filteredProducts = products.filter(p => getMinPrice(p.price_range) <= maxBudget)

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
      <div className="min-h-screen w-full bg-[#FDFCF0] relative overflow-hidden flex flex-col items-center justify-center p-6 text-center">
        {/* Background micro-animations */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: window.innerHeight + 100,
                opacity: 0
              }}
              animate={{ 
                y: -100,
                opacity: [0, 1, 0],
                x: (Math.random() * 100 - 50) + (Math.random() * window.innerWidth)
              }}
              transition={{ 
                duration: 5 + Math.random() * 5, 
                repeat: Infinity,
                delay: i * 0.8
              }}
              className="absolute text-pink-200"
            >
              {i % 3 === 0 ? <Heart size={24} fill="currentColor" /> : i % 3 === 1 ? <Sparkles size={20} /> : <Gift size={18} />}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 max-w-sm w-full">
          {/* Main Animated Icon */}
          <div className="relative w-40 h-40 mx-auto mb-12">
            <motion.div 
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
              className="absolute inset-0 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center border-4 border-pink-50"
            >
              <Gift className="w-16 h-16 text-pink-500" />
            </motion.div>
            
            {/* Spinning ring */}
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border-4 border-dashed border-pink-200 rounded-full opacity-50"
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-black text-indigo-950">
              Menyusun hadiah terbaik...
            </h2>
            
            {/* Quote container with smooth transition */}
            <div className="h-20 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIdx}
                  initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                  className="text-pink-500 font-bold text-lg leading-relaxed italic"
                >
                  "{waitingQuotes[quoteIdx]}"
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="w-full h-3 bg-white rounded-full overflow-hidden shadow-inner border border-white">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 10, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-pink-400 via-rose-500 to-orange-500"
              />
            </div>
          </div>
        </div>
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
        className="w-full max-w-2xl mx-auto text-center mb-8 pt-8"
      >
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-xl border border-pink-50 mb-8">
          <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
          <span className="text-[10px] font-black text-indigo-950 uppercase tracking-widest">Keputusan Akhir</span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-black text-indigo-950 leading-tight mb-4">
          Hadiah Paling Ngam Untuk <br/>
          <span className="text-pink-500 underline decoration-pink-200 underline-offset-8">{targetName || 'Si Dia'}</span>
        </h2>
        
        {/* Budget Slider */}
        <div className="mt-12 bg-white/80 backdrop-blur px-8 py-6 rounded-3xl shadow-xl border border-white max-w-lg mx-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bajet Maksimum</span>
            <span className="text-xl font-black text-pink-500">RM {maxBudget === 500 ? '500+' : maxBudget}</span>
          </div>
          <input 
            type="range" 
            min="10" 
            max="500" 
            step="10" 
            value={maxBudget} 
            onChange={(e) => setMaxBudget(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
          <div className="flex justify-between mt-2 text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
            <span>RM 10</span>
            <span>RM 500+</span>
          </div>
        </div>
      </motion.div>

      {/* Products Grid */}
      <div className="w-full max-w-6xl mx-auto px-2">
        <AnimatePresence mode="popLayout">
          <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id || index}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white border-2 border-white rounded-[2rem] overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col shadow-lg"
              >
                {/* Image Container - More compact height */}
                <div className="relative h-44 md:h-52 w-full bg-white p-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="max-w-full max-h-full object-contain relative z-10 drop-shadow-xl"
                  />
                  {product.price_range && (
                    <div className="absolute top-2 right-2 bg-pink-500 text-white text-[8px] md:text-[9px] font-black px-3 py-1.5 rounded-full shadow-md transform rotate-3">
                      {product.price_range ? (product.price_range.startsWith('RM') ? product.price_range : `RM ${product.price_range}`) : ''}
                    </div>
                  )}
                </div>

                {/* Content - Compact padding */}
                <div className="p-4 md:p-6 flex-1 flex flex-col space-y-3">
                  <h3 className="text-base md:text-lg font-black text-indigo-950 leading-tight group-hover:text-pink-500 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-slate-500 font-bold text-[10px] md:text-xs leading-relaxed flex-1 italic line-clamp-3">
                    "{product.reason || 'Pilihan terbaik untuk si dia.'}"
                  </p>
                  
                  <button
                    onClick={() => handleProductClick(product.id, product.shopee_url)}
                    className="w-full py-3 bg-indigo-950 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-md hover:bg-pink-500 transition-all active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Beli Sekarang
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-lg mx-auto bg-white/70 backdrop-blur-xl border-2 border-dashed border-pink-200 rounded-[2.5rem] p-12 text-center shadow-xl mt-8"
          >
            <Gift className="w-16 h-16 text-pink-200 mx-auto mb-4" />
            <p className="text-indigo-950 font-black text-xl">Bajet terlalu rendah? Cuba naikkan slider untuk lihat lebih banyak hadiah!</p>
          </motion.div>
        )}
      </div>

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
