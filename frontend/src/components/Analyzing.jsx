import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Star } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

export default function Analyzing({ sessionData, onComplete }) {
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const generateTraits = async () => {
      try {
        const response = await fetch(`${API_URL}/api/generate-traits`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            birthDate: sessionData.birthDate,
            gender: sessionData.gender,
          }),
        })

        if (!response.ok) throw new Error('Failed to generate traits')

        const data = await response.json()
        
        // Artificial delay for dramatic effect
        setTimeout(() => {
          if (isMounted) {
            onComplete(data)
          }
        }, 2500)
      } catch (err) {
        if (isMounted) {
          setError(err.message)
        }
      }
    }

    generateTraits()

    return () => {
      isMounted = false
    }
  }, [sessionData, onComplete])

  if (error) {
    return (
      <div className="text-center space-y-4">
        <p className="text-red-400">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-white/10 rounded-lg">Try Again</button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center space-y-8 py-12"
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 rounded-full border-t-2 border-r-2 border-accent"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-b-2 border-l-2 border-purple-400"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Star className="w-10 h-10 text-amber-300 animate-pulse" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <motion.h2
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl font-heading text-white"
        >
          Reading the stars...
        </motion.h2>
        <p className="text-slate-400 text-sm">Aligning celestial patterns with gift ideas</p>
      </div>
    </motion.div>
  )
}
