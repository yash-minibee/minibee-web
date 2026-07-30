import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Calendar, Users, ChevronDown, Compass, Sparkles, Ship, Briefcase, Info, MessageSquare } from "lucide-react";

const destinationLinks = [
  "Asia",
  "Africa",
  "North America",
  "South America",
  "Antarctica",
  "Europe",
  "Australia/Oceania/Pacific"
];

const navLinks = [
  { label: "Explore Destinations", to: "#", dropdown: destinationLinks },
  { label: "Holiday Packages",     to: "#" },
  { label: "Activities",           to: "#" },
  { label: "Cruises",              to: "#" },
  { label: "MICE",                 to: "#" },
  { label: "About",                to: "#" },
  { label: "Contact",              to: "#" },
];

const bottomNavItems = [
  { label: "Packages",   to: "#", icon: Compass },
  { label: "Activities", to: "#", icon: Sparkles },
  { label: "Cruises",    to: "#", icon: Ship },
  { label: "MICE",       to: "#", icon: Briefcase },
  { label: "About",      to: "#", icon: Info },
  { label: "Contact",    to: "#", icon: MessageSquare },
];

function Navbar() {
  const [currency, setCurrency] = useState("USD");
  const [openDrop, setOpenDrop] = useState(null);
  const scrolled = false;
  const isTransparent = true;
  const linkCls = `text-xs xl:text-sm font-semibold transition-colors hover:text-amber-500 ${isTransparent ? "text-white" : "text-gray-700"}`;

  const isActive = (to) => false;

  const headerHeightClass = scrolled
    ? "h-[74px] sm:h-[80px]"
    : "h-[90px] sm:h-[96px]";

  const logoHeightClass = scrolled
    ? "h-[58px] sm:h-[64px]"
    : "h-[74px] sm:h-[80px]";

  return (
    <>
      <nav className={`absolute top-0 left-0 right-0 z-30 transition-all duration-300 ${isTransparent ? "bg-transparent" : "bg-white shadow-md"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className={`flex items-center justify-between transition-all duration-300 ${headerHeightClass}`}>

            {/* Mobile Left Spacer */}
            <div className="hidden xl:hidden" />

            {/* Logo */}
            <div className="flex-1 xl:flex-initial flex justify-center xl:justify-start py-2 max-xl:absolute max-xl:left-1/2 max-xl:top-1/2 max-xl:-translate-x-1/2 max-xl:-translate-y-1/2">
              <a
                href="#"
                className="flex items-center rounded-xl transition-all duration-300"
              >
                <img
                  src="/Boomerang-Logo.png"
                  alt="Boomerang Travel"
                  style={isTransparent ? { filter: "drop-shadow(0px 2px 8px rgba(255, 255, 255, 0.9)) drop-shadow(0px 1px 3px rgba(255, 255, 255, 0.9))" } : {}}
                  className={`w-auto object-contain transition-all duration-300 ${logoHeightClass}`}
                />
              </a>
            </div>

            {/* Desktop Nav */}
            <div className="hidden xl:flex items-center gap-4 xl:gap-5">
              {navLinks.map((item) =>
                item.dropdown ? (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setOpenDrop(item.label)}
                    onMouseLeave={() => setOpenDrop(null)}
                  >
                    <button className={`flex items-center gap-1 ${linkCls}`}>
                      {item.label} <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <AnimatePresence>
                      {openDrop === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                        >
                          {item.dropdown.map((d) => (
                            <a
                              key={d}
                              href="#"
                              className="block px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                            >
                              {d}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <a key={item.label} href={item.to} className={linkCls}>
                    {item.label}
                  </a>
                )
              )}
            </div>

            {/* Right Actions */}
            <div className="hidden xl:flex items-center gap-3 xl:gap-4">
              <div 
                onClick={() => setCurrency(currency === "USD" ? "AUD" : "USD")}
                className={`relative flex p-0.5 rounded-full border transition-all cursor-pointer select-none ${isTransparent ? "bg-white/10 border-white/20" : "bg-gray-100 border-gray-200"}`}
              >
                <span
                  className={`relative px-3.5 py-1.5 text-[11px] xl:text-xs font-bold rounded-full transition-colors duration-300 z-10 ${
                    currency === "USD"
                      ? "text-white"
                      : `${isTransparent ? "text-white/70 hover:text-white" : "text-gray-500 hover:text-gray-800"}`
                  }`}
                >
                  {currency === "USD" && (
                    <motion.span
                      layoutId="activeCurrencyDesktop"
                      className="absolute inset-0 bg-amber-500 rounded-full shadow-md z-[-1]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  USD ($)
                </span>
                <span
                  className={`relative px-3.5 py-1.5 text-[11px] xl:text-xs font-bold rounded-full transition-colors duration-300 z-10 ${
                    currency === "AUD"
                      ? "text-white"
                      : `${isTransparent ? "text-white/70 hover:text-white" : "text-gray-500 hover:text-gray-800"}`
                  }`}
                >
                  {currency === "AUD" && (
                    <motion.span
                      layoutId="activeCurrencyDesktop"
                      className="absolute inset-0 bg-amber-500 rounded-full shadow-md z-[-1]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  AUD (A$)
                </span>
              </div>

              <a
                href="#"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs xl:text-sm font-bold px-4 xl:px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-amber-200"
              >
                Plan Your Trip
              </a>
            </div>
          </div>
        </div>
      </nav>
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
    <div className="relative w-full h-full min-h-[600px] overflow-hidden">
      <Navbar />
      <section className="relative min-h-screen flex items-center justify-center">
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

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
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
    </div>
  );
}
