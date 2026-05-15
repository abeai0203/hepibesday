import { motion } from 'framer-motion'
import { Cake, Gift, Heart, Users, Sparkles, MessageCircle, PartyPopper, ChevronLeft } from 'lucide-react'

export default function OccasionSelection({ targetName, onNext, onBack }) {
  const occasions = [
    { id: 'birthday', label: 'Hari Jadi', icon: <Cake className="w-6 h-6 text-pink-500" />, desc: 'Sambutan ulangtahun kelahiran' },
    { id: 'surprise', label: 'Surprise!', icon: <Sparkles className="w-6 h-6 text-yellow-500" />, desc: 'Kejutan tanpa sebab atau pencapaian' },
    { id: 'wedding', label: 'Kawin / Tunang', icon: <PartyPopper className="w-6 h-6 text-orange-500" />, desc: 'Meraikan masjid yang bakal dibina' },
    { id: 'crush', label: 'Nak Tackle / Crush', icon: <Heart className="w-6 h-6 text-rose-500" />, desc: 'Langkah pertama untuk pikat hati' },
    { id: 'anniversary', label: 'Anniversary', icon: <Heart className="w-6 h-6 text-red-500" />, desc: 'Meraikan cinta yang bertahan lama' },
    { id: 'apology', label: 'Minta Maaf', icon: <MessageCircle className="w-6 h-6 text-indigo-500" />, desc: 'Pujuk si dia yang tengah merajuk' },
    { id: 'just_because', label: 'Saja-saja', icon: <Gift className="w-6 h-6 text-slate-500" />, desc: 'Sebab dia layak menerima penghargaan' },
  ]

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
        Apa <span className="text-pink-500">acara</span> kali ini?
      </h2>
      <p className="text-slate-500 font-bold mb-8">Beritahu kami tujuan hadiah ini diberikan.</p>

      <div className="space-y-3">
        {occasions.map((occ) => (
          <button
            key={occ.id}
            onClick={() => onNext(occ.id)}
            className="w-full flex items-center gap-4 p-4 bg-white border-2 border-slate-50 hover:border-pink-200 rounded-3xl transition-all shadow-sm hover:shadow-xl group text-left"
          >
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              {occ.icon}
            </div>
            <div className="flex-1">
              <p className="text-base font-black text-indigo-950 leading-tight">{occ.label}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{occ.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
