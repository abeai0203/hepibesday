import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Sparkles, Wand2, Users, Heart, Star, Gift, ShoppingBag, ChevronRight } from 'lucide-react'

export default function Landing({ onNext }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Animation values based on scroll
  const boxScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.6])
  const closedOpacity = useTransform(scrollYProgress, [0.3, 0.5], [1, 0])
  const openOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1])
  const qMarkY = useTransform(scrollYProgress, [0.5, 0.9], [50, -120])
  const qMarkScale = useTransform(scrollYProgress, [0.5, 0.8], [0, 1.2])
  const qMarkOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1])
  
  // Hero text and elements fade out as we zoom in
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const footerY = useTransform(scrollYProgress, [0.7, 1], [100, 0])
  const footerOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1])

  const steps = [
    { icon: <Users className="w-7 h-7 text-pink-500" />, title: 'Kenali dia', desc: 'dengan ringkas', color: 'bg-pink-50' },
    { icon: <Star className="w-7 h-7 text-purple-500" />, title: 'Bintang dedah', desc: 'personaliti dia', color: 'bg-purple-50' },
    { icon: <Gift className="w-7 h-7 text-yellow-500" />, title: 'Terima 5 hadiah', desc: 'paling sesuai', color: 'bg-yellow-50' },
    { icon: <ShoppingBag className="w-7 h-7 text-indigo-500" />, title: 'Klik & beli', desc: 'di Shopee', color: 'bg-indigo-50' },
  ]

  return (
    <div ref={containerRef} className="relative h-[250vh] w-full">
      {/* Sticky Container for the animation */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center overflow-hidden">
        
        {/* Background Cloud Blobs */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="cloud-blob w-[600px] h-[600px] -left-48 top-1/4 animate-pulse opacity-60" />
          <div className="cloud-blob w-[800px] h-[800px] -right-64 bottom-0 opacity-80" />
        </div>

        {/* Header - Fades out on scroll */}
        <motion.div 
          style={{ opacity: contentOpacity }}
          className="w-full max-w-4xl flex justify-between items-center mt-6 px-6 relative z-20"
        >
          <div className="flex flex-col">
            <span className="text-3xl font-black text-indigo-950 leading-none tracking-tight">Hepi</span>
            <span className="text-[10px] font-black tracking-[0.3em] text-indigo-400 uppercase mt-0.5 ml-0.5">Besday</span>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-3 shadow-sm border border-white/50">
            <span className="text-[10px] font-extrabold text-indigo-900 leading-none">10K+ dah jumpa hadiah best!</span>
            <div className="w-7 h-7 bg-pink-100 rounded-full flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            </div>
          </div>
        </motion.div>

        {/* Hero Section - Fades out on scroll */}
        <motion.div 
          style={{ opacity: contentOpacity }}
          className="flex flex-col items-center text-center mt-10 px-4 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-md border border-pink-50 mb-6">
            <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
            <span className="text-xs font-black text-pink-500 uppercase tracking-wide">Daripada Bintang, Untuk Dia</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-indigo-950 leading-[0.95] tracking-tight mb-4">
            Hadiah yang<br/>dia akan <span className="text-pink-500">ingat</span>
          </h1>
          <p className="text-slate-500 text-lg font-bold">
            Scroll untuk tengok kejutan... ✨
          </p>
        </motion.div>

        {/* Center Animation Area */}
        <div className="flex-1 w-full flex items-center justify-center relative">
          <motion.div
            style={{ scale: boxScale }}
            className="relative w-80 h-80 flex items-center justify-center"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-pink-400/20 blur-[100px] rounded-full scale-110 z-0" />

            {/* Question Mark - Pops out */}
            <motion.div
              style={{ 
                y: qMarkY, 
                scale: qMarkScale, 
                opacity: qMarkOpacity,
                maskImage: 'radial-gradient(circle, black 50%, transparent 95%)',
                WebkitMaskImage: 'radial-gradient(circle, black 50%, transparent 95%)'
              }}
              className="absolute z-30 w-40 h-40"
            >
              <img src="/q-mark.png" className="w-full h-full object-contain mix-blend-multiply brightness-[1.1]" alt="?" />
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
              <img src="/box-closed.png" className="w-full h-full object-contain mix-blend-multiply brightness-[1.05]" alt="Closed Box" />
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
              <img src="/box-open.png" className="w-full h-full object-contain mix-blend-multiply brightness-[1.05]" alt="Open Box" />
            </motion.div>
          </motion.div>

          {/* Floating heart and bag - only visible initially */}
          <motion.div 
            style={{ opacity: contentOpacity }}
            className="absolute left-10 top-1/2 -translate-y-1/2 w-24 h-24"
          >
            <img src="/heart.png" className="w-full h-full object-contain mix-blend-multiply opacity-60 animate-float-slow" alt="Heart" />
          </motion.div>
          <motion.div 
            style={{ opacity: contentOpacity }}
            className="absolute right-10 top-1/2 -translate-y-1/2 w-24 h-24"
          >
            <img src="/bag.png" className="w-full h-full object-contain mix-blend-multiply opacity-60 animate-float-slow" alt="Bag" />
          </motion.div>
        </div>

        {/* Footer Area - Appears at the end of scroll */}
        <motion.div 
          style={{ y: footerY, opacity: footerOpacity }}
          className="w-full max-w-2xl px-4 pb-10 flex flex-col items-center relative z-40"
        >
          {/* Steps Card */}
          <div className="w-full glass-card p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center space-y-2">
                  <div className={`${step.color} w-12 h-12 rounded-2xl flex items-center justify-center relative shadow-sm`}>
                    {step.icon}
                  </div>
                  <p className="text-[11px] font-black text-indigo-950">{step.title}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="w-full max-w-sm py-5 bg-gradient-to-r from-pink-400 via-rose-500 to-orange-500 rounded-3xl text-white font-black text-2xl shadow-xl flex items-center justify-center gap-4"
          >
            <Wand2 className="w-6 h-6" />
            Mula Sekarang
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </motion.div>

      </div>
    </div>
  )
}
