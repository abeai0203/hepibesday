import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion'
import { Wand2, Users, Star, Gift, ShoppingBag, ChevronRight, ChevronDown } from 'lucide-react'

export default function Landing({ onNext }) {
  const [confetti, setConfetti] = useState([])
  const containerRef = useRef(null)
  const hasTriggeredConfetti = useRef(false)
  const [showCounter, setShowCounter] = useState(false)
  const [count, setCount] = useState(345000)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCounter(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!showCounter) return
    
    let start = 345000
    const end = 345688
    const duration = 2000 // 2 seconds
    const startTime = performance.now()

    const animate = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = progress * (2 - progress) // Ease out quad
      const currentCount = Math.floor(start + (end - start) * easeProgress)
      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [showCounter])

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

  const triggerConfetti = () => {
    // Generate confetti particles
    const newParticles = Array.from({ length: 120 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2
      // Much higher velocity for wide-range scatter
      const velocity = 100 + Math.random() * 500
      const destinationX = Math.cos(angle) * velocity
      // Upward force bias so they shoot up first
      const destinationY = Math.sin(angle) * velocity - 150
      // Finer sizes (3px to 8px)
      const size = 3 + Math.random() * 5
      const colors = ['#ec4899', '#a855f7', '#f97316', '#eab308', '#3b82f6', '#10b981', '#ff2e93', '#d946ef']
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      return {
        id: Date.now() + i + Math.random(),
        x: destinationX,
        y: destinationY,
        color,
        // Make rectangular aspect ratios (4-segi)
        width: size,
        height: size * (0.4 + Math.random() * 1.0),
        rotate: Math.random() * 360,
        rotateX: Math.random() * 360,
        rotateY: Math.random() * 360,
      }
    })
    setConfetti(newParticles)
    
    // Auto clear to avoid DOM clutter (aligned with 2.5s duration)
    setTimeout(() => {
      setConfetti([])
    }, 2800)
  }

  const handleScrollDown = () => {
    if (!hasTriggeredConfetti.current) {
      hasTriggeredConfetti.current = true
      triggerConfetti()
    }

    window.scrollTo({
      top: window.innerHeight * 0.8,
      behavior: 'smooth'
    })
  }

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.15) {
      if (!hasTriggeredConfetti.current) {
        hasTriggeredConfetti.current = true
        triggerConfetti()
      }
    } else {
      // Reset trigger state when user scrolls back to top
      hasTriggeredConfetti.current = false
    }
  })

  const steps = [
    { icon: <Users className="w-7 h-7 text-pink-500" />, title: 'Kenali dia', color: 'bg-pink-50' },
    { icon: <Star className="w-7 h-7 text-purple-500" />, title: 'Personaliti', color: 'bg-purple-50' },
    { icon: <Gift className="w-7 h-7 text-yellow-500" />, title: 'Cadangan', color: 'bg-yellow-50' },
    { icon: <ShoppingBag className="w-7 h-7 text-indigo-500" />, title: 'Beli!', color: 'bg-indigo-50' },
  ]

  return (
    <div className="w-full bg-[#FDFCF0]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');
        
        .font-handwriting {
          font-family: 'Caveat', cursive;
        }

        @keyframes wiggle-gift {
          0%, 85%, 100% { transform: rotate(0deg) scale(1); }
          87% { transform: rotate(-4deg) scale(1.02); }
          90% { transform: rotate(4deg) scale(1.02); }
          93% { transform: rotate(-4deg) scale(1.02); }
          96% { transform: rotate(3deg) scale(1.02); }
          98% { transform: rotate(0deg) scale(1); }
        }
        .gift-wiggle {
          animation: wiggle-gift 3.5s infinite ease-in-out;
          transform-origin: bottom center;
        }
        .gift-wiggle:hover {
          animation-play-state: paused;
          transform: scale(1.06) !important;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
      <div className="h-[200vh] w-full relative">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-between overflow-hidden">
          
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#FDFCF0] to-white">
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-pink-100/30 blur-[120px] rounded-full" />
            <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-purple-100/30 blur-[120px] rounded-full" />
          </div>

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
                  Korang sedang<br/>cari <span className="text-pink-500">hadiah?</span>
                </h1>
              </motion.div>
 
              <motion.div style={{ opacity: title2Opacity }} className="absolute inset-0 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 rounded-full bg-white shadow-md border border-pink-50 mb-3 md:mb-6">
                  <Wand2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-pink-500" />
                  <span className="text-[10px] md:text-xs font-black text-pink-500 uppercase tracking-wide">Kami Sedia Membantu</span>
                </div>
                <h1 className="text-[42px] md:text-6xl font-black text-indigo-950 leading-[0.95] tracking-tight">
                  Meh kami<br/><span className="text-pink-500">bantu!</span>
                </h1>
              </motion.div>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 pt-20 md:pt-32">
            <motion.div style={{ scale: boxScale }} className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
              {/* Confetti Particles */}
              {confetti.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, scale: 1, rotate: 0, rotateX: 0, rotateY: 0, opacity: 1 }}
                  animate={{ 
                    x: p.x, 
                    // Physics gravity curve: shoots out then falls down gracefully
                    y: [0, p.y * 0.6, p.y, p.y + 400], 
                    scale: [1, 1.2, 1, 0.8, 0], 
                    rotate: p.rotate + 720,
                    rotateX: p.rotateX + 1080,
                    rotateY: p.rotateY + 1440,
                    opacity: [1, 1, 1, 0.9, 0] 
                  }}
                  transition={{ duration: 2.5, ease: [0.1, 0.6, 0.2, 1] }}
                  className="absolute z-40 pointer-events-none"
                  style={{
                    width: p.width,
                    height: p.height,
                    backgroundColor: p.color,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              ))}
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

              <motion.div 
                style={{ opacity: closedOpacity }} 
                onClick={handleScrollDown}
                className="absolute inset-0 z-20 pointer-events-auto cursor-pointer flex items-center justify-center group"
              >
                {/* Glow behind the box */}
                <div className="absolute w-44 h-44 bg-pink-400/25 blur-[35px] rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 pointer-events-none" />
                
                <img 
                  src="/box-closed.png" 
                  className="w-full h-full object-contain mix-blend-multiply brightness-[1.05] gift-wiggle" 
                  alt="Closed Box" 
                />
              </motion.div>

              <motion.div style={{ opacity: openOpacity }} className="absolute inset-0 z-10">
                <img src="/box-open.png" className="w-full h-full object-contain mix-blend-multiply brightness-[1.05]" alt="Open Box" />
              </motion.div>

              {/* Running Counter */}
              <motion.div
                style={{ opacity: title1Opacity }}
                className="absolute -bottom-14 md:-bottom-18 z-30 pointer-events-none text-center select-none w-[320px] md:w-[450px]"
              >
                <motion.div
                  animate={showCounter ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                  initial={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center"
                >
                  <p className="text-indigo-950/70 text-sm md:text-[15px] font-semibold flex items-center justify-center gap-2 flex-wrap leading-none select-text">
                    Kami telah bantu{" "}
                    <span className="font-handwriting text-pink-500 text-3xl md:text-[38px] font-bold tracking-wider leading-none select-text">
                      {count.toLocaleString()}
                    </span>{" "}
                    org pencari hadiah!
                  </p>
                </motion.div>
              </motion.div>

              {/* Enhanced Scroll Indicator */}
              <motion.div 
                style={{ opacity: title1Opacity }}
                onClick={handleScrollDown}
                className="absolute -bottom-28 md:-bottom-36 flex flex-col items-center gap-2 pointer-events-auto cursor-pointer"
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
