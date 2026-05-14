import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Wand2, Users, Star, Gift, ShoppingBag, ChevronRight } from 'lucide-react'

export default function Landing({ onNext }) {
  const containerRef = useRef(null)
  
  // Track scroll of the WHOLE PAGE for maximum reliability
  const { scrollYProgress } = useScroll()
  
  // Use a spring to smooth out the values (helps with jittery mobile scrolling)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // TIMING: Complete everything by 50% scroll. 
  // 0.0 -> 0.5 is the magic window.
  const boxScale = useTransform(smoothProgress, [0, 0.5], [1, 1.3])
  const closedOpacity = useTransform(smoothProgress, [0.05, 0.25], [1, 0])
  const openOpacity = useTransform(smoothProgress, [0.2, 0.4], [0, 1])
  const qMarkY = useTransform(smoothProgress, [0.3, 0.5], [40, -100])
  const qMarkScale = useTransform(smoothProgress, [0.3, 0.5], [0, 1.1])
  const qMarkOpacity = useTransform(smoothProgress, [0.3, 0.45], [0, 1])
  
  // Dynamic Captions Opacity
  const title1Opacity = useTransform(smoothProgress, [0, 0.2], [1, 0])
  const title2Opacity = useTransform(smoothProgress, [0.3, 0.5], [0, 1])

  const steps = [
    { icon: <Users className="w-7 h-7 text-pink-500" />, title: 'Kenali dia', color: 'bg-pink-50' },
    { icon: <Star className="w-7 h-7 text-purple-500" />, title: 'Bintang dedah', color: 'bg-purple-50' },
    { icon: <Gift className="w-7 h-7 text-yellow-500" />, title: 'Terima 5 hadiah', color: 'bg-yellow-50' },
    { icon: <ShoppingBag className="w-7 h-7 text-indigo-500" />, title: 'Klik & beli', color: 'bg-indigo-50' },
  ]

  return (
    <div className="w-full bg-[#FDFCF0]">
      {/* 1. SCROLLABLE TRACKER */}
      <div className="h-[200vh] w-full relative">
        
        {/* 2. STICKY CONTENT */}
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-between overflow-hidden">
          
          {/* Background Blobs */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#FDFCF0] to-white">
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-pink-100/30 blur-[120px] rounded-full" />
            <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-purple-100/30 blur-[120px] rounded-full" />
          </div>

          {/* Header & Hero Area */}
          <div className="w-full flex flex-col items-center text-center pt-10 px-6 z-40 pointer-events-none">
            <div className="flex flex-col mb-10">
              <span className="text-4xl font-black text-indigo-950 leading-none">Hepi</span>
              <span className="text-[12px] font-black tracking-[0.3em] text-indigo-400 uppercase mt-1">Besday</span>
            </div>

            <div className="relative w-full flex flex-col items-center">
              {/* Initial Caption */}
              <motion.div style={{ opacity: title1Opacity }} className="absolute top-0">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-md border border-pink-50 mb-6">
                  <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                  <span className="text-xs font-black text-pink-500 uppercase tracking-wide">Pening pilih hadiah?</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-indigo-950 leading-[0.95] tracking-tight mb-6">
                  Sedang mencari<br/><span className="text-pink-500">hadiah?</span>
                </h1>
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-slate-400 font-bold text-sm">
                  Skrol ke bawah... ✨
                </motion.div>
              </motion.div>

              {/* Final Caption */}
              <motion.div style={{ opacity: title2Opacity }} className="absolute top-0">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-md border border-pink-50 mb-6">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  <span className="text-xs font-black text-pink-500 uppercase tracking-wide">Kami Sedia Membantu</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-indigo-950 leading-[0.95] tracking-tight">
                  Kami akan<br/><span className="text-pink-500">bantu anda!</span>
                </h1>
              </motion.div>
            </div>
          </div>

          {/* Animation Area (Center) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <motion.div style={{ scale: boxScale }} className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
              <div className="absolute inset-0 bg-pink-400/10 blur-[100px] rounded-full" />
              
              <motion.div 
                style={{ 
                  y: qMarkY, 
                  scale: qMarkScale, 
                  opacity: qMarkOpacity,
                  maskImage: 'radial-gradient(circle, black 50%, transparent 95%)',
                  WebkitMaskImage: 'radial-gradient(circle, black 50%, transparent 95%)'
                }} 
                className="absolute z-30 w-32 h-32"
              >
                <img src="/q-mark.png" className="w-full h-full object-contain mix-blend-multiply brightness-[1.1] contrast-[1.1]" alt="?" />
              </motion.div>

              <motion.div style={{ opacity: closedOpacity }} className="absolute inset-0 z-20">
                <img src="/box-closed.png" className="w-full h-full object-contain mix-blend-multiply brightness-[1.05]" alt="Closed Box" />
              </motion.div>

              <motion.div style={{ opacity: openOpacity }} className="absolute inset-0 z-10">
                <img src="/box-open.png" className="w-full h-full object-contain mix-blend-multiply brightness-[1.05]" alt="Open Box" />
              </motion.div>
            </motion.div>
          </div>

          {/* Footer Area (Bottom) */}
          <motion.div 
            style={{ y: footerY, opacity: footerOpacity }}
            className="w-full max-w-xl px-6 pb-10 flex flex-col items-center z-50"
          >
            <div className="w-full glass-card p-5 mb-6 shadow-xl">
              <div className="grid grid-cols-4 gap-2">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center space-y-1">
                    <div className={`${step.color} w-11 h-11 rounded-xl flex items-center justify-center shadow-sm`}>
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
              className="w-full py-5 bg-gradient-to-r from-pink-400 via-rose-500 to-orange-500 rounded-3xl text-white font-black text-xl shadow-2xl flex items-center justify-center gap-4 pointer-events-auto"
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
