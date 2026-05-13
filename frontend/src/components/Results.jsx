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
        <RefreshCw className="w-8 h-8 text-accent animate-spin" />
      </div>
    )
  }

  if (error) {
    return <p className="text-center text-red-400">{error}</p>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 py-8 w-full max-w-2xl mx-auto"
    >
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <Gift className="w-12 h-12 text-accent" />
        </div>
        <h2 className="text-3xl font-heading text-white">Hadiah Paling Ngam Untuk {sessionData.targetName || zodiac}</h2>
        <p className="text-slate-400">Dipilih khas mengikut personaliti {sessionData.targetName || 'dorang'}</p>
      </div>

      <div className="space-y-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className="glass-card overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="h-48 w-full overflow-hidden">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-heading font-semibold text-white">{product.name}</h3>
                <span className="bg-white/10 text-accent text-sm font-mono px-3 py-1 rounded-full whitespace-nowrap">
                  {product.price_range}
                </span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{product.reason}</p>
              
              <button
                onClick={() => handleProductClick(product.id, product.shopee_url)}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/50 rounded-xl text-white transition-colors"
              >
                <span>Tengok di Shopee</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}

        {products.length === 0 && (
          <p className="text-center text-slate-400">Alamak, takde hadiah spesifik jumpa sekarang ni. Nanti kami update lagi!</p>
        )}
      </div>

      <div className="pt-8 text-center border-t border-white/10">
        <button
          onClick={onRestart}
          className="text-slate-400 hover:text-white transition-colors flex items-center justify-center space-x-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Cuba Lagi Sekali</span>
        </button>
      </div>
    </motion.div>
  )
}
