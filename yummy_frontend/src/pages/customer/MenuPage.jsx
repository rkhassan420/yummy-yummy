// import { useState } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { SlidersHorizontal, Search, Grid, List } from 'lucide-react'
// import DishCard from '@/components/dishes/DishCard'
// import { DishGridSkeleton } from '@/components/dishes/DishSkeleton'
// import EmptyState from '@/components/ui/EmptyState'
// import { useDishes, useCategories, useDebounce } from '@/hooks/useDishes'
// import useMenuStore from '@/store/useMenuStore'
// import { SORT_OPTIONS } from '@/utils/constants'

// export default function MenuPage() {
//   const { activeCategory, searchQuery, sortBy, setCategory, setSearch, setSort } = useMenuStore()
//   const debouncedSearch = useDebounce(searchQuery)
//   const [viewMode, setViewMode] = useState('grid')

//   const { data: categories = [] } = useCategories()

//   const params = {
//     ...(activeCategory !== 'All' && { category_name: activeCategory }),
//     ...(debouncedSearch && { search: debouncedSearch }),
//     ...(sortBy !== 'default' && { ordering: sortBy }),
//   }

//   const { data: dishes = [], isLoading } = useDishes(params)
//   const allCats = [{ id: 'all', name: 'All' }, ...categories]

//   return (
//     <div className="page-container min-h-screen bg-slate-50 dark:bg-slate-950">

//       {/* ── Header ── */}
//       <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-[5%] py-10">

//           <p className="section-tag mb-2">Our Menu</p>
//           <h1 className="font-display text-4xl text-slate-900 dark:text-white mb-6">
//             All Dishes
//           </h1>

//           {/* Filters */}
//           <div className="flex flex-col sm:flex-row gap-4">

//             {/* Search */}
//             <div className="relative flex-1 max-w-sm">
//               <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
//               <input
//                 className="input-field pl-11"
//                 placeholder="Search dishes, categories..."
//                 value={searchQuery}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>

//             {/* Right controls */}
//             <div className="flex items-center gap-3">

//               {/* Sort */}
//               <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
//                 <SlidersHorizontal size={15} className="text-slate-400" />
//                 <select
//                   className="text-sm bg-transparent outline-none text-slate-700 dark:text-slate-300 cursor-pointer"
//                   value={sortBy}
//                   onChange={(e) => setSort(e.target.value)}
//                 >
//                   {SORT_OPTIONS.map((o) => (
//                     <option key={o.value} value={o.value}>{o.label}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* View toggle */}
//               <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 gap-1">
//                 {[{ mode: 'grid', Icon: Grid }, { mode: 'list', Icon: List }].map(({ mode, Icon }) => (
//                   <button
//                     key={mode}
//                     onClick={() => setViewMode(mode)}
//                     className={`p-2 rounded-lg transition-all duration-200 ${
//                       viewMode === mode
//                         ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
//                         : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
//                     }`}
//                   >
//                     <Icon size={15} />
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Content Layout ── */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-[5%] py-8">

//         <div className="flex flex-col gap-6">

//           {/* Horizontal Categories - For All Devices */}
//           <div className="w-full">
//             <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
//               {allCats.map((cat) => {
//                 const isActive = activeCategory === (cat.id === 'all' ? 'All' : cat.name)

//                 return (
//                   <button
//                     key={cat.id}
//                     onClick={() => setCategory(cat.id === 'all' ? 'All' : cat.name)}
//                     className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
//                       isActive
//                         ? 'bg-green-500 text-white shadow-md shadow-green-500/20'
//                         : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
//                     }`}
//                   >
//                     {cat.name}
//                     {cat.dish_count !== undefined && (
//                       <span className={`ml-2 text-xs px-2 py-0.5 rounded-md ${
//                         isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
//                       }`}>
//                         {cat.dish_count}
//                       </span>
//                     )}
//                   </button>
//                 )
//               })}
//             </div>
//           </div>

//           {/* Main Content Area */}
//           <div className="flex-1 w-full min-w-0">

