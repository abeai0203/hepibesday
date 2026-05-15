import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Gamepad2, Camera, Plane, Music, Palette, Utensils, Dumbbell, ChevronLeft, 
  Sparkles, Check, Moon, Film, Coffee, Book, Flower2, Fish, Tv, Shirt, 
  Code, ShoppingCart, ChevronRight, Laptop
} from 'lucide-react'

export default function HobbySelection({ targetName, onNext, onBack }) {
  const [selectedHobbies, setSelectedHobbies] = useState([])
  const [customHobby, setCustomHobby] = useState('')
  const [currentPage, setCurrentPage] = useState(0)

  const allHobbies = [
    // Set 1
    { label: 'Gaming', icon: <Gamepad2 className="w-5 h-5" /> },
    { label: 'Travel', icon: <Plane className="w-5 h-5" /> },
    { label: 'Photography', icon: <Camera className="w-5 h-5" /> },
    { label: 'Music', icon: <Music className="w-5 h-5" /> },
    { label: 'Art / Design', icon: <Palette className="w-5 h-5" /> },
    { label: 'Cooking', icon: <Utensils className="w-5 h-5" /> },
    { label: 'Fitness', icon: <Dumbbell className="w-5 h-5" /> },
    { label: 'Beauty', icon: <Sparkles className="w-5 h-5" /> },
    // Set 2
    { label: 'Tidur', icon: <Moon className="w-5 h-5" /> },
    { label: 'Makan', icon: <Utensils className="w-5 h-5" /> },
    { label: 'Wayang', icon: <Film className="w-5 h-5" /> },
    { label: 'Lepak', icon: <Coffee className="w-5 h-5" /> },
    { label: 'Membaca', icon: <Book className="w-5 h-5" /> },
    { label: 'Menanam', icon: <Flower2 className="w-5 h-5" /> },
    { label: 'Memancing', icon: <Fish className="w-5 h-5" /> },
    { label: 'K-Pop / Drama', icon: <Tv className="w-5 h-5" /> },
    // Set 3
    { label: 'Fashion', icon: <Shirt className="w-5 h-5" /> },
    { label: 'Coding', icon: <Code className="w-5 h-5" /> },
    { label: 'Shopping', icon: <ShoppingCart className="w-5 h-5" /> },
    { label: 'Tengok Gadget', icon: <Laptop className="w-5 h-5" /> },
    { label: 'Self-care', icon: <Sparkles className="w-5 h-5" /> },
    { label: 'Anime', icon: <Tv className="w-5 h-5" /> },
    { label: 'Camping', icon: <Plane className="w-5 h-5" /> },
    { label: 'Bersenam', icon: <Dumbbell className="w-5 h-5" /> },
  ]

  const itemsPerPage = 8
  const totalPages = Math.ceil(allHobbies.length / itemsPerPage)
  const currentHobbies = allHobbies.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

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
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="flex items-center text-slate-400 font-bold text-sm hover:text-indigo-950 transition-colors">
          <ChevronLeft className="w-5 h-5" /> Kembali
        </button>
        <div className="flex gap-1">
          {[...Array(totalPages)].map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${currentPage === i ? 'bg-pink-500 w-4' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      <h2 className="text-4xl font-black text-indigo-950 leading-tight mb-2">
        Apa minat <span className="text-pink-500">{targetName}</span>?
      </h2>
      <p className="text-slate-500 font-bold mb-6">Boleh pilih lebih daripada satu. Gunakan butang kiri-kanan untuk lebih banyak pilihan!</p>

      <div className="relative mb-8 min-h-[280px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-2 gap-3"
          >
            {currentHobbies.map((hobby) => {
              const isSelected = selectedHobbies.includes(hobby.label)
              return (
                <button
                  key={hobby.label}
                  onClick={() => toggleHobby(hobby.label)}
                  className={`relative flex items-center gap-3 p-4 border-2 rounded-2xl transition-all font-bold text-sm ${
                    isSelected 
                      ? 'bg-indigo-950 border-indigo-950 text-white shadow-lg' 
                      : 'bg-white border-slate-50 text-indigo-950 hover:border-pink-200 shadow-sm'
                  }`}
                >
                  <div className={isSelected ? 'text-pink-400' : 'text-pink-500'}>
                    {hobby.icon}
                  </div>
                  <span className="truncate">{hobby.label}</span>
                  {isSelected && (
                    <motion.div 
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center shadow-md border-2 border-white"
                    >
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </button>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute top-1/2 -left-4 -translate-y-1/2 flex items-center">
          <button 
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="w-10 h-10 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center disabled:opacity-0 transition-all hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6 text-indigo-950" />
          </button>
        </div>
        <div className="absolute top-1/2 -right-4 -translate-y-1/2 flex items-center">
          <button 
            disabled={currentPage === totalPages - 1}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="w-10 h-10 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center disabled:opacity-0 transition-all hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-6 h-6 text-indigo-950" />
          </button>
        </div>
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
          className="w-full py-5 bg-gradient-to-r from-indigo-950 to-indigo-900 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center justify-center gap-4"
        >
          Teruskan
          <div className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs flex items-center justify-center font-black">
            {selectedHobbies.length + (customHobby.trim() ? 1 : 0)} MINAT
          </div>
        </button>
      </div>
    </motion.div>
  )
}
