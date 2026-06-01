import { Heart, Clock, Star, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAddToCart } from '@/hooks/useCart'
import useMenuStore from '@/store/useMenuStore'

export default function DishCard({ dish }) {
  const { mutate: addToCart, isPending } = useAddToCart()
  const { favorites, toggleFavorite }   = useMenuStore()
  const isFav = favorites.includes(dish.id)

  const imgSrc = dish.image_url || dish.image || null

  return (
    <div className="card-hover overflow-hidden group cursor-pointer">
      {/* Image */}
      <div className="dish-img-wrap relative h-52 bg-slate-100 dark:bg-slate-700">
        {imgSrc ? (
          <img src={imgSrc} alt={dish.name}
            className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600">
            🍽️
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category badge */}
        {dish.category_name && (
          <div className="absolute top-3 left-3">
            <span className="badge-green text-[11px] font-semibold backdrop-blur-sm">
              {dish.category_name}
            </span>
          </div>
        )}

        {/* Favourite */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(dish.id) }}
          className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/90 dark:bg-slate-800/90
                     backdrop-blur-sm flex items-center justify-center shadow-sm
                     hover:scale-110 transition-transform duration-200">
          <Heart size={14}
            className={isFav ? 'fill-red-500 text-red-500' : 'text-slate-400'} />
        </button>

        {/* Quick add on hover */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0
                        group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
                        transition-all duration-300">
          <button
            onClick={() => addToCart(dish)}
            disabled={isPending}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white
                       text-xs font-semibold px-4 py-2 rounded-xl shadow-lg shadow-green-500/30
                       transition-all duration-200 disabled:opacity-50 whitespace-nowrap">
            <ShoppingCart size={13} />
            {isPending ? 'Adding...' : 'Quick Add'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2 text-xs text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <Star size={11} className="text-yellow-400 fill-yellow-400" /> 4.8
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} /> 25–35 min
          </span>
        </div>

        <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-3 leading-snug">
          {dish.name}
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              Rs. {Number(dish.price).toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 ml-0.5">/-</span>
          </div>
          <button
            onClick={() => addToCart(dish)}
            disabled={isPending}
            className="w-9 h-9 bg-slate-900 dark:bg-white text-white dark:text-slate-900
                       rounded-xl flex items-center justify-center font-bold text-lg
                       hover:bg-green-500 dark:hover:bg-green-500 dark:hover:text-white
                       transition-all duration-200 hover:scale-110 hover:shadow-lg
                       hover:shadow-green-500/30 disabled:opacity-50 flex-shrink-0">
            {isPending ? '·' : '+'}
          </button>
        </div>
      </div>
    </div>
  )
}