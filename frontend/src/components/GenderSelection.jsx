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
        <p className="text-purple-500 text-sm font-bold tracking-wider uppercase">Langkah 2 dari 4</p>
        <h2 className="text-3xl font-heading font-bold text-slate-800">Apa jantina {targetName || 'si dia'}?</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onNext('M')}
          className="glass-card p-8 flex flex-col items-center justify-center space-y-4 hover:bg-blue-50/50 hover:border-blue-200 transition-all group shadow-sm"
        >
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UserRound className="w-8 h-8 text-blue-500" />
          </div>
          <span className="font-bold text-lg text-slate-700">Lelaki</span>
        </button>

        <button
          onClick={() => onNext('F')}
          className="glass-card p-8 flex flex-col items-center justify-center space-y-4 hover:bg-pink-50/50 hover:border-pink-200 transition-all group shadow-sm"
        >
          <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <User className="w-8 h-8 text-pink-500" />
          </div>
          <span className="font-bold text-lg text-slate-700">Perempuan</span>
        </button>
      </div>
    </motion.div>
  )
}
