import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Dices } from 'lucide-react'
import { Turnstile } from '@marsidev/react-turnstile'

export default function DateSelection({ targetName, onNext }) {
  const [date, setDate] = useState('')
  const [turnstileToken, setTurnstileToken] = useState(null)
  const turnstileRef = useRef()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (date) {
      onNext({ birthDate: date, turnstileToken })
    }
  }

  const handleRandomDate = () => {
    const start = new Date(1980, 0, 1)
    const end = new Date(2005, 11, 31)
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    const formattedDate = randomDate.toISOString().split('T')[0]
    
    onNext({ birthDate: formattedDate, turnstileToken })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8 py-8 w-full"
    >
      <div className="text-center space-y-2">
        <p className="text-purple-500 text-sm font-bold tracking-wider uppercase">Langkah 3 dari 4</p>
        <h2 className="text-3xl font-heading font-bold text-slate-800">Bila tarikh lahir {targetName || 'dorang'}?</h2>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-sm text-slate-600 font-bold">Tarikh Lahir</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-5 h-5" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white/50 border border-purple-200 rounded-xl py-4 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
              required
            />
          </div>
        </div>

        {import.meta.env.VITE_TURNSTILE_SITEKEY && (
          <Turnstile 
            siteKey={import.meta.env.VITE_TURNSTILE_SITEKEY}
            onSuccess={setTurnstileToken}
            options={{ theme: 'light' }}
          />
        )}

        <div className="space-y-4">
          <button
            type="submit"
            disabled={!date || (import.meta.env.VITE_TURNSTILE_SITEKEY && !turnstileToken)}
            className="w-full gradient-btn py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:shadow-none"
          >
            Jom Tengok Personaliti!
          </button>
          
          <button
            type="button"
            onClick={handleRandomDate}
            className="w-full flex items-center justify-center space-x-2 py-3 text-purple-500 hover:text-purple-700 transition-colors text-sm font-bold"
          >
            <Dices className="w-4 h-4" />
            <span>Tak ingat? Pilih secara rawak</span>
          </button>
        </div>
      </form>
    </motion.div>
  )
}
