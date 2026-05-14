import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { Sparkles, Wand2, Users, Heart, Star, Gift, ShoppingBag, ChevronRight } from 'lucide-react'

export default function Landing({ onNext }) {
  const { scrollYProgress } = useScroll()

  // Animation values - Calibrated to reach final state at exactly 80% scroll
  const boxScale = useTransform(scrollYProgress, [0, 0.8], [1, 1.35])
  const closedOpacity = useTransform(scrollYProgress, [0.25, 0.45], [1, 0])
  const openOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1])
  const qMarkY = useTransform(scrollYProgress, [0.5, 0.8], [50, -100])
  const qMarkScale = useTransform(scrollYProgress, [0.5, 0.75], [0, 1.1])
  const qMarkOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1])
  
  // Hero text fades out as animation progresses
  const contentOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])
  const footerY = useTransform(scrollYProgress, [0.65, 0.8], [80, 0])
  const footerOpacity = useTransform(scrollYProgress, [0.65, 0.8], [0, 1])

  const steps = [
    { icon: <Users className="w-7 h-7 text-pink-500" />, title: 'Kenali dia', desc: 'dengan ringkas', color: 'bg-pink-50' },
    { icon: <Star className="w-7 h-7 text-purple-500" />, title: 'Bintang dedah', desc: 'personaliti dia', color: 'bg-purple-50' },
    { icon: <Gift className="w-7 h-7 text-yellow-500" />, title: 'Terima 5 hadiah', desc: 'paling sesuai', color: 'bg-yellow-50' },
    { icon: <ShoppingBag className="w-7 h-7 text-indigo-500" />, title: 'Klik & beli', desc: 'di Shopee', color: 'bg-indigo-50' },
  ]

  return (
    <div className="relative w-full">
      {/* Tall container to provide scroll height */}
      <div className="h-[250vh]">
        {/* Sticky Container - This holds everything in place while scrolling */}
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
          
          {/* Background Cloud Blobs */}
          <div className="absolute inset-0 pointer-events-none -z-10">
            <div className="cloud-blob w-[600px] h-[600px] -left-48 top-1/4 animate-pulse opacity-60" />
            <div className="cloud-blob w-[800px] h-[800px] -right-64 bottom-0 opacity-80" />
          </div>

          {/* Top Layer: Header & Hero (Fade Out) */}
          <motion.div 
            style={{ opacity: contentOpacity }}
            className="absolute top-0 left-0 right-0 pt-6 px-6 z-40 flex flex-col items-center pointer-events-none"
          >
            <div className="w-full max-w-4xl flex justify-between items-center mb-10">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-indigo-950 leading-none">Hepi</span>
                <span className="text-[10px] font-black tracking-[0.3em] text-indigo-400 uppercase mt-0.5 ml-0.5">Besday</span>
              </div>
              <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-3 shadow-sm border border-white/50">
                <span className="text-[10px] font-extrabold text-indigo-900 leading-none">10K+ dah jumpa hadiah!</span>
              </div>
            </div>

            <div className="flex flex-col items-center text-center max-w-xl">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-md border border-pink-50 mb-6">
                <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                <span className="text-xs font-black text-pink-500 uppercase tracking-wide">Daripada Bintang, Untuk Dia</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-indigo-950 leading-[0.95] tracking-tight mb-4">
                Hadiah yang<br/>dia akan <span className="text-pink-500">ingat</span>
              </h1>
              <motion.div 
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-slate-400 font-bold flex flex-col items-center gap-2"
              >
                <span>Scroll ke bawah</span>
                <div className="w-1 h-8 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ y: [-32, 32] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-full h-1/2 bg-pink-400"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Middle Layer: Animation Area (Zoom & Open) */}
          <div className="relative z-20 flex items-center justify-center w-full h-full pointer-events-none">
            <motion.div
              style={{ scale: boxScale }}
              className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-pink-400/20 blur-[100px] rounded-full scale-110 z-0" />

              {/* Question Mark */}
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
                <img src="/q-mark.png" className="w-full h-full object-contain mix-blend-multiply brightness-[1.15] contrast-[1.1]" alt="?" />
              </motion.div>

              {/* Closed Box */}
              <motion.div
                style={{ 
                  opacity: closedOpacity,
                  maskImage: 'radial-gradient(circle, black 60%, transparent 98%)',
                  WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 98%)'
                }}
                className="absolute inset-0 z-20 flex items-center justify-center"
              >
                <img src="/box-closed.png" className="w-full h-full object-contain mix-blend-multiply brightness-[1.08]" alt="Closed Box" />
              </motion.div>

              {/* Open Box */}
              <motion.div
                style={{ 
                  opacity: openOpacity,
                  maskImage: 'radial-gradient(circle, black 60%, transparent 98%)',
                  WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 98%)'
                }}
                className="absolute inset-0 z-10 flex items-center justify-center"
              >
                <img src="/box-open.png" className="w-full h-full object-contain mix-blend-multiply brightness-[1.08]" alt="Open Box" />
              </motion.div>
            </motion.div>

            {/* Floating assets - Only visible at start */}
            <motion.div 
              style={{ opacity: contentOpacity }}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-20 h-20"
            >
              <div className="w-full h-full relative" style={{ maskImage: 'radial-gradient(circle, black 40%, transparent 90%)' }}>
                <img src="/heart.png" className="w-full h-full object-contain mix-blend-multiply brightness-[1.08] contrast-[1.1] animate-float-slow" alt="Heart" />
              </div>
            </motion.div>
            <motion.div 
              style={{ opacity: contentOpacity }}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-20 h-20"
            >
              <div className="w-full h-full relative" style={{ maskImage: 'radial-gradient(circle, black 40%, transparent 90%)' }}>
                <img src="/bag.png" className="w-full h-full object-contain mix-blend-multiply brightness-[1.08] contrast-[1.1] animate-float-slow" alt="Bag" />
              </div>
            </motion.div>
          </div>

          {/* Bottom Layer: Footer (Fade In) */}
          <motion.div 
            style={{ y: footerY, opacity: footerOpacity }}
            className="absolute bottom-0 left-0 right-0 px-6 pb-12 flex flex-col items-center z-50 pointer-events-auto"
          >
            {/* Steps Card */}
            <div className="w-full max-w-2xl glass-card p-5 mb-6">
              <div className="grid grid-cols-4 gap-2">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center space-y-1">
                    <div className={`${step.color} w-10 h-10 rounded-xl flex items-center justify-center relative shadow-sm`}>
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
              className="w-full max-w-sm py-5 bg-gradient-to-r from-pink-400 via-rose-500 to-orange-500 rounded-3xl text-white font-black text-xl shadow-xl flex items-center justify-center gap-4"
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
