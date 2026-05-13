import { motion } from 'framer-motion'
import { User, UserRound } from 'lucide-react'

export default function GenderSelection({ targetName, onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8 py-8 w-full"
    >
      <div className="text-center space-y-2">
        <p className="text-accent text-sm font-semibold tracking-wider uppercase">Langkah 2 dari 3</p>
        <h2 className="text-3xl font-heading text-white">Apa jantina {targetName || 'si dia'}?</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onNext('M')}
          className="glass-card p-8 flex flex-col items-center justify-center space-y-4 hover:bg-white/10 hover:border-accent/50 transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UserRound className="w-8 h-8 text-blue-400" />
          </div>
          <span className="font-semibold text-lg text-white">Lelaki</span>
        </button>

        <button
          onClick={() => onNext('F')}
          className="glass-card p-8 flex flex-col items-center justify-center space-y-4 hover:bg-white/10 hover:border-accent/50 transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <User className="w-8 h-8 text-pink-400" />
          </div>
          <span className="font-semibold text-lg text-white">Perempuan</span>
        </button>
      </div>
    </motion.div>
  )
}
