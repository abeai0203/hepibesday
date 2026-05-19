import { motion } from 'framer-motion'
import { Heart, Users, Home, ChevronLeft } from 'lucide-react'

export default function RelationshipSelection({ targetName, onNext, onBack }) {
  const options = [
    { id: 'P', label: 'Pasangan / Crush', icon: <Heart className="w-6 h-6 text-pink-500" />, desc: 'Isteri, Suami, atau si dia yang tersayang' },
    { id: 'K', label: 'Kawan / Bestie', icon: <Users className="w-6 h-6 text-indigo-500" />, desc: 'Rakan sekolah, rakan sekerja atau kawan baik' },
    { id: 'F', label: 'Keluarga', icon: <Home className="w-6 h-6 text-orange-500" />, desc: 'Mak, Ayah, Adik Beradik atau saudara-mara' },
    { id: 'U', label: 'Lain-lain', icon: <Users className="w-6 h-6 text-slate-500" />, desc: 'Kenalan atau sesiapa sahaja' },
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
        Mantap! Siapa <span className="text-pink-500">{targetName}</span> ni?
      </h2>
      <p className="text-slate-500 font-bold mb-8">Ini membantu kami mencari hadiah dengan nada yang betul.</p>

      <div className="space-y-4">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onNext(opt.id)}
            className="w-full flex items-center gap-4 p-5 bg-white border-2 border-slate-50 hover:border-pink-200 rounded-3xl transition-all shadow-sm hover:shadow-xl group text-left"
          >
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              {opt.icon}
            </div>
            <div>
              <p className="text-lg font-black text-indigo-950">{opt.label}</p>
              <p className="text-xs font-bold text-slate-400">{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
