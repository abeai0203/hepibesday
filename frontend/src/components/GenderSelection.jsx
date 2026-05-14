import { motion } from 'framer-motion'
import { User, UserRound, ChevronLeft, Mars, Venus } from 'lucide-react'

export default function GenderSelection({ targetName, onNext, onBack }) {
  return (
    <div className="min-h-screen w-full bg-[#FDFCF0] relative overflow-hidden flex flex-col p-6">
      {/* Background Blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-blue-100/30 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/3 -left-20 w-[400px] h-[400px] bg-pink-100/30 blur-[100px] rounded-full" />
      </div>

      {/* Top Navigation */}
      <div className="flex items-center justify-between w-full max-w-lg mx-auto mb-10">
        <button 
          onClick={onBack}
          className="w-12 h-12 bg-white shadow-lg rounded-2xl flex items-center justify-center text-slate-700 hover:scale-110 active:scale-95 transition-all border border-pink-50"
        >
          <ChevronLeft className="w-6 h-6 text-pink-500" />
        </button>
        <div className="bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-2xl flex items-center space-x-4 shadow-xl border border-white">
          <span className="text-[10px] font-black text-indigo-950 uppercase tracking-widest">Langkah 2/5</span>
          <div className="w-24 h-2 bg-pink-50 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: '20%' }}
              animate={{ width: '40%' }}
              className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full" 
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto text-center"
      >
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-indigo-950 leading-tight">
            Apa jantina <br/>
            <span className="text-pink-500">{targetName || 'si dia'}?</span>
          </h2>
          <p className="text-slate-500 font-bold mt-4">
            Ini membantu kami mencari hadiah yang lebih tepat.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 w-full">
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNext('M')}
            className="group relative bg-white/70 backdrop-blur-xl border-2 border-white rounded-[2.5rem] p-8 flex flex-col items-center justify-center space-y-6 shadow-2xl hover:border-blue-200 transition-all"
          >
            <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <Mars className="w-10 h-10 text-blue-500" />
            </div>
            <span className="font-black text-xl text-indigo-950">Lelaki</span>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-3 h-3 rounded-full bg-blue-400 animate-ping" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNext('F')}
            className="group relative bg-white/70 backdrop-blur-xl border-2 border-white rounded-[2.5rem] p-8 flex flex-col items-center justify-center space-y-6 shadow-2xl hover:border-pink-200 transition-all"
          >
            <div className="w-20 h-20 rounded-3xl bg-pink-50 flex items-center justify-center group-hover:bg-pink-100 transition-colors">
              <Venus className="w-10 h-10 text-pink-500" />
            </div>
            <span className="font-black text-xl text-indigo-950">Perempuan</span>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-3 h-3 rounded-full bg-pink-400 animate-ping" />
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Safe Area Padding for Mobile */}
      <div className="h-10 w-full" />
    </div>
  )
}