//             {/* Result Count */}
//             {!isLoading && (
//               <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
//                 <span className="font-semibold text-slate-900 dark:text-white">
//                   {dishes.length}
//                 </span>{' '}
//                 dish{dishes.length !== 1 ? 'es' : ''}
//                 {activeCategory !== 'All' && (
//                   <span>
//                     {' '}in{' '}
//                     <span className="text-green-600 dark:text-green-400 font-medium">
//                       "{activeCategory}"
//                     </span>
//                   </span>
//                 )}
//               </p>
//             )}

//             {/* Dishes Content */}
//             {isLoading ? (
//               <DishGridSkeleton count={8} />
//             ) : dishes.length === 0 ? (
//               <EmptyState
//                 icon="🔍"
//                 title="No dishes found"
//                 description="Try a different search term or category"
//                 action={
//                   <button
//                     onClick={() => {
//                       setCategory('All')
//                       setSearch('')
//                     }}
//                     className="btn-primary"
//                   >
//                     Clear Filters
//                   </button>
//                 }
//               />
//             ) : (
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={`${activeCategory}-${debouncedSearch}-${sortBy}`}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.2 }}
//                   className={
//                     viewMode === 'grid'
//                       ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6'
//                       : 'flex flex-col gap-4'
//                   }
//                 >
//                   {dishes.map((dish, i) => (
//                     <motion.div
//                       key={dish.id}
//                       initial={{ opacity: 0, y: 16 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: i * 0.04, duration: 0.35 }}
//                     >
//                       <DishCard dish={dish} />
//                     </motion.div>
//                   ))}
//                 </motion.div>
//               </AnimatePresence>
//             )}

//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

import { useState, useMemo, useTransition, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, Search, Grid, List, X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import menuAPI from '@/api/menuAPI'
import DishCard from '@/components/dishes/DishCard'
import { DishGridSkeleton } from '@/components/dishes/DishSkeleton'
import EmptyState from '@/components/ui/EmptyState'
import { useDebounce } from '@/hooks/useDishes'
import useMenuStore from '@/store/useMenuStore'
import { SORT_OPTIONS } from '@/utils/constants'

// ─── Fetch ALL dishes ONCE — filter client-side (zero re-fetches) ─────────────
function useAllDishes() {
  return useQuery({
    queryKey: ['all-dishes'],
    queryFn: async () => {
      const res = await menuAPI.getDishes({ page_size: 200 })
      return res.data.results || res.data
    },
    staleTime:            1000 * 60 * 10,  // 10 min
    gcTime:               1000 * 60 * 30,  // 30 min in cache
    refetchOnWindowFocus: false,
    refetchOnMount:       false,
  })
}

function useAllCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await menuAPI.getCategories()
      return res.data.results || res.data
    },
    staleTime:            1000 * 60 * 15,
    gcTime:               1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount:       false,
  })
}

