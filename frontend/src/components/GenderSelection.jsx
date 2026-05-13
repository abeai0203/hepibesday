import { motion } from 'framer-motion'
import { User, UserCircle, Users } from 'lucide-react'

const options = [
  { id: 'M', label: 'Male', icon: User },
  { id: 'F', label: 'Female', icon: UserCircle },
  { id: 'U', label: 'Unisex', icon: Users },
]

export default function GenderSelection({ onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8 py-8 w-full"
    >
      <div className="text-center space-y-2">
        <p className="text-accent text-sm font-semibold tracking-wider uppercase">Step 1 of 2</p>
        <h2 className="text-3xl font-heading text-white">Who is this gift for?</h2>
      </div>

      <div className="grid gap-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onNext(option.id)}
            className="glass-card p-6 flex items-center space-x-4 hover:bg-white/10 hover:border-accent/50 transition-all group text-left w-full"
          >
            <div className="p-3 rounded-full bg-white/5 group-hover:bg-accent/20 transition-colors">
              <option.icon className="w-6 h-6 text-slate-300 group-hover:text-accent" />
            </div>
            <span className="text-xl font-medium text-slate-200">{option.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
