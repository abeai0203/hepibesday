import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserRound, ChevronLeft, ArrowRight, Heart, Sparkles } from 'lucide-react'

export default function NameSelection({ onNext, onBack }) {
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      onNext(name.trim())
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#FDFCF0] relative overflow-hidden flex flex-col p-6">
      {/* Background Blobs - Consistent with Landing */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-pink-100/40 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-purple-100/40 blur-[100px] rounded-full" />
      </div>

      {/* Floating Decorative Icons */}
      <motion.div 
        animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-20 right-10 text-pink-300 opacity-50 hidden md:block"
      >
        <Heart size={48} fill="currentColor" />
      </motion.div>
      
      <motion.div 
        animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-40 left-10 text-purple-300 opacity-50 hidden md:block"
      >
        <Sparkles size={56} />
      </motion.div>

      {/* Top Navigation */}
      <div className="flex items-center justify-between w-full max-w-lg mx-auto mb-10">
        <button 
          onClick={onBack}
          className="w-12 h-12 bg-white shadow-lg rounded-2xl flex items-center justify-center text-slate-700 hover:scale-110 active:scale-95 transition-all border border-pink-50"
        >
          <ChevronLeft className="w-6 h-6 text-pink-500" />
        </button>
        <div className="bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-2xl flex items-center space-x-4 shadow-xl border border-white">
          <span className="text-[10px] font-black text-indigo-950 uppercase tracking-widest">Langkah 1/5</span>
          <div className="w-24 h-2 bg-pink-50 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '20%' }}
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
        <div className="mb-8">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-2xl flex items-center justify-center mb-6 mx-auto border-2 border-pink-50">
            <UserRound className="w-10 h-10 text-pink-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-indigo-950 leading-tight">
            Siapa si dia yang <br/>
            <span className="text-pink-500">bertuah tu?</span>
          </h2>
          <p className="text-slate-500 font-bold mt-4">
            Masukkan nama panggilan atau gelaran kegemaran dia.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
              <UserRound className="w-6 h-6 text-pink-400" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Sayang, Abang, Ali..."
              className="w-full bg-white/70 backdrop-blur-xl border-2 border-white rounded-[2rem] py-6 pl-14 pr-6 text-xl font-black text-indigo-950 placeholder-slate-300 shadow-2xl focus:outline-none focus:border-pink-300 focus:ring-8 focus:ring-pink-100/50 transition-all"
              required
              autoFocus
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!name.trim()}
            className="w-full py-6 bg-gradient-to-r from-pink-400 via-rose-500 to-orange-500 rounded-[2rem] text-white font-black text-xl shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale transition-all"
          >
            Seterusnya
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </form>
      </motion.div>

      {/* Safe Area Padding for Mobile */}
      <div className="h-10 w-full" />
    </div>
  )
}
