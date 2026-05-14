import { motion } from 'framer-motion'
import { Sparkles, Wand2, Users, Heart, Star, Gift, ShoppingBag, ChevronRight } from 'lucide-react'

export default function Landing({ onNext }) {
  const steps = [
    { icon: <Users className="w-6 h-6 text-pink-500" />, title: 'Kenali dia', desc: 'dengan ringkas', color: 'bg-pink-50' },
    { icon: <Star className="w-6 h-6 text-purple-500" />, title: 'Bintang dedah', desc: 'personaliti dia', color: 'bg-purple-50' },
    { icon: <Gift className="w-6 h-6 text-yellow-500" />, title: 'Terima 5 hadiah', desc: 'paling sesuai', color: 'bg-yellow-50' },
    { icon: <ShoppingBag className="w-6 h-6 text-indigo-500" />, title: 'Klik & beli', desc: 'di Kedai', color: 'bg-indigo-50' },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-12">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-indigo-900 leading-tight">Hepi</span>
          <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Besday</span>
        </div>
        
        <div className="glass px-4 py-2 rounded-full flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
              </div>
            ))}
          </div>
          <span className="text-[10px] font-bold text-indigo-900/60 leading-none">
            10K+ dah jumpa<br/>hadiah best!
          </span>
          <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
            <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-6 mb-8 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 border border-pink-100 shadow-sm"
        >
          <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
          <span className="text-sm font-bold text-pink-500">Daripada Bintang, Untuk Dia</span>
          <Sparkles className="w-4 h-4 text-pink-300" />
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-bold text-slate-800 leading-[1.1]">
          Hadiah yang<br/>dia akan <span className="text-pink-500 relative">
            ingat
            <svg className="absolute -right-6 -top-2 w-6 h-6 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </span>
        </h1>

        <p className="text-slate-500 font-medium">
          <span className="text-pink-500">🎁 5 hadiah</span> paling sesuai, khas untuknya.
        </p>

        {/* 3D Visual Centerpiece */}
        <div className="relative py-12 flex justify-center">
          {/* Decorative floating elements */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-0 top-1/4 w-16 h-16 glass rounded-2xl flex items-center justify-center -rotate-12 shadow-lg"
          >
            <Gift className="w-8 h-8 text-pink-400" />
          </motion.div>
          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute right-0 top-1/2 w-14 h-14 glass rounded-full flex items-center justify-center rotate-12 shadow-lg"
          >
            <ShoppingBag className="w-7 h-7 text-purple-400" />
          </motion.div>
          
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-64 h-64 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-pink-300/30 blur-3xl rounded-full scale-75" />
            <img 
              src="/hero-box.png" 
              alt="Gift Surprise" 
              className="w-full h-full object-contain relative z-10"
            />
          </motion.div>
        </div>
      </div>

      {/* Steps Card */}
      <div className="w-full glass-card p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-3 relative">
              <div className={`${step.color} w-14 h-14 rounded-3xl flex items-center justify-center relative shadow-sm`}>
                {step.icon}
                <div className="absolute -right-1 -top-1 w-5 h-5 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {idx + 1}
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-800">{step.title}</p>
                <p className="text-[10px] font-medium text-slate-400">{step.desc}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-6 opacity-20">
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="w-full flex flex-col items-center gap-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="w-full py-5 bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 rounded-full text-white font-bold text-xl shadow-[0_20px_40px_-10px_rgba(251,113,133,0.5)] flex items-center justify-center gap-3 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
          <Wand2 className="w-6 h-6" />
          Mula Sekarang
          <ChevronRight className="w-6 h-6" />
        </motion.button>

        {/* Footer info */}
        <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold text-slate-400">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-md bg-purple-100 flex items-center justify-center">
              <Star className="w-2.5 h-2.5 text-purple-500 fill-purple-500" />
            </div>
            100% Percuma
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-md bg-pink-100 flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-pink-500 fill-pink-500" />
            </div>
            Cepat & Mudah
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-md bg-indigo-100 flex items-center justify-center">
              <Heart className="w-2.5 h-2.5 text-indigo-500 fill-indigo-500" />
            </div>
            Selamat
          </div>
        </div>

        <motion.div 
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-1"
        >
          <svg className="w-12 h-6 text-indigo-900/20 rotate-12" viewBox="0 0 50 20" fill="none" stroke="currentColor">
            <path d="M5 15C15 5 35 5 45 15" strokeWidth="2" strokeLinecap="round"/>
            <path d="M40 10L45 15L40 20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[10px] font-medium text-indigo-900/60">
            Jom cari hadiah yang dia akan suka! 🥰
          </span>
        </motion.div>
      </div>
    </div>
  )
}
