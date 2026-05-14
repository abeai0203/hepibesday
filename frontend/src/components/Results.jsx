import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, RefreshCw, Gift } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

export default function Results({ sessionData, onRestart }) {
  const { zodiac, gender, sessionId } = sessionData
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchRecommendations = async () => {
      try {
        const response = await fetch(`${API_URL}/api/recommendations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionData)
        })
        if (!response.ok) throw new Error('Failed to fetch recommendations')
        const data = await response.json()
        
        if (isMounted) {
          setProducts(data.products || [])
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message)
          setLoading(false)
        }
      }
    }

    fetchRecommendations()

    return () => {
      isMounted = false
    }
  }, [zodiac, gender])

  const handleProductClick = async (productId, url) => {
    // Fire and forget click tracking
    fetch(`${API_URL}/api/track-click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, productId })
    }).catch(console.error)

    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <RefreshCw className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <p className="text-center text-red-500 font-medium">{error}</p>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 py-4 w-full max-w-md mx-auto"
    >
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <Gift className="w-12 h-12 text-pink-500" />
        </div>
        <h2 className="text-3xl font-heading font-bold text-slate-800">Hadiah Paling Ngam Untuk <span className="gradient-text">{sessionData.targetName || zodiac}</span></h2>
        <p className="text-slate-600 font-medium">Dipilih khas mengikut personaliti {sessionData.targetName || 'dorang'}</p>
      </div>

      <div className="space-y-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className="glass-card overflow-hidden group hover:-translate-y-1 transition-transform duration-300 shadow-md"
          >
            <div className="h-48 w-full overflow-hidden bg-white/50">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
              />
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-heading font-bold text-slate-800">{product.name}</h3>
                <span className="bg-pink-100 text-pink-600 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  {product.price_range}
                </span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">{product.reason}</p>
              
              <button
                onClick={() => handleProductClick(product.id, product.shopee_url)}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-white/80 hover:bg-white border border-purple-200 hover:border-pink-300 rounded-xl text-slate-700 font-bold transition-colors shadow-sm"
              >
                <span>Lihat di Kedai</span>
                <ExternalLink className="w-4 h-4 text-pink-500" />
              </button>
            </div>
          </motion.div>
        ))}

        {products.length === 0 && (
          <p className="text-center text-slate-500 font-medium">Alamak, takde hadiah spesifik jumpa sekarang ni. Nanti kami update lagi!</p>
        )}
      </div>

      <div className="pt-8 text-center border-t border-purple-200/50">
        <button
          onClick={onRestart}
          className="text-purple-600 hover:text-purple-800 font-bold transition-colors flex items-center justify-center space-x-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Cuba Lagi Sekali</span>
        </button>
      </div>
    </motion.div>
  )
}
