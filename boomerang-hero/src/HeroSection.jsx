import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Calendar, Users, ChevronDown, Menu, X, Zap, Home, Star, Briefcase, Layout, Tag, Mail, BookOpen } from "lucide-react";

const navLinks = [
  { label: 'Home', href: '#', icon: Home },
  { label: 'Features', href: '#', icon: Star },
  { label: 'Use Cases', href: '#', icon: Briefcase },
  { label: 'Portfolio', href: '#', icon: Layout },
  { label: 'Pricing', href: '#', icon: Tag },
  { label: 'Blog', href: '#', icon: BookOpen },
  { label: 'Contact', href: '#', icon: Mail },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#09090b]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_40px_rgba(0,0,0,0.4)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px] md:h-[80px]">
            {/* Logo */}
            <a href="#" className="inline-block group">
              <img
                src="/Logo/main-logo.png"
                alt="Minibee"
                className="h-10 md:h-12 object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative px-3.5 py-2 flex items-center gap-1.5 rounded-lg text-sm font-medium transition-all duration-200 group text-[#a1a1aa] hover:text-white"
                >
                  <link.icon size={15} className="text-[#71717a] group-hover:text-orange-400 transition-colors" />
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="#"
                className="text-sm font-medium text-[#a1a1aa] hover:text-white transition-colors px-3 py-2"
              >
                Sign In
              </a>
              <a
                href="#"
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium py-2 px-4 transition-colors"
              >
                <Zap size={15} />
                Book Demo
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-3 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-white/[0.06] transition-all"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[300px] bg-[#111113] border-l border-white/[0.06] lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/[0.06]">
                <img src="/Logo/main-logo.png" alt="Minibee" className="h-10 object-contain" />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-3 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-white/[0.06]"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-6 md:p-8 space-y-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <a
                      href={link.href}
                      className="flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-semibold transition-all text-[#a1a1aa] hover:text-white hover:bg-white/[0.04]"
                    >
                      <link.icon size={18} className="text-[#71717a]" />
                      {link.label}
                    </a>
                  </motion.div>
                ))}
              </nav>
              <div className="p-6 md:p-8 border-t border-white/[0.06] space-y-4">
                <a href="#" className="flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.08] text-white rounded-lg text-sm font-medium w-full py-3.5 transition-colors">
                  Sign In
                </a>
                <a href="#" className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium w-full py-3.5 transition-colors">
                  <Zap size={15} />
                  Book Demo
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

const floatingCards = [
  { icon: "🌏", label: "50+ Destinations", sub: "Across 6 continents" },
  { icon: "⭐", label: "4.9 Rating", sub: "10,000+ happy travellers" },
  { icon: "🏅", label: "Award Winning", sub: "Best Travel Agency 2024" },
];

export default function HeroSection() {
  const content = {
    hero_title_line1: "The World Awaits",
    hero_title_line2: "Your Next Adventure",
    hero_subtitle: "Luxury curated travel packages to the world's most breathtaking destinations.\nHandcrafted itineraries, seamless experiences, unforgettable memories.",
    hero_badge: "✈️ Crafting Extraordinary Journeys Since 2010"
  };

  return (
    <>
      <Navbar />
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"
          >
            <source src="/boomerang-hero-video.mp4" type="video/mp4" />
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"
              alt="Luxury tropical Maldives beach resort background with blue sky"
              className="w-full h-full object-cover"
            />
          </video>
          {/* Soft overlay gradient to ensure high readability of hero text and logo while maintaining turquoise water vibrance */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6">

            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-5 py-2 rounded-full"
            >
              {content.hero_badge}
            </motion.span>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
              {content.hero_title_line1}
              {content.hero_title_line2 && (
                <>
                  <br />
                  <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                    {content.hero_title_line2}
                  </span>
                </>
              )}
            </h1>

            <p className="text-lg sm:text-xl text-teal-100 max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
              {content.hero_subtitle}
            </p>

            {/* Search Box */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="max-w-4xl mx-auto mt-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-3">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3">
                    <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <div className="text-xs text-gray-400 font-medium">Destination</div>
                      <select className="text-sm font-semibold text-gray-800 bg-transparent outline-none w-full cursor-pointer">
                        <option>Where to?</option>
                        <option>Europe</option>
                        <option>Asia</option>
                        <option>Americas</option>
                        <option>Maldives</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3">
                    <Calendar className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <div className="text-xs text-gray-400 font-medium">Travel Date</div>
                      <input type="date" className="text-sm font-semibold text-gray-800 bg-transparent outline-none w-full" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3">
                    <Users className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <div className="text-xs text-gray-400 font-medium">Adults</div>
                      <select className="text-sm font-semibold text-gray-800 bg-transparent outline-none w-full cursor-pointer">
                        {[1, 2, 3, 4, 5, 6, "7+"].map(n => <option key={n} value={n}>{n} {n === 1 ? "Adult" : "Adults"}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3">
                    <Users className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <div className="text-xs text-gray-400 font-medium">Children</div>
                      <select className="text-sm font-semibold text-gray-800 bg-transparent outline-none w-full cursor-pointer">
                        {[0, 1, 2, 3, 4, 5, "6+"].map(n => <option key={n} value={n}>{n} {n === 1 ? "Child" : "Children"}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <a
                    href="#"
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg"
                  >
                    <Search className="w-5 h-5" /> Search Packages
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-6 py-3.5 rounded-2xl transition-all"
                  >
                    Custom Trip
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating Cards */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {floatingCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.15 }}
                whileHover={{ y: -4, scale: 1.03 }}
                className="glass rounded-2xl px-5 py-3 flex items-center gap-3"
              >
                <span className="text-2xl">{card.icon}</span>
                <div className="text-left">
                  <div className="text-white font-bold text-sm">{card.label}</div>
                  <div className="text-white/70 text-xs">{card.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="mt-12 flex justify-center">
            <ChevronDown className="w-8 h-8 text-white/50" />
          </motion.div>
        </div>
      </section>
    </>
  );
}
