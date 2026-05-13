import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserRound } from 'lucide-react'

export default function NameSelection({ onNext }) {
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      onNext(name.trim())
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
        <p className="text-purple-500 text-sm font-bold tracking-wider uppercase">Langkah 1 dari 4</p>
        <h2 className="text-3xl font-heading font-bold text-slate-800">Siapa si dia yang bertuah tu?</h2>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-sm text-slate-600 font-bold">Nama Panggilan / Gelaran</label>
          <div className="relative">
            <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-5 h-5" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Sayang, Abang, Ali..."
              className="w-full bg-white/50 border border-purple-200 rounded-xl py-4 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
              required
              autoFocus
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full gradient-btn py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:shadow-none"
        >
          Seterusnya
        </button>
      </form>
    </motion.div>
  )
}
