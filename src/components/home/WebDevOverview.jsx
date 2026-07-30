import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Code2, Smartphone, ShoppingBag, LayoutDashboard, Globe } from 'lucide-react'
import { SectionHeader } from '../common/SectionHeader'
import BoomerangHero from './BoomerangHero'

const services = [
  { icon: Code2, label: 'React Applications', color: '#61dafb' },
  { icon: Globe, label: 'Corporate Websites', color: '#f85a22' },
  { icon: ShoppingBag, label: 'E-Commerce Stores', color: '#10b981' },
  { icon: LayoutDashboard, label: 'Admin Panels', color: '#7c3aed' },
  { icon: Smartphone, label: 'PWA / Mobile-First', color: '#0ea5e9' },
]

export default function WebDevOverview() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-custom relative z-10" ref={ref}>
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium mb-6">
              <Code2 className="text-blue-400 w-4 h-4" />
              <span className="text-white">Web Development</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              We Build Digital Experiences <br />
              <span className="text-[#a1a1aa]">That Convert.</span>
            </h2>
            
            <p className="text-lg text-[#71717a] mb-8 leading-relaxed">
              From high-performance corporate websites to complex web applications. 
              We deliver scalable, modern digital solutions tailored to your brand.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              {services.map((service, i) => {
                const Icon = service.icon
                return (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                    <Icon style={{ color: service.color }} size={16} />
                    <span className="text-sm font-medium text-white/80">{service.label}</span>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center gap-4">
              <Link to="/portfolio" className="btn-primary text-sm">
                View Portfolio
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

          {/* Right Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-3 flex justify-center"
          >
            {/* Desktop Mac Window Mockup (Hidden on mobile) */}
            <div className="hidden md:block w-full rounded-2xl border border-white/[0.08] bg-[#09090b] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative group">
              {/* Browser Header */}
              <div className="h-10 border-b border-white/[0.08] bg-[#111113] flex items-center px-4 gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 bg-[#1a1a1f] rounded-md px-3 py-1 text-xs text-[#a1a1aa] flex items-center justify-center gap-2 max-w-sm mx-auto shadow-inner">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                  boomerangglobaltravels.com
                </div>
              </div>

              {/* Browser Content */}
              <div className="relative overflow-hidden w-full h-[480px]">
                {/* Dynamically scale the hero component so it perfectly fills the mockup window width/height */}
                <div 
                  className="absolute top-0 left-0 origin-top-left"
                  style={{ 
                    width: 'calc(100% / 0.55)', 
                    height: 'calc(100% / 0.55)', 
                    transform: 'scale(0.55)' 
                  }}
                >
                  <BoomerangHero />
                </div>
              </div>
            </div>

            {/* Mobile Phone Mockup (Hidden on desktop) */}
            <div className="md:hidden relative border-[10px] sm:border-[12px] border-[#121212] rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] ring-1 ring-white/10 bg-[#09090b] w-full max-w-[340px] mx-auto h-[700px] sm:h-[750px] flex flex-col">
              {/* iPhone Notch */}
              <div className="absolute top-0 inset-x-0 h-5 sm:h-6 flex justify-center z-50">
                <div className="w-[110px] h-full bg-[#121212] rounded-b-2xl"></div>
              </div>

              {/* Browser URL Bar for Phone */}
              <div className="bg-[#111113] pt-7 pb-2 px-4 flex items-center justify-center border-b border-white/[0.05] relative z-40">
                <div className="bg-[#1a1a1f] rounded-full px-4 py-1 text-[10px] text-[#a1a1aa] flex items-center gap-2 shadow-inner">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                  boomerangglobaltravels.com
                </div>
              </div>

              {/* Phone Content */}
              <div className="relative flex-1 overflow-hidden w-full bg-[#0b141a]">
                <div className="absolute inset-0 overflow-y-auto overflow-x-hidden pb-8 no-scrollbar w-full">
                  <BoomerangHero />
                </div>
              </div>
              
              {/* iPhone Home Indicator */}
              <div className="h-6 w-full flex items-center justify-center absolute bottom-0 z-50 pointer-events-none bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                <div className="w-[120px] h-[4px] bg-white/60 rounded-full mb-1.5"></div>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  )
}
