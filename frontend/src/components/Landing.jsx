import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { Sparkles, Wand2, Users, Heart, Star, Gift, ShoppingBag, ChevronRight } from 'lucide-react'

export default function Landing({ onNext }) {
  const { scrollYProgress } = useScroll()
  const [isFinished, setIsFinished] = useState(false)

  // Track progress and lock state at the end
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.75) {
      setIsFinished(true)
    } else {
      setIsFinished(false)
    }
  })

  // Animation values - Accelerated to finish comfortably before the end
  const boxScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.25])
  const closedOpacity = useTransform(scrollYProgress, [0.1, 0.2], [1, 0])
  const openOpacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1])
  const qMarkY = useTransform(scrollYProgress, [0.25, 0.5], [50, -100])
  const qMarkScale = useTransform(scrollYProgress, [0.25, 0.45], [0, 1.1])
  const qMarkOpacity = useTransform(scrollYProgress, [0.25, 0.4], [0, 1])
  
  // Fade out hero text
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  
  // Footer reveal
  const footerY = useTransform(scrollYProgress, [0.4, 0.6], [100, 0])
  const footerOpacity = useTransform(scrollYProgress, [0.4, 0.55], [0, 1])

  const steps = [
    { icon: <Users className="w-7 h-7 text-pink-500" />, title: 'Kenali dia', desc: 'dengan ringkas', color: 'bg-pink-50' },
    { icon: <Star className="w-7 h-7 text-purple-500" />, title: 'Bintang dedah', desc: 'personaliti dia', color: 'bg-purple-50' },
    { icon: <Gift className="w-7 h-7 text-yellow-500" />, title: 'Terima 5 hadiah', desc: 'paling sesuai', color: 'bg-yellow-50' },
    { icon: <ShoppingBag className="w-7 h-7 text-indigo-500" />, title: 'Klik & beli', desc: 'di Shopee', color: 'bg-indigo-50' },
  ]

  return (
    <div className="relative w-full">
      {/* 1. HERO LAYER (Static at top) */}
      <div className="h-screen w-full flex flex-col items-center justify-start pt-20 px-6 absolute top-0 pointer-events-none z-40">
        <motion.div style={{ opacity: heroOpacity }} className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-md border border-pink-50 mb-8">
            <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
            <span className="text-xs font-black text-pink-500 uppercase tracking-wide">Daripada Bintang, Untuk Dia</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-indigo-950 leading-[0.95] tracking-tight mb-6">
            Hadiah yang<br/>dia akan <span className="text-pink-500">ingat</span>
          </h1>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-slate-400 font-bold">
            Scroll ke bawah ✨
          </motion.div>
        </motion.div>
      </div>

      {/* 2. SCROLLABLE AREA */}
      <div className="h-[300vh] w-full relative">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
          
          {/* Background Blobs */}
          <div className="absolute inset-0 -z-10">
            <div className="cloud-blob w-[600px] h-[600px] -left-48 top-1/4 animate-pulse opacity-40" />
            <div className="cloud-blob w-[800px] h-[800px] -right-64 bottom-0 opacity-60" />
          </div>

          {/* BOX ANIMATION */}
          <motion.div style={{ scale: boxScale }} className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
            {/* Question Mark */}
            <motion.div
              style={{ y: qMarkY, scale: qMarkScale, opacity: qMarkOpacity }}
              className="absolute z-30 w-32 h-32"
            >
              <img src="/q-mark.png" className="w-full h-full object-contain mix-blend-multiply" alt="?" />
            </motion.div>

            {/* Closed Box */}
            <motion.div style={{ opacity: closedOpacity }} className="absolute inset-0 z-20">
              <img src="/box-closed.png" className="w-full h-full object-contain mix-blend-multiply" alt="Closed Box" />
            </motion.div>

            {/* Open Box */}
            <motion.div style={{ opacity: openOpacity }} className="absolute inset-0 z-10">
              <img src="/box-open.png" className="w-full h-full object-contain mix-blend-multiply" alt="Open Box" />
            </motion.div>
          </motion.div>

          {/* FOOTER LAYER (Fades in) */}
          <motion.div 
            style={{ y: footerY, opacity: footerOpacity }}
            className="absolute bottom-10 left-0 right-0 px-6 flex flex-col items-center z-50"
          >
            <div className="w-full max-w-2xl glass-card p-5 mb-6 shadow-2xl">
              <div className="grid grid-cols-4 gap-2">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center space-y-1">
                    <div className={`${step.color} w-10 h-10 rounded-xl flex items-center justify-center shadow-sm`}>
                      {step.icon}
                    </div>
                    <p className="text-[9px] font-black text-indigo-950 leading-tight">{step.title}</p>
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="w-full max-w-sm py-5 bg-gradient-to-r from-pink-400 via-rose-500 to-orange-500 rounded-3xl text-white font-black text-xl shadow-2xl flex items-center justify-center gap-4"
            >
              <Wand2 className="w-6 h-6" />
              Mula Sekarang
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
