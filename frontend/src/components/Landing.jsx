import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { Sparkles, Wand2, Users, Heart, Star, Gift, ShoppingBag, ChevronRight, MousePointer2 } from 'lucide-react'

export default function Landing({ onNext }) {
  const { scrollYProgress } = useScroll()
  const [scrollPct, setScrollPct] = useState(0)

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollPct(Math.round(latest * 100))
  })

  // SUPER AGGRESSIVE TIMING - Completes at 40% scroll
  const boxScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.25])
  const closedOpacity = useTransform(scrollYProgress, [0.05, 0.2], [1, 0])
  const openOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1])
  const qMarkY = useTransform(scrollYProgress, [0.2, 0.45], [50, -100])
  const qMarkScale = useTransform(scrollYProgress, [0.2, 0.4], [0, 1.1])
  const qMarkOpacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1])
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const footerY = useTransform(scrollYProgress, [0.3, 0.5], [60, 0])
  const footerOpacity = useTransform(scrollYProgress, [0.3, 0.45], [0, 1])

  const steps = [
    { icon: <Users className="w-7 h-7 text-pink-500" />, title: 'Kenali dia', color: 'bg-pink-50' },
    { icon: <Star className="w-7 h-7 text-purple-500" />, title: 'Bintang dedah', color: 'bg-purple-50' },
    { icon: <Gift className="w-7 h-7 text-yellow-500" />, title: 'Terima 5 hadiah', color: 'bg-yellow-50' },
    { icon: <ShoppingBag className="w-7 h-7 text-indigo-500" />, title: 'Klik & beli', color: 'bg-indigo-50' },
  ]

  return (
    <div className="relative w-full bg-[#FDFCF0]">
      {/* DEBUG - Persistent but subtle */}
      <div className="fixed top-2 right-2 z-[100] bg-black/10 px-2 py-1 rounded text-[10px] font-mono">
        {scrollPct}%
      </div>

      {/* 1. FIXED HERO (Fades out) */}
      <div className="fixed top-0 left-0 right-0 h-screen flex flex-col items-center justify-start pt-16 px-6 z-40 pointer-events-none">
        <motion.div style={{ opacity: heroOpacity }} className="flex flex-col items-center text-center">
          <div className="flex flex-col mb-12">
            <span className="text-4xl font-black text-indigo-950 leading-none">Hepi</span>
            <span className="text-[12px] font-black tracking-[0.3em] text-indigo-400 uppercase mt-1">Besday</span>
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-md border border-pink-50 mb-8">
            <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
            <span className="text-xs font-black text-pink-500 uppercase tracking-wide">Daripada Bintang, Untuk Dia</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-indigo-950 leading-[0.95] tracking-tight mb-8">
            Hadiah yang<br/>dia akan <span className="text-pink-500">ingat</span>
          </h1>
          
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-3 text-slate-400"
          >
            <span className="text-sm font-bold">Skrol ke bawah sikit...</span>
            <div className="w-6 h-10 border-2 border-slate-200 rounded-full flex justify-center pt-2">
              <motion.div 
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-pink-400 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* 2. SCROLL CONTENT */}
      <div className="relative h-[200vh]">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
          
          {/* Background */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-white/50 to-white/80">
            <div className="cloud-blob w-[500px] h-[500px] -left-20 top-1/4 opacity-30" />
            <div className="cloud-blob w-[700px] h-[700px] -right-40 bottom-0 opacity-40" />
          </div>

          {/* BOX LAYER */}
          <motion.div 
            style={{ scale: boxScale }}
            className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center z-20"
          >
            <div className="absolute inset-0 bg-pink-400/10 blur-[100px] rounded-full" />
            
            <motion.div style={{ y: qMarkY, scale: qMarkScale, opacity: qMarkOpacity }} className="absolute z-30 w-32 h-32">
              <img src="/q-mark.png" className="w-full h-full object-contain mix-blend-multiply" alt="?" />
            </motion.div>

            <motion.div style={{ opacity: closedOpacity }} className="absolute inset-0 z-20">
              <img src="/box-closed.png" className="w-full h-full object-contain mix-blend-multiply" alt="Closed Box" />
            </motion.div>

            <motion.div style={{ opacity: openOpacity }} className="absolute inset-0 z-10">
              <img src="/box-open.png" className="w-full h-full object-contain mix-blend-multiply" alt="Open Box" />
            </motion.div>
          </motion.div>

          {/* FOOTER LAYER */}
          <motion.div 
            style={{ y: footerY, opacity: footerOpacity }}
            className="absolute bottom-12 left-0 right-0 px-6 flex flex-col items-center z-50"
          >
            <div className="w-full max-w-xl glass-card p-5 mb-6 shadow-2xl">
              <div className="grid grid-cols-4 gap-3">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center space-y-2">
                    <div className={`${step.color} w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm`}>
                      {step.icon}
                    </div>
                    <p className="text-[10px] font-black text-indigo-950 leading-tight">{step.title}</p>
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="w-full max-w-sm py-5 bg-gradient-to-r from-pink-400 via-rose-500 to-orange-500 rounded-3xl text-white font-black text-xl shadow-2xl flex items-center justify-center gap-4 pointer-events-auto"
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
