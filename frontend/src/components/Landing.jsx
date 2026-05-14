import { motion } from 'framer-motion'
import { Sparkles, Wand2, Users, Heart, Star, Gift, ShoppingBag, ChevronRight } from 'lucide-react'

export default function Landing({ onNext }) {
  const steps = [
    { icon: <Users className="w-7 h-7 text-pink-500" />, title: 'Kenali dia', desc: 'dengan ringkas', color: 'bg-pink-50' },
    { icon: <Star className="w-7 h-7 text-purple-500" />, title: 'Bintang dedah', desc: 'personaliti dia', color: 'bg-purple-50' },
    { icon: <Gift className="w-7 h-7 text-yellow-500" />, title: 'Terima 5 hadiah', desc: 'paling sesuai', color: 'bg-yellow-50' },
    { icon: <ShoppingBag className="w-7 h-7 text-indigo-500" />, title: 'Klik & beli', desc: 'di Shopee', color: 'bg-indigo-50' },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center w-full max-w-screen-xl mx-auto px-4 py-6 relative overflow-hidden">
      {/* Background Cloud Blobs */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="cloud-blob w-[600px] h-[600px] -left-48 top-1/4 animate-pulse opacity-60" />
        <div className="cloud-blob w-[800px] h-[800px] -right-64 bottom-0 opacity-80" />
        <div className="cloud-blob w-[400px] h-[400px] left-1/3 bottom-10 opacity-40" />
      </div>

      {/* Header Area */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-10 px-2 md:px-0 relative z-20">
        <div className="flex flex-col">
          <span className="text-3xl font-black text-indigo-950 leading-none tracking-tight">Hepi</span>
          <span className="text-[10px] font-black tracking-[0.3em] text-indigo-400 uppercase mt-0.5 ml-0.5">Besday</span>
        </div>
        
        <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-3 shadow-sm border border-white/50">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                <img src={`https://i.pravatar.cc/100?img=${i + 25}`} alt="user" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-indigo-900 leading-none whitespace-nowrap">10K+ dah jumpa hadiah best!</span>
          </div>
          <div className="w-7 h-7 bg-pink-100 rounded-full flex items-center justify-center shadow-inner">
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl flex flex-col items-center text-center relative z-10">
        {/* Sub-badge */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-md border border-pink-50 mb-8"
        >
          <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
          <span className="text-xs font-black text-pink-500 uppercase tracking-wide">Daripada Bintang, Untuk Dia</span>
          <Sparkles className="w-4 h-4 text-pink-300" />
        </motion.div>

        {/* Hero Headlines */}
        <div className="space-y-4 mb-6">
          <h1 className="text-5xl md:text-7xl font-black text-indigo-950 leading-[0.95] tracking-tight">
            Hadiah yang<br/>
            dia akan <span className="text-pink-500 relative">
              ingat
              <motion.div 
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -right-8 -top-4"
              >
                <Heart className="w-8 h-8 text-pink-400 fill-pink-400 opacity-60" />
              </motion.div>
            </span>
          </h1>
          <p className="text-slate-500 text-lg font-bold">
            <span className="text-pink-500">🎁 5 hadiah</span> paling sesuai, khas untuknya.
          </p>
        </div>

        {/* Center Visuals - NO MORE BOXES */}
        <div className="relative w-full max-w-lg aspect-square flex items-center justify-center mb-10">
          {/* Real 3D-feeling Glows */}
          <div className="absolute inset-0 bg-white/40 blur-[120px] rounded-full scale-75 z-0" />
          
          {/* Decorative floating assets with MASK to hide edges perfectly */}
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [-10, -15, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-4 top-1/4 z-0 w-24 h-24"
          >
            <div className="w-full h-full relative" style={{ maskImage: 'radial-gradient(circle, black 40%, transparent 95%)', WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 95%)' }}>
               <img src="/heart.png" className="w-full h-full object-contain mix-blend-multiply brightness-[1.05] contrast-[1.05]" alt="Heart Balloon" />
            </div>
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, 25, 0], rotate: [10, 5, 10] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute right-4 top-1/3 z-0 w-24 h-24"
          >
            <div className="w-full h-full relative" style={{ maskImage: 'radial-gradient(circle, black 40%, transparent 95%)', WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 95%)' }}>
              <img src="/bag.png" className="w-full h-full object-contain mix-blend-multiply brightness-[1.05] contrast-[1.05]" alt="Gift Bag" />
            </div>
          </motion.div>

          {/* Main 3D Box with aggressive mask and glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="relative z-10 w-80 h-80 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-pink-400/10 blur-[80px] rounded-full scale-100 z-0" />
            <div className="w-full h-full relative z-10" style={{ maskImage: 'radial-gradient(circle, black 55%, transparent 98%)', WebkitMaskImage: 'radial-gradient(circle, black 55%, transparent 98%)' }}>
              <img 
                src="/hero-box.png" 
                alt="Magic Gift Box" 
                className="w-full h-full object-contain mix-blend-multiply brightness-[1.02] contrast-[1.02]"
              />
            </div>
          </motion.div>
        </div>

        {/* Step Card Container */}
        <div className="w-full max-w-xl glass-card p-8 mb-10 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-4 group relative">
                <div className={`${step.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center relative shadow-lg shadow-black/5 transition-transform group-hover:scale-110`}>
                  {step.icon}
                  <div className="absolute -right-2 -top-2 w-6 h-6 bg-pink-500 text-white text-xs font-black rounded-full flex items-center justify-center border-2 border-white shadow-md">
                    {idx + 1}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[13px] font-black text-indigo-950 leading-tight">{step.title}</p>
                  <p className="text-[11px] font-bold text-slate-400">{step.desc}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-8 opacity-20 group-hover:opacity-40 transition-opacity">
                    <ChevronRight className="w-5 h-5 text-indigo-900" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button Section */}
        <div className="w-full max-w-md flex flex-col items-center gap-8 relative z-30">
          <motion.button
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className="w-full py-6 bg-gradient-to-r from-pink-400 via-rose-500 to-orange-500 rounded-[2rem] text-white font-black text-2xl shadow-[0_25px_50px_-12px_rgba(244,63,94,0.5)] flex items-center justify-center gap-4 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Wand2 className="w-7 h-7" />
            Mula Sekarang
            <ChevronRight className="w-7 h-7" />
          </motion.button>

          {/* Bottom Trust Indicators */}
          <div className="flex justify-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-purple-400 fill-purple-400" />
              100% Percuma
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-pink-400 fill-pink-400" />
              Cepat & Mudah
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-indigo-400 fill-indigo-400" />
              Selamat
            </div>
          </div>

          {/* Decorative Arrow and Text */}
          <motion.div 
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 pb-10"
          >
            <svg className="w-16 h-8 text-indigo-900/10 rotate-12" viewBox="0 0 50 20" fill="none" stroke="currentColor">
              <path d="M5 15C15 5 35 5 45 15" strokeWidth="3" strokeLinecap="round" />
              <path d="M40 8L45 15L40 22" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-black text-indigo-900/40 tracking-tight italic">
              Jom cari hadiah yang dia akan suka! 🥰
            </span>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom Puffy Clouds (Visual Decoration) */}
      <div className="absolute bottom-[-100px] left-0 right-0 h-[300px] pointer-events-none z-0 overflow-hidden">
        <div className="cloud-blob w-[400px] h-[400px] -left-20 bottom-0 opacity-100" />
        <div className="cloud-blob w-[600px] h-[600px] left-1/4 bottom-[-100px] opacity-100" />
        <div className="cloud-blob w-[500px] h-[500px] right-0 bottom-[-50px] opacity-100" />
      </div>
    </div>
  )
}
