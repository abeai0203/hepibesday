import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Wand2, Users, Star, Gift, ShoppingBag, ChevronRight, ChevronDown } from 'lucide-react'
const Sparkle = ({ className, delay = 0 }) => (
  <motion.div
    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.9, 0.2] }}
    transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
    className={`absolute ${className}`}
  >
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-yellow-300 text-yellow-300">
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
    </svg>
  </motion.div>
)

export default function Landing({ onNext }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll()
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const boxScale = useTransform(smoothProgress, [0, 0.5], [1, 1.3])
  const closedOpacity = useTransform(smoothProgress, [0.05, 0.25], [1, 0])
  const openOpacity = useTransform(smoothProgress, [0.2, 0.4], [0, 1])
  const qMarkY = useTransform(smoothProgress, [0.3, 0.5], [110, -20])
  const qMarkScale = useTransform(smoothProgress, [0.3, 0.5], [0, 1.1])
  const qMarkOpacity = useTransform(smoothProgress, [0.3, 0.45], [0, 1])
  
  const title1Opacity = useTransform(smoothProgress, [0, 0.2], [1, 0])
  const title2Opacity = useTransform(smoothProgress, [0.3, 0.5], [0, 1])
  
  const footerY = useTransform(smoothProgress, [0.4, 0.6], [80, 0])
  const footerOpacity = useTransform(smoothProgress, [0.4, 0.6], [0, 1])

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight * 0.8,
      behavior: 'smooth'
    })
  }

  const steps = [
    { icon: <Users className="w-7 h-7 text-pink-500" />, title: 'Kenali dia', color: 'bg-pink-50' },
    { icon: <Star className="w-7 h-7 text-purple-500" />, title: 'Bintang dedah', color: 'bg-purple-50' },
    { icon: <Gift className="w-7 h-7 text-yellow-500" />, title: 'Terima 5 hadiah', color: 'bg-yellow-50' },
    { icon: <ShoppingBag className="w-7 h-7 text-indigo-500" />, title: 'Klik & beli', color: 'bg-indigo-50' },
  ]

  return (
    <div className="w-full bg-[#FFFDF9]">
      <div className="h-[200vh] w-full relative">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-between overflow-hidden">
          
          {/* Lavender-Pink-Cream Gradient Background */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#E2D6FF] via-[#F8DBFF] to-[#FFFDF9]">
            
            {/* Dreamy Cloud Elements */}
            <div className="absolute top-[20%] -left-16 w-72 h-36 bg-white/60 blur-[40px] rounded-full pointer-events-none" />
            <div className="absolute top-[35%] -right-24 w-80 h-40 bg-white/50 blur-[30px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[20%] -left-20 w-80 h-40 bg-white/60 blur-[35px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[5%] -right-16 w-72 h-36 bg-white/70 blur-[30px] rounded-full pointer-events-none" />
            
            {/* Pulsing Sparkles (Star Graphics) */}
            <Sparkle className="top-[15%] left-[25%]" delay={0} />
            <Sparkle className="top-[45%] right-[20%]" delay={1.5} />
            <Sparkle className="top-[60%] left-[15%]" delay={0.8} />
            <Sparkle className="top-[25%] right-[30%]" delay={2.2} />
          </div>

          {/* Social Proof Avatars / Bubble Element */}
          <div className="absolute top-6 right-6 z-50 hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-white/70 backdrop-blur-md border border-white/50 shadow-lg shadow-purple-500/5 rounded-full pointer-events-auto">
            <div className="flex -space-x-2">
              <img className="w-6 h-6 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="" />
              <img className="w-6 h-6 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="" />
              <img className="w-6 h-6 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-black text-indigo-950/80">10K+</span>
              <div className="w-4.5 h-4.5 rounded-full bg-pink-100/80 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-pink-500 text-pink-500">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Floating/Flying 3D Graphics (.webp format) */}
          <motion.div
            animate={{ y: [-12, 12, -12] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-6 md:left-20 top-[22%] z-0 w-16 h-16 md:w-26 md:h-26 opacity-80 pointer-events-none"
          >
            <img src="/box-closed.webp" className="w-full h-full object-contain" alt="" />
          </motion.div>

          <motion.div
            animate={{ y: [12, -12, 12] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-6 md:right-24 top-[18%] z-0 w-14 h-14 md:w-22 md:h-22 opacity-85 pointer-events-none"
          >
            <img src="/heart.webp" className="w-full h-full object-contain" alt="" />
          </motion.div>

          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-8 md:right-32 top-[60%] z-0 w-16 h-16 md:w-24 md:h-24 opacity-80 pointer-events-none"
          >
            <img src="/bag.webp" className="w-full h-full object-contain" alt="" />
          </motion.div>

          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-8 md:left-24 top-[65%] z-0 w-14 h-14 md:w-22 md:h-22 opacity-75 pointer-events-none"
          >
            <img src="/box-open.webp" className="w-full h-full object-contain" alt="" />
          </motion.div>

          <div className="w-full flex flex-col items-center text-center pt-6 md:pt-12 px-6 z-40 pointer-events-none">
            <div className="w-24 md:w-32 mb-2 md:mb-4 overflow-hidden flex items-center justify-center">
              <img 
                src="/logo.png" 
                className="w-full h-full object-contain mix-blend-multiply brightness-[1.05] contrast-[1.1]" 
                alt="Logo"
                style={{
                  maskImage: 'radial-gradient(circle, black 80%, transparent 100%)',
                  WebkitMaskImage: 'radial-gradient(circle, black 80%, transparent 100%)'
                }}
              />
            </div>

            <div className="relative w-full h-36 md:h-48 flex items-center justify-center mt-4 md:mt-6">
              <motion.div style={{ opacity: title1Opacity }} className="absolute inset-0 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 rounded-full bg-white shadow-md border border-pink-50 mb-3 md:mb-6">
                  <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-400 fill-orange-400" />
                  <span className="text-[10px] md:text-xs font-black text-pink-500 uppercase tracking-wide">Pening pilih hadiah?</span>
                </div>
                <h1 className="text-[42px] md:text-6xl font-black text-indigo-950 leading-[0.95] tracking-tight mb-4">
                  Sedang mencari<br/><span className="text-pink-500">hadiah?</span>
                </h1>
              </motion.div>

              <motion.div style={{ opacity: title2Opacity }} className="absolute inset-0 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 rounded-full bg-white shadow-md border border-pink-50 mb-3 md:mb-6">
                  <Wand2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-pink-500" />
                  <span className="text-[10px] md:text-xs font-black text-pink-500 uppercase tracking-wide">Kami Sedia Membantu</span>
                </div>
                <h1 className="text-[42px] md:text-6xl font-black text-indigo-950 leading-[0.95] tracking-tight">
                  Kami akan<br/><span className="text-pink-500">bantu anda!</span>
                </h1>
              </motion.div>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 pt-20 md:pt-32">
            <motion.div style={{ scale: boxScale }} className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
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
                <img src="/q-mark.webp" className="w-full h-full object-contain brightness-[1.1] contrast-[1.1]" alt="?" />
              </motion.div>

              <motion.div 
                style={{ opacity: closedOpacity }} 
                onClick={handleScrollDown}
                className="absolute inset-0 z-20 pointer-events-auto cursor-pointer"
              >
                <img src="/box-closed.webp" className="w-full h-full object-contain" alt="Closed Box" />
              </motion.div>

              <motion.div style={{ opacity: openOpacity }} className="absolute inset-0 z-10">
                <img src="/box-open.webp" className="w-full h-full object-contain" alt="Open Box" />
              </motion.div>

              {/* Enhanced Scroll Indicator */}
              <motion.div 
                style={{ opacity: title1Opacity }}
                onClick={handleScrollDown}
                className="absolute -bottom-24 md:-bottom-32 flex flex-col items-center gap-2 pointer-events-auto cursor-pointer"
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-10 h-10 bg-white rounded-full shadow-lg border border-pink-50 flex items-center justify-center"
                >
                  <ChevronDown className="w-6 h-6 text-pink-500" />
                </motion.div>
                <span className="text-indigo-950/40 font-black text-[10px] md:text-xs tracking-[0.2em] uppercase">
                  .. skrol ke bawah ..
                </span>
              </motion.div>
            </motion.div>
          </div>

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
              className="w-full max-sm py-5 bg-gradient-to-r from-pink-400 via-rose-500 to-orange-500 rounded-3xl text-white font-black text-xl shadow-2xl flex items-center justify-center gap-4 pointer-events-auto"
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
// dummy
