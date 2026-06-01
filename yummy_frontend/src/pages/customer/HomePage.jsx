import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Shield, Clock, Star, ChevronRight, TrendingUp } from 'lucide-react'
import DishCard from '@/components/dishes/DishCard'
import { DishGridSkeleton } from '@/components/dishes/DishSkeleton'
import Footer from '@/components/layout/Footer'
import { usePopularDishes } from '@/hooks/useDishes'

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 30 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
})

const STATS = [
  { value: '500+',  label: 'Menu Items'     },
  { value: '10K+',  label: 'Happy Customers'},
  { value: '4.9★',  label: 'Avg Rating'     },
  { value: '30min', label: 'Avg Delivery'   },
]

const FEATURES = [
  { icon: Zap,    title: 'Lightning Fast',   desc: 'Avg 30-min delivery to your door'  },
  { icon: Shield, title: 'Safe Payments',    desc: 'Your transactions are 100% secure' },
  { icon: Clock,  title: '24/7 Available',   desc: 'Order anytime, day or night'       },
  { icon: Star,   title: 'Top Quality',      desc: 'Freshly cooked with finest ingredients' },
]

const TESTIMONIALS = [
  { name:'Ahmed K.',    text:'Best biryani in town! Delivered in 25 minutes, still hot. 10/10.',          stars:5, avatar:'AK' },
  { name:'Sara M.',     text:'Amazing food quality and the app is so easy to use. Ordering every week!',  stars:5, avatar:'SM' },
  { name:'Usman T.',    text:'Tandoori chicken was perfectly grilled. Packaging was excellent too.',       stars:5, avatar:'UT' },
]

