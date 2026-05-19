import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Star, Wand2, Moon, Sun, Loader2 } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || (window.location.origin.includes('localhost') ? 'http://localhost:8787' : 'https://hepibesday-api.abeai0203.workers.dev')

const loadingMessages = [
  "Membaca posisi bintang...",
  "Mencari frekuensi personaliti...",
  "Menyusun algoritma kegembiraan...",
  "Hampir siap! Keajaiban sedang berlaku...",
  "Menentukan hadiah yang paling ngam..."
]

export default function Analyzing({ sessionData, onComplete }) {
  const [error, setError] = useState(null)
  const [msgIdx, setMsgIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx(prev => (prev + 1) % loadingMessages.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

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
            targetName: sessionData.targetName,
            relationship: sessionData.relationship,
            occasion: sessionData.occasion,
            hobby: sessionData.hobby,
            turnstileToken: sessionData.turnstileToken
          }),
        })

        if (!response.ok) {
          const rawText = await response.text()
          let errData = {}
          try { errData = JSON.parse(rawText) } catch (e) {}
          throw new Error(errData.details || errData.error || `HTTP ${response.status}: ${rawText.slice(0, 50)}...`)
        }

        const data = await response.json()
        
        // Artificial delay for dramatic effect
        setTimeout(() => {
          if (isMounted) onComplete(data)
        }, 1500)
      } catch (err) {
        if (isMounted) setError(err.message)
      }
    }

    generateTraits()
    return () => { isMounted = false }
  }, [sessionData, onComplete])

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-50 p-8 rounded-[2rem] border-2 border-red-100 max-w-sm">
          <p className="text-red-500 font-black mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full py-4 bg-red-500 text-white rounded-2xl font-black shadow-lg shadow-red-200"
          >
            Cuba Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[#FDFCF0] relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Background Blobs */}
      <div className="absolute inset-0 -z-10">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-purple-100/40 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-pink-100/40 blur-[120px] rounded-full" 
        />
      </div>

      <div className="relative flex flex-col items-center max-w-lg w-full text-center">
        {/* Magic Spinner */}
        <div className="relative w-48 h-48 mb-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-dashed border-pink-200"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border-4 border-dotted border-purple-200"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50 opacity-50" />
              <Wand2 className="w-14 h-14 text-pink-500 relative z-10" />
              
              {/* Floating particles inside */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [-20, 20, -20], 
                    x: [-20, 20, -20],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2 + i, 
                    repeat: Infinity,
                    delay: i * 0.4
                  }}
                  className="absolute"
                >
                  <Star className="w-3 h-3 text-orange-300 fill-orange-300" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Dynamic Text Messages */}
        <div className="h-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={msgIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <h2 className="text-3xl md:text-4xl font-black text-indigo-950 leading-tight">
                {loadingMessages[msgIdx]}
              </h2>
              <p className="text-pink-500 font-black tracking-widest text-xs uppercase">
                Keajaiban Sedang Berlaku
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Bar (Visual only) */}
        <div className="w-64 h-3 bg-white/50 backdrop-blur rounded-full mt-12 overflow-hidden border border-white shadow-inner">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 15, ease: "linear" }}
            className="h-full bg-gradient-to-r from-pink-400 via-rose-500 to-orange-500"
          />
        </div>
      </div>
    </div>
  )
}
