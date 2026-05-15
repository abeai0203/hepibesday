import { motion } from 'framer-motion'
import { Gamepad2, Camera, Plane, Music, Palette, Utensils, Dumbbell, ChevronLeft, Sparkles } from 'lucide-react'

export default function HobbySelection({ targetName, onNext, onBack }) {
  const hobbies = [
    { label: 'Gaming', icon: <Gamepad2 className="w-5 h-5" /> },
    { label: 'Travel', icon: <Plane className="w-5 h-5" /> },
    { label: 'Photography', icon: <Camera className="w-5 h-5" /> },
    { label: 'Music', icon: <Music className="w-5 h-5" /> },
    { label: 'Art / Design', icon: <Palette className="w-5 h-5" /> },
    { label: 'Cooking', icon: <Utensils className="w-5 h-5" /> },
    { label: 'Fitness', icon: <Dumbbell className="w-5 h-5" /> },
    { label: 'Beauty', icon: <Sparkles className="w-5 h-5" /> },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-md mx-auto pt-8 px-4"
    >
      <button onClick={onBack} className="mb-8 flex items-center text-slate-400 font-bold text-sm hover:text-indigo-950 transition-colors">
        <ChevronLeft className="w-5 h-5" /> Kembali
      </button>

      <h2 className="text-4xl font-black text-indigo-950 leading-tight mb-2">
        Apa minat <span className="text-pink-500">{targetName}</span>?
      </h2>
      <p className="text-slate-500 font-bold mb-8">Pilih satu atau tulis minat dia di bawah.</p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {hobbies.map((hobby) => (
          <button
            key={hobby.label}
            onClick={() => onNext(hobby.label)}
            className="flex items-center gap-3 p-4 bg-white border-2 border-slate-50 hover:border-pink-200 rounded-2xl transition-all shadow-sm hover:shadow-md font-bold text-indigo-950"
          >
            <div className="text-pink-500">{hobby.icon}</div>
            {hobby.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Atau tulis sendiri</p>
        <input 
          id="custom-hobby"
          type="text" 
          placeholder="Contoh: Memancing, Membaca..."
          className="w-full p-5 bg-white border-2 border-slate-50 rounded-2xl focus:border-pink-500 focus:outline-none transition-all font-bold text-indigo-950 shadow-inner"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value) onNext(e.target.value)
          }}
        />
        <button 
          onClick={() => {
            const val = document.getElementById('custom-hobby').value
            if (val) onNext(val)
          }}
          className="w-full py-5 bg-indigo-950 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-pink-500 transition-all"
        >
          Teruskan
        </button>
      </div>
    </motion.div>
  )
}