export default function HomePage() {
  const { data: popular = [], isLoading } = usePopularDishes()
  const navigate = useNavigate()

  return (
    <div className="page-container">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="hero-gradient relative overflow-hidden min-h-[620px] flex items-center">

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-[800px] h-[800px] border border-white/5 rounded-full animate-spin-slow" />
        </div>

        <div className="max-wrap section-pad w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">

          {/* Left content */}
          <div>
            <motion.div {...fadeUp(0.1)}
              className="inline-flex items-center gap-2 bg-green-500/15 border border-green-500/30
                         text-green-400 px-4 py-2 rounded-full text-xs font-semibold mb-6 backdrop-blur-sm">
              <TrendingUp size={12} />
              #1 Rated Food Delivery in Pakistan
            </motion.div>

            <motion.h1 {...fadeUp(0.2)}
              className="font-display text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.08] mb-6">
              Delicious Food<br />
              <span className="text-gradient">Delivered Fast</span>
            </motion.h1>

            <motion.p {...fadeUp(0.3)}
              className="text-slate-400 text-lg leading-relaxed mb-8 max-w-md">
              From sizzling BBQ to creamy desserts — your favourite meals crafted
              by expert chefs and at your door in 30 minutes.
            </motion.p>

            <motion.div {...fadeUp(0.4)} className="flex gap-4 flex-wrap">
              <button onClick={() => navigate('/menu')}
                className="btn-primary px-8 py-4 text-base flex items-center gap-2 shadow-green animate-pulse-glow">
                🍽️ Order Now <ChevronRight size={16} />
              </button>
              <button onClick={() => navigate('/menu')}
                className="btn-outline px-8 py-4 text-base">
                View Menu
              </button>
            </motion.div>

            {/* Stats row */}
            <motion.div {...fadeUp(0.5)}
              className="grid grid-cols-4 gap-4 mt-12 pt-10 border-t border-white/10">
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <p className="font-display text-2xl text-white font-bold">{value}</p>
                  <p className="text-slate-500 text-xs mt-1">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — hero image stack */}
          <motion.div
            initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }}
            transition={{ duration:0.8, delay:0.3, ease:[0.22,1,0.36,1] }}
            className="hidden lg:flex justify-center items-center relative"
          >
            {/* Main food image */}
            <div className="relative w-[360px] h-[360px]">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/10
                              rounded-full blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=85"
                alt="Yummy Pizza"
                className="w-full h-full object-cover rounded-3xl shadow-2xl shadow-black/50
                           border border-white/10 animate-float"
              />

              {/* Floating badges */}
              <motion.div
                initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.8 }}
                className="absolute -right-8 top-12 glass-card px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&q=80"
                      alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">Zinger Burger</p>
                    <p className="text-green-400 text-xs">Rs. 650 /-</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ delay:1 }}
                className="absolute -left-8 bottom-16 glass-card px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Zap size={16} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">Fast Delivery</p>
                    <p className="text-slate-400 text-xs">Avg 30 min</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.1 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass-card px-5 py-2.5 shadow-xl">
                <div className="flex items-center gap-3">
                  {['🍕','🍔','🍛','🍗','🍰'].map((e, i) => (
                    <span key={i} className="text-xl">{e}</span>
                  ))}
                  <span className="text-white text-xs font-medium ml-1">+50 dishes</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORY STRIP ────────────────────────────────────────────── */}
      {/* <section className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 py-6 overflow-hidden">
        <div className="flex gap-6 px-[5%] overflow-x-auto scrollbar-hide pb-1">
          {[
            { emoji:'🍕', label:'Pizza'    },
            { emoji:'🍔', label:'Burgers'  },
            { emoji:'🍛', label:'Biryani'  },
            { emoji:'🍗', label:'BBQ'      },
            { emoji:'🍜', label:'Chinese'  },
            { emoji:'🥞', label:'Breakfast'},
            { emoji:'🍰', label:'Dessert'  },
            { emoji:'🥤', label:'Drinks'   },
          ].map(({ emoji, label }) => (
            <button key={label}
              onClick={() => navigate('/menu')}
              className="flex flex-col items-center gap-2 min-w-[72px] group">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center
                              justify-center text-2xl group-hover:bg-green-50 dark:group-hover:bg-green-500/10
                              group-hover:scale-110 transition-all duration-200 shadow-sm">
                {emoji}
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400
                               group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors whitespace-nowrap">
                {label}
              </span>
            </button>
          ))}
        </div>
      </section> */}

      <section className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 py-6 overflow-hidden">
  <div className="w-full flex justify-center">
    <div className="flex justify-center gap-6 overflow-x-auto scrollbar-hide pb-1 px-4">
      {[
        { emoji: '🍕', label: 'Pizza' },
        { emoji: '🍔', label: 'Burgers' },
        { emoji: '🍛', label: 'Biryani' },
        { emoji: '🍗', label: 'BBQ' },
        { emoji: '🍜', label: 'Chinese' },
        { emoji: '🥞', label: 'Breakfast' },
        { emoji: '🍰', label: 'Dessert' },
        { emoji: '🥤', label: 'Drinks' },
      ].map(({ emoji, label }) => (
        <button
          key={label}
          onClick={() => navigate('/menu')}
          className="flex flex-col items-center gap-2 min-w-[72px] group flex-shrink-0"
        >
          <div
            className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800
                       flex items-center justify-center text-2xl
                       group-hover:bg-green-50 dark:group-hover:bg-green-500/10
                       group-hover:scale-110 transition-all duration-200 shadow-sm"
          >
            {emoji}
          </div>

          <span
            className="text-xs font-medium text-slate-600 dark:text-slate-400
                       group-hover:text-green-600 dark:group-hover:text-green-400
                       transition-colors whitespace-nowrap"
          >
            {label}
          </span>
        </button>
      ))}
    </div>
  </div>
