import { motion } from 'framer-motion'
import { Check, RefreshCw, ChevronLeft, ShieldCheck, Sparkles, Wand2, Star } from 'lucide-react'

export default function Traits({ sessionData, onNext, onRetry, onBack }) {
  const { zodiac, traits } = sessionData

  const traitStyles = [
    { emoji: '✨', color: 'text-pink-500', bg: 'bg-pink-50' },
    { emoji: '🌟', color: 'text-purple-500', bg: 'bg-purple-50' },
    { emoji: '💫', color: 'text-orange-500', bg: 'bg-orange-50' }
  ]

  return (
    <div className="min-h-screen w-full bg-[#FDFCF0] relative overflow-hidden flex flex-col p-6 pb-12">
      {/* Background Blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -right-20 w-[450px] h-[450px] bg-pink-100/30 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 -left-20 w-[550px] h-[550px] bg-purple-100/30 blur-[100px] rounded-full" />
      </div>

      {/* Top Navigation */}
      <div className="flex items-center justify-between w-full max-w-lg mx-auto mb-8">
        <button 
          onClick={onBack}
          className="w-12 h-12 bg-white shadow-lg rounded-2xl flex items-center justify-center text-slate-700 hover:scale-110 active:scale-95 transition-all border border-pink-50"
        >
          <ChevronLeft className="w-6 h-6 text-pink-500" />
        </button>
        <div className="bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-2xl flex items-center space-x-4 shadow-xl border border-white">
          <span className="text-[10px] font-black text-indigo-950 uppercase tracking-widest">Langkah 4/5</span>
          <div className="w-24 h-2 bg-pink-50 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: '60%' }}
              animate={{ width: '80%' }}
              className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full" 
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col items-center w-full max-w-lg mx-auto text-center"
      >
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 bg-indigo-950 text-white px-5 py-2 rounded-2xl shadow-xl mb-6">
            <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
            <span className="text-[10px] font-black tracking-widest uppercase">BINTANG: {zodiac?.toUpperCase()}</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-indigo-950 leading-tight">
            Ini personaliti <br/>
            <span className="text-pink-500">{sessionData.targetName || 'dia'} kan?</span>
          </h2>
          <p className="text-slate-500 font-bold mt-4">Bintang-bintang kata dia macam ni... 😌</p>
        </div>

        {/* Traits Card */}
        <div className="w-full bg-white/70 backdrop-blur-xl border-2 border-white rounded-[2.5rem] p-8 shadow-2xl space-y-8 relative overflow-hidden mb-10 text-left">
          {/* Decorative Sparkles */}
          <div className="absolute top-4 right-4 text-orange-300 opacity-30"><Sparkles size={32} /></div>
          
          <ul className="space-y-8">
            {traits?.map((trait, index) => {
              const style = traitStyles[index % traitStyles.length]
              return (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.2 }}
                  className="flex items-start space-x-5"
                >
                  <div className={`w-14 h-14 rounded-2xl ${style.bg} flex items-center justify-center shrink-0 shadow-inner relative`}>
                    <span className="text-2xl">{style.emoji}</span>
                    <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-pink-50">
                      <Check className={`w-3 h-3 ${style.color}`} strokeWidth={4} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg leading-tight text-indigo-950 font-black pt-1">{trait}</p>
                  </div>
                </motion.li>
              )
            })}
          </ul>
        </div>

        {/* Actions */}
        <div className="w-full space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="w-full py-6 bg-gradient-to-r from-pink-400 via-rose-500 to-orange-500 rounded-[2rem] text-white font-black text-xl shadow-2xl flex items-center justify-center gap-3 relative group"
          >
            <Sparkles className="w-6 h-6" />
            <span>Ya, betul! Tunjuk hadiah</span>
            <div className="absolute right-6 -top-4 text-4xl drop-shadow-xl rotate-12 group-hover:rotate-0 transition-transform">
              🎁
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="w-full py-4 text-pink-500 font-black flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Kurang tepat, cuba lagi?</span>
          </motion.button>
        </div>

        {/* Trust Footer */}
        <div className="flex items-center justify-center space-x-2 mt-8 opacity-50">
          <ShieldCheck className="w-4 h-4 text-indigo-950" />
          <span className="text-[10px] font-black text-indigo-950 uppercase tracking-widest">
            100% selamat • Data anda dirahsiakan
          </span>
        </div>
      </motion.div>
    </div>
  )
}