export default function MenuPage() {
  const {
    activeCategory, searchQuery, sortBy,
    setCategory, setSearch, setSort,
  } = useMenuStore()

  const [viewMode,    setViewMode]    = useState('grid')
  const [isPending,   startTransition] = useTransition()

  // 200ms debounce — fast enough to feel instant
  const debouncedSearch = useDebounce(searchQuery, 200)

  // One fetch, cached for 10 minutes
  const { data: allDishes  = [], isLoading: dishesLoading    } = useAllDishes()
  const { data: categories = [], isLoading: categoriesLoading } = useAllCategories()

  // ── All filtering is 100% client-side — instant, zero network ────────────
  const dishes = useMemo(() => {
    let list = allDishes

    // Category
    if (activeCategory && activeCategory !== 'All') {
      list = list.filter(
        (d) => (d.category_name || '').toLowerCase() === activeCategory.toLowerCase()
      )
    }

    // Search
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase()
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.category_name || '').toLowerCase().includes(q)
      )
    }

    // Sort
    if (sortBy === 'price')  return [...list].sort((a, b) => Number(a.price) - Number(b.price))
    if (sortBy === '-price') return [...list].sort((a, b) => Number(b.price) - Number(a.price))
    if (sortBy === 'name')   return [...list].sort((a, b) => a.name.localeCompare(b.name))

    return list
  }, [allDishes, activeCategory, debouncedSearch, sortBy])

  // Wrap state changes in useTransition — UI never freezes
  const handleCategoryChange = useCallback(
    (cat) => startTransition(() => setCategory(cat)),
    [setCategory]
  )

  const handleSortChange = useCallback(
    (val) => startTransition(() => setSort(val)),
    [setSort]
  )

  const clearFilters = () => {
    startTransition(() => {
      setCategory('All')
      setSearch('')
      setSort('default')
    })
  }

  const hasActiveFilters =
    activeCategory !== 'All' || searchQuery || sortBy !== 'default'

  const isLoading = dishesLoading || categoriesLoading

  // Build category list with counts (computed from local data — free)
  const allCats = useMemo(() => {
    const cats = [{ id: 'all', name: 'All', count: allDishes.length }]
    categories.forEach((cat) => {
      const count = allDishes.filter(
        (d) => (d.category_name || '').toLowerCase() === cat.name.toLowerCase()
      ).length
      cats.push({ id: cat.id, name: cat.name, count })
    })
    return cats
  }, [categories, allDishes])

  return (
    <div className="page-container min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* ── Page Header ── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-[5%] py-10">

          <p className="section-tag mb-2">Our Menu</p>
          <h1 className="font-display text-4xl text-slate-900 dark:text-white mb-6">
            All Dishes
          </h1>

          {/* Filters row */}
          <div className="flex flex-col sm:flex-row gap-4">

            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input-field pl-11 pr-10"
                placeholder="Search dishes, categories..."
                value={searchQuery}
                onChange={(e) => setSearch(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3 flex-wrap">

              {/* Sort */}
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800
                              border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
                <SlidersHorizontal size={15} className="text-slate-400" />
                <select
                  className="text-sm bg-transparent outline-none text-slate-700
                             dark:text-slate-300 cursor-pointer"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* View toggle */}
              <div className="flex bg-white dark:bg-slate-800 border border-slate-200
                              dark:border-slate-700 rounded-xl p-1 gap-1">
                {[{ mode: 'grid', Icon: Grid }, { mode: 'list', Icon: List }].map(({ mode, Icon }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === mode
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    <Icon size={15} />
                  </button>
                ))}
              </div>

              {/* Clear filters pill */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-xs font-medium text-red-500
                             bg-red-50 dark:bg-red-500/10 px-3 py-2 rounded-xl
                             hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                >
                  <X size={12} /> Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-[5%] py-8">
        <div className="flex flex-col gap-6">

          {/* ── Horizontal Categories (all devices, your layout) ── */}
          <div className="w-full">
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
              {allCats.map((cat) => {
                const isActive = activeCategory === cat.name
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.name)}
                    className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl
                                text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                      isActive
                        ? 'bg-green-500 text-white shadow-md shadow-green-500/20'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat.name}
                    <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Dishes grid ── */}
          <div className="flex-1 w-full min-w-0">

            {/* Result count */}
            {!isLoading && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {dishes.length}
                </span>{' '}
                dish{dishes.length !== 1 ? 'es' : ''}
                {activeCategory !== 'All' && (
                  <span>
                    {' '}in{' '}
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      "{activeCategory}"
                    </span>
                  </span>
                )}
                {/* Subtle "filtering..." hint during transition */}
                {isPending && (
                  <span className="ml-2 text-slate-300 dark:text-slate-600 text-xs animate-pulse">
                    filtering...
                  </span>
                )}
              </p>
            )}

            {/* Loading skeleton — only on first load */}
            {isLoading ? (
              <DishGridSkeleton count={8} />
            ) : dishes.length === 0 ? (
              <EmptyState
                icon="🔍"
                title="No dishes found"
                description="Try a different search term or category"
                action={
                  <button onClick={clearFilters} className="btn-primary">
                    Clear Filters
                  </button>
                }
              />
            ) : (
              // No AnimatePresence key — avoids full remount on every filter change
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6'
                    : 'flex flex-col gap-4'
                }
              >
                {dishes.map((dish, i) => (
                  <motion.div
                    key={dish.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    // Only animate first 12 — rest appear instantly (no jank on large lists)
                    transition={
                      i < 12
                        ? { delay: i * 0.03, duration: 0.3, ease: 'easeOut' }
                        : { duration: 0 }
                    }
                  >
                    <DishCard dish={dish} />
                  </motion.div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}