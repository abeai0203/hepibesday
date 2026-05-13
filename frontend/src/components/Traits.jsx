import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export default function Traits({ sessionData, onNext }) {
  const { zodiac, traits } = sessionData

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="space-y-8 py-8 w-full"
    >
      <div className="text-center space-y-2">
        <p className="text-accent text-sm font-semibold tracking-wider uppercase">Bintang: {zodiac}</p>
        <h2 className="text-3xl font-heading text-white">Ini personaliti dorang kan?</h2>
        <p className="text-slate-400">Betul ke dorang macam ni?</p>
      </div>

      <div className="glass-card p-6 md:p-8 space-y-6">
        <ul className="space-y-4">
          {traits.map((trait, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.3 }}
              className="flex items-start space-x-3 text-lg text-slate-200"
            >
              <div className="mt-1 bg-accent/20 p-1 rounded-full text-accent shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <span>{trait}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: traits.length * 0.3 + 0.5 }}
        onClick={onNext}
        className="w-full px-8 py-4 bg-accent hover:bg-amber-400 text-slate-900 rounded-xl font-semibold text-lg transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]"
      >
        Ya, betul! Tunjuk hadiah
      </motion.button>
    </motion.div>
  )
}
