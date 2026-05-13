import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function Landing({ onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center text-center space-y-8 py-12"
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 rounded-full border border-white/10 border-dashed"
        />
        <div className="w-32 h-32 rounded-full glass flex items-center justify-center">
          <Sparkles className="w-16 h-16 text-accent" />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-heading font-semibold text-white glow-text">
          Star-Aligned Gifts
        </h1>
        <p className="text-slate-300 text-lg">
          Discover the perfect birthday gift, curated by the stars and personality traits.
        </p>
      </div>

      <button
        onClick={onNext}
        className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-amber-400 text-slate-900 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
      >
        Find the Perfect Gift
      </button>
    </motion.div>
  )
}