</section>

      {/* ── POPULAR DISHES ────────────────────────────────────────────── */}
      <section className="bg-slate-50 dark:bg-slate-950 section-pad">
        <div className="max-wrap">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-tag mb-3">🔥 Trending Now</p>
              <h2 className="section-title">Popular Dishes</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-md">
                Handpicked favourites loved by thousands of customers every day
              </p>
            </div>
            <button onClick={() => navigate('/menu')}
              className="hidden md:flex items-center gap-2 text-green-600 dark:text-green-400
                         font-semibold text-sm hover:gap-3 transition-all duration-200">
              View all <ChevronRight size={16} />
            </button>
          </div>

          {isLoading
            ? <DishGridSkeleton count={6} />
            : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {popular.slice(0, 6).map((dish, i) => (
                  <motion.div key={dish.id}
                    initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay: i * 0.08, duration:0.5, ease:[0.22,1,0.36,1] }}>
                    <DishCard dish={dish} />
                  </motion.div>
                ))}
              </div>
            )
          }

          <div className="text-center mt-12">
            <button onClick={() => navigate('/menu')}
              className="btn-primary px-10 py-4 text-base inline-flex items-center gap-2">
              Explore Full Menu <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── ABOUT / WHY US ────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-900 section-pad">
        <div className="max-wrap grid lg:grid-cols-2 gap-16 items-center">

          {/* Image collage */}
          <motion.div
            initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true }} transition={{ duration:0.7 }}
            className="relative hidden lg:block"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80"
                  alt="Biryani" className="w-full h-48 object-cover rounded-2xl shadow-lg" />
                <img src="https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80"
                  alt="BBQ" className="w-full h-32 object-cover rounded-2xl shadow-lg" />
              </div>
              <div className="space-y-4 mt-8">
                <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80"
                  alt="Burger" className="w-full h-32 object-cover rounded-2xl shadow-lg" />
                <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80"
                  alt="Cake" className="w-full h-48 object-cover rounded-2xl shadow-lg" />
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2
                            bg-white dark:bg-slate-800 rounded-2xl px-5 py-3
                            shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white">
                ⭐
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">4.9 / 5 Rating</p>
                <p className="text-xs text-slate-400">From 10,000+ reviews</p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true }} transition={{ duration:0.7 }}>
            <p className="section-tag mb-4">Why Choose Us</p>
            <h2 className="section-title mb-6 leading-tight">
              Best Food Experience<br />In The Country
            </h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
              Welcome to Yummy-Yummy 😋 — where culinary excellence meets convenience.
              Our diverse menu satisfies every craving, from classic favourites to
              bold innovations. Every dish is crafted by skilled chefs using
              only the finest, freshest ingredients.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title}
                  className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl
                             hover:bg-green-50 dark:hover:bg-green-500/10
                             hover:border-green-200 border border-transparent
                             transition-all duration-200 group">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-500/20 rounded-xl
                                  flex items-center justify-center flex-shrink-0
                                  group-hover:bg-green-500 group-hover:shadow-lg
                                  group-hover:shadow-green-500/30 transition-all duration-200">
                    <Icon size={18} className="text-green-600 dark:text-green-400 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">{title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PROMO BANNER ──────────────────────────────────────────────── */}
      <section className="hero-gradient section-pad relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>
        <div className="max-wrap text-center relative z-10">
          <motion.div
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.6 }}>
            <p className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-4">
              Limited Time Offer
            </p>
            <h2 className="font-display text-4xl lg:text-5xl text-white mb-6">
              Free Delivery on Your First Order! 🎉
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
              Register now and enjoy free delivery on your very first order.
              Use code <span className="text-green-400 font-bold">YUMMY2024</span> at checkout.
            </p>
            <button onClick={() => navigate('/register')}
              className="btn-primary px-10 py-4 text-base inline-flex items-center gap-2 shadow-green">
              Claim Free Delivery <ChevronRight size={18} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="bg-slate-50 dark:bg-slate-950 section-pad">
        <div className="max-wrap">
          <div className="text-center mb-12">
            <p className="section-tag mb-3">💬 Reviews</p>
            <h2 className="section-title">What Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, text, stars, avatar }, i) => (
              <motion.div key={name}
                initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.5 }}
                className="card p-6 hover:border-green-200 dark:hover:border-green-500/30
                           hover:-translate-y-1 transition-all duration-300">
                <div className="flex text-yellow-400 gap-0.5 mb-4">
                  {Array(stars).fill('★').map((s,j) => <span key={j}>{s}</span>)}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic mb-5">
                  "{text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600
                                  flex items-center justify-center text-white text-xs font-bold">
                    {avatar}
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}