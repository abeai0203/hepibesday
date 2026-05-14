import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Dices, ChevronLeft, Sparkles, Wand2 } from 'lucide-react'
import { Turnstile } from '@marsidev/react-turnstile'

export default function DateSelection({ targetName, onNext, onBack }) {
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
    <div className="min-h-screen w-full bg-[#FDFCF0] relative overflow-hidden flex flex-col p-6">
      {/* Background Blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-pink-100/30 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-[550px] h-[550px] bg-orange-100/30 blur-[100px] rounded-full" />
      </div>

      {/* Top Navigation */}
      <div className="flex items-center justify-between w-full max-w-lg mx-auto mb-10">
        <button 
          onClick={onBack}
          className="w-12 h-12 bg-white shadow-lg rounded-2xl flex items-center justify-center text-slate-700 hover:scale-110 active:scale-95 transition-all border border-pink-50"
        >
          <ChevronLeft className="w-6 h-6 text-pink-500" />
        </button>
        <div className="bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-2xl flex items-center space-x-4 shadow-xl border border-white">
          <span className="text-[10px] font-black text-indigo-950 uppercase tracking-widest">Langkah 3/5</span>
          <div className="w-24 h-2 bg-pink-50 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: '40%' }}
              animate={{ width: '60%' }}
              className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full" 
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto text-center"
      >
        <div className="mb-10">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-2xl flex items-center justify-center mb-6 mx-auto border-2 border-pink-50">
            <Calendar className="w-10 h-10 text-pink-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-indigo-950 leading-tight">
            Bila tarikh lahir <br/>
            <span className="text-pink-500">{targetName || 'dorang'}?</span>
          </h2>
          <p className="text-slate-500 font-bold mt-4">
            Kami akan gunakan sains astrologi untuk <br className="hidden md:block" />mencari hadiah yang paling serasi!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-8">
          <div className="relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none z-10 transition-transform group-focus-within:scale-110">
              <Calendar className="w-6 h-6 text-pink-400" />
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white/70 backdrop-blur-xl border-2 border-white rounded-[2rem] py-6 pl-14 pr-6 text-xl font-black text-indigo-950 shadow-2xl focus:outline-none focus:border-pink-300 focus:ring-8 focus:ring-pink-100/50 transition-all appearance-none"
              required
            />
          </div>

          {import.meta.env.VITE_TURNSTILE_SITEKEY && (
            <div className="flex justify-center">
              <Turnstile 
                siteKey={import.meta.env.VITE_TURNSTILE_SITEKEY}
                onSuccess={setTurnstileToken}
                options={{ theme: 'light' }}
              />
            </div>
          )}

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!date || (import.meta.env.VITE_TURNSTILE_SITEKEY && !turnstileToken)}
              className="w-full py-6 bg-gradient-to-r from-pink-400 via-rose-500 to-orange-500 rounded-[2rem] text-white font-black text-xl shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale transition-all"
            >
              <Wand2 className="w-6 h-6" />
              Tengok Personaliti!
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleRandomDate}
              className="w-full flex items-center justify-center space-x-2 py-3 text-pink-500 font-black text-sm"
            >
              <Dices className="w-4 h-4" />
              <span>Tak ingat? Pilih secara rawak</span>
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Safe Area Padding for Mobile */}
      <div className="h-10 w-full" />
    </div>
  )
}
