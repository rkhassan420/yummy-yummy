import { NavLink } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-[5%] pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <span className="text-xl">🍕</span>
              </div>
              <span className="font-display text-xl font-bold">
                Yummy<span className="text-green-400">-Yummy</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Bringing the finest flavours to your doorstep since 2020.
              Quality ingredients, expert chefs, unmatched service.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <button key={i}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-green-500
                             flex items-center justify-center text-slate-400 hover:text-white
                             transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-green-500/30">
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-5">
              Quick Links
            </h4>
            <div className="flex flex-col gap-3">
              {[['/', 'Home'], ['/menu', 'Menu'], ['/orders', 'My Orders'],
                ['/contact', 'Contact'], ['/feedback', 'Reviews']].map(([to, label]) => (
                <NavLink key={to} to={to}
                  className="text-sm text-slate-400 hover:text-green-400 transition-colors
                             flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-slate-600 group-hover:bg-green-400
                                   rounded-full transition-colors" />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-5">
              Contact Us
            </h4>
            <div className="flex flex-col gap-4">
              {[
                { Icon: Phone, text: '+92 324 5396 002'                    },
                { Icon: Mail,  text: 'support@Yummy-Yummy.com'             },
                { Icon: MapPin,text: 'Phool Nagar, Multan Rd, Kasur, Punjab' },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={13} className="text-green-400" />
                  </div>
                  <span className="text-sm text-slate-400 leading-relaxed">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-5">
              Opening Hours
            </h4>
            <div className="flex items-start gap-3 mb-5">
              <div className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock size={13} className="text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Monday – Sunday</p>
                <p className="text-sm font-semibold text-white mt-1">10:00 AM – 1:00 AM</p>
              </div>
            </div>
            {/* Status */}
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20
                            text-green-400 px-3 py-2 rounded-xl text-xs font-medium">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Open Now — Order Anytime
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row
                        justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © 2026 Yummy-Yummy. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Made with ❤️ in Pakistan 🇵🇰
          </p>
        </div>
      </div>
    </footer>
  )
}