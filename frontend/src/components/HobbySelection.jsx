import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gamepad2, Camera, Plane, Music, Palette, Utensils, Dumbbell, ChevronLeft, Sparkles, Check } from 'lucide-react'

export default function HobbySelection({ targetName, onNext, onBack }) {
  const [selectedHobbies, setSelectedHobbies] = useState([])
  const [customHobby, setCustomHobby] = useState('')

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

  const toggleHobby = (label) => {
    if (selectedHobbies.includes(label)) {
      setSelectedHobbies(selectedHobbies.filter(h => h !== label))
    } else {
      setSelectedHobbies([...selectedHobbies, label])
    }
  }

  const handleContinue = () => {
    const finalHobbies = [...selectedHobbies]
    if (customHobby.trim()) {
      finalHobbies.push(customHobby.trim())
    }
    
    if (finalHobbies.length === 0) {
      alert('Sila pilih sekurang-kurangnya satu minat atau tulis di bawah.')
      return
    }
    
    onNext(finalHobbies.join(', '))
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-md mx-auto pt-8 px-4 pb-20"
    >
      <button onClick={onBack} className="mb-8 flex items-center text-slate-400 font-bold text-sm hover:text-indigo-950 transition-colors">
        <ChevronLeft className="w-5 h-5" /> Kembali
      </button>

      <h2 className="text-4xl font-black text-indigo-950 leading-tight mb-2">
        Apa minat <span className="text-pink-500">{targetName}</span>?
      </h2>
      <p className="text-slate-500 font-bold mb-8">Boleh pilih lebih daripada satu. AI akan cari yang paling sesuai!</p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {hobbies.map((hobby) => {
          const isSelected = selectedHobbies.includes(hobby.label)
          return (
            <button
              key={hobby.label}
              onClick={() => toggleHobby(hobby.label)}
              className={`relative flex items-center gap-3 p-4 border-2 rounded-2xl transition-all font-bold text-sm ${
                isSelected 
                  ? 'bg-indigo-950 border-indigo-950 text-white shadow-lg' 
                  : 'bg-white border-slate-50 text-indigo-950 hover:border-pink-200'
              }`}
            >
              <div className={isSelected ? 'text-pink-400' : 'text-pink-500'}>
                {hobby.icon}
              </div>
              {hobby.label}
              <AnimatePresence>
                {isSelected && (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center shadow-md"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          )
        })}
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Atau tulis sendiri</p>
          <input 
            type="text" 
            value={customHobby}
            onChange={(e) => setCustomHobby(e.target.value)}
            placeholder="Contoh: Memancing, Membaca..."
            className="w-full p-5 bg-white border-2 border-slate-50 rounded-2xl focus:border-pink-500 focus:outline-none transition-all font-bold text-indigo-950 shadow-inner"
          />
        </div>

        <button 
          onClick={handleContinue}
          className="w-full py-5 bg-gradient-to-r from-indigo-950 to-indigo-900 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center justify-center gap-3"
        >
          Teruskan
          <div className="bg-pink-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center">
            {selectedHobbies.length + (customHobby.trim() ? 1 : 0)}
          </div>
        </button>
      </div>
    </motion.div>
  )
}
