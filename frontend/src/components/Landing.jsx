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
          className="absolute -inset-4 rounded-full border border-purple-300 border-dashed opacity-50"
        />
        <div className="w-32 h-32 rounded-full glass flex items-center justify-center bg-white/60">
          <Sparkles className="w-16 h-16 text-pink-400" />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-800">
          Hadiah Dari <span className="gradient-text">Bintang</span> ✨
        </h1>
        <p className="text-slate-600 text-lg font-medium">
          Cari hadiah hari jadi yang paling "ngam", dipilih khas berdasarkan tarikh lahir & personaliti mereka.
        </p>
      </div>

      <button
        onClick={onNext}
        className="w-full sm:w-auto px-10 py-4 gradient-btn rounded-full font-bold text-lg transition-transform transform hover:scale-105"
      >
        Mula Cari Hadiah
      </button>
    </motion.div>
  )
}
