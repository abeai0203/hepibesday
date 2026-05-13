import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'

export default function DateSelection({ onNext }) {
  const [date, setDate] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (date) {
      onNext(date)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8 py-8 w-full"
    >
      <div className="text-center space-y-2">
        <p className="text-accent text-sm font-semibold tracking-wider uppercase">Langkah 2 dari 2</p>
        <h2 className="text-3xl font-heading text-white">Bila tarikh lahir dorang?</h2>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-sm text-slate-400 font-medium">Tarikh Lahir</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all color-scheme-dark"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!date}
          className="w-full px-8 py-4 bg-accent hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-400 text-slate-900 rounded-xl font-semibold text-lg transition-all"
        >
          Jom Tengok Personaliti!
        </button>
      </form>
    </motion.div>
  )
}
