import { motion } from 'framer-motion'
import { Check, RefreshCw, ChevronLeft, ShieldCheck, Sparkles } from 'lucide-react'

export default function Traits({ sessionData, onNext, onRetry, onBack }) {
  const { zodiac, traits } = sessionData

  // Emojis and background colors for the 3 traits
  const traitStyles = [
    { emoji: '🤝', bg: 'bg-pink-100' },
    { emoji: '💡', bg: 'bg-yellow-100' },
    { emoji: '🛡️', bg: 'bg-teal-100' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="w-full max-w-md mx-auto pb-8 pt-4 space-y-6"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="w-10 h-10 bg-white/60 backdrop-blur shadow-sm rounded-full flex items-center justify-center text-slate-700 hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="bg-white/60 backdrop-blur px-4 py-2 rounded-full flex items-center space-x-3 shadow-sm">
          <span className="text-xs font-bold text-slate-600">LANGKAH 4/5</span>
          <div className="w-16 h-2 bg-purple-100 rounded-full overflow-hidden">
            <div className="w-4/5 h-full bg-purple-400 rounded-full" />
          </div>
        </div>
        <div className="w-10 h-10" /> {/* Empty div for centering */}
      </div>

      {/* Header */}
      <div className="text-center space-y-3 mt-4">
        <div className="inline-flex items-center space-x-2 bg-purple-400 text-white px-4 py-1.5 rounded-full shadow-md">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold tracking-wider">BINTANG: {zodiac.toUpperCase()}</span>
        </div>
        
        <h2 className="text-3xl font-heading font-bold text-slate-800 leading-tight">
          Ini <span className="gradient-text">personaliti</span> {sessionData.targetName || 'dia'} kan?
        </h2>
        <p className="text-slate-600 font-medium">Betul ke {sessionData.targetName || 'dia'} macam ni? 😌</p>
      </div>

      {/* Traits Card */}
      <div className="glass-card p-6 space-y-6 relative overflow-hidden">
        {/* Magic sparkles decoration */}
        <div className="absolute top-2 right-2 text-yellow-300 opacity-50">✨</div>
        <div className="absolute bottom-4 left-2 text-pink-300 opacity-50">✨</div>

        <ul className="space-y-5 relative z-10">
          {traits.map((trait, index) => {
            const style = traitStyles[index % traitStyles.length]
            return (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.3 }}
                className="flex items-start space-x-4"
              >
                <div className={`w-14 h-14 rounded-full ${style.bg} flex items-center justify-center shrink-0 relative shadow-inner`}>
                  <span className="text-2xl">{style.emoji}</span>
                  <div className="absolute -top-1 -right-1 bg-purple-500 rounded-full p-0.5 border-2 border-white shadow-sm">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-[15px] leading-snug text-slate-700 font-medium">{trait}</p>
                </div>
              </motion.li>
            )
          })}
        </ul>
      </div>

      {/* Actions */}
      <div className="space-y-4 pt-2">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: traits.length * 0.3 + 0.4 }}
          onClick={onNext}
          className="w-full gradient-btn py-4 rounded-2xl flex items-center justify-center space-x-2 text-lg font-bold relative group"
        >
          <Sparkles className="w-5 h-5" />
          <span>Ya, betul! Tunjuk hadiah</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
          {/* Floating gift icon */}
          <div className="absolute right-4 -top-3 text-4xl drop-shadow-xl rotate-12 group-hover:rotate-0 transition-transform">
            🎁
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: traits.length * 0.3 + 0.5 }}
          onClick={onRetry}
          className="w-full border-2 border-dashed border-purple-200 bg-white/50 backdrop-blur hover:bg-white/80 py-4 rounded-2xl font-semibold flex items-center justify-center space-x-2 text-purple-600 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Hmm.. kurang tepat, cuba lagi?</span>
        </motion.button>
      </div>

      {/* Trust Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: traits.length * 0.3 + 0.6 }}
        className="flex items-center justify-center space-x-2 pt-2"
      >
        <div className="bg-purple-500 rounded-full p-0.5">
          <ShieldCheck className="w-3 h-3 text-white" />
        </div>
        <span className="text-xs font-medium text-slate-500">
          100% selamat • Tiada data peribadi dikongsi
        </span>
      </motion.div>
    </motion.div>
  )
}
