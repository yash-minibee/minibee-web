import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Zap, ArrowRight } from 'lucide-react'
import { navLinks } from '../../data/navigation'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const location = useLocation()
  const servicesRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setServicesOpen(false)
  }, [location])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
        <div className="container-custom">
          <div className="flex items-center justify-between h-[72px] md:h-[80px]">
            {/* Logo */}
            <Link to="/" className="inline-block group">
              <img
                src="/Logo/main-logo.png"
                alt="Minibee"
                className="h-10 md:h-12 object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  end={link.href === '/'}
                  className={({ isActive }) =>
                    `relative px-3.5 py-2 flex items-center gap-1.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? 'text-white'
                        : 'text-[#a1a1aa] hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <link.icon size={15} className={isActive ? 'text-orange-500' : 'text-[#71717a] group-hover:text-orange-400 transition-colors'} />
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute inset-0 bg-white/[0.08] border border-white/[0.05] rounded-lg -z-10"
                          transition={{ type: 'spring', duration: 0.4 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="https://miniapi.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#a1a1aa] hover:text-white transition-colors px-3 py-2"
              >
                Sign In
              </a>
              <Link
                to="/contact"
                className="btn-primary text-sm py-2 px-4"
              >
                <Zap size={15} />
                Book Demo
              </Link>
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
                    <NavLink
                      to={link.href}
                      end={link.href === '/'}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                            : 'text-[#a1a1aa] hover:text-white hover:bg-white/[0.04]'
                        }`
                      }
                    >
                      <link.icon size={18} className={link.href === location.pathname ? 'text-orange-500' : 'text-[#71717a]'} />
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>
              <div className="p-6 md:p-8 border-t border-white/[0.06] space-y-4">
                <a 
                  href="https://miniapi.in/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full justify-center text-sm py-3.5"
                >
                  Sign In
                </a>
                <Link to="/contact" className="btn-primary w-full justify-center text-sm py-3.5">
                  <Zap size={15} />
                  Book Demo
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
