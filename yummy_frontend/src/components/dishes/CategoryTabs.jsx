import { motion } from 'framer-motion'

export default function CategoryTabs({ categories = [], active, onChange }) {
  const all = [{ id: 'all', name: 'All' }, ...categories]
  return (
    <div className="flex gap-2 flex-wrap">
      {all.map((cat) => (
        <motion.button
          key={cat.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(cat.id === 'all' ? 'All' : cat.name)}
          className={`px-5 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200
            ${active === (cat.id === 'all' ? 'All' : cat.name)
              ? 'bg-green-DEFAULT border-green-DEFAULT text-white shadow-md'
              : 'border-gray-200 dark:border-slate-600 text-gray-500 dark:text-gray-400 hover:border-green-DEFAULT hover:text-green-DEFAULT bg-white dark:bg-slate-800'
            }`}
        >
          {cat.name}
          {cat.dish_count !== undefined && (
            <span className="ml-1.5 text-xs opacity-70">({cat.dish_count})</span>
          )}
        </motion.button>
      ))}
    </div>
  )
}
