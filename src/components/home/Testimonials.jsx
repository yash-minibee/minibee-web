import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { SectionHeader } from '../common/SectionHeader'
import { testimonials } from '../../data/testimonials'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((c) => (c + 1) % testimonials.length)

  const visible = [
    testimonials[(current - 1 + testimonials.length) % testimonials.length],
    testimonials[current],
    testimonials[(current + 1) % testimonials.length],
  ]

  return (
    <section className="section-padding  overflow-hidden">
      <div className="container-custom">
        <SectionHeader
          badge="Client Stories"
          title="Businesses That Chose"
          titleHighlight="Minibee."
          subtitle="Real testimonials from companies who transformed their customer communication and digital presence with us."
        />

        <div ref={ref} className="mt-16">
          {/* Featured testimonial */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto"
            >
              <div className="glass border border-white/[0.08] rounded-2xl p-8 md:p-12 relative overflow-hidden">
                {/* Quote icon */}
                <div className="absolute top-6 right-8 text-[120px] leading-none text-white/[0.03] font-serif select-none pointer-events-none">
                  "
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} className="text-orange-400" fill="currentColor" />
                  ))}
                </div>

                <blockquote className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-8 relative z-10">
                  "{testimonials[current].content}"
                </blockquote>

                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, #f85a22, #ff9e70)` }}
                  >
                    {testimonials[current].avatar}
                  </div>
                  <div>
                    <p className="font-bold text-white">{testimonials[current].name}</p>
                    <p className="text-sm text-[#71717a]">
                      {testimonials[current].role} · {testimonials[current].company}
                    </p>
                  </div>
                  <span className="ml-auto badge badge-orange text-xs">
                    {testimonials[current].industry}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full glass border border-white/[0.08] flex items-center justify-center text-[#71717a] hover:text-white hover:border-white/[0.2] transition-all"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? 'w-6 bg-orange-500' : 'w-1.5 bg-white/20'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full glass border border-white/[0.08] flex items-center justify-center text-[#71717a] hover:text-white hover:border-white/[0.2] transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Secondary cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {testimonials.slice(0, 3).map((t, i) => (
              <motion.button
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1 }}
                onClick={() => setCurrent(i)}
                className={`text-left glass border rounded-xl p-8 transition-all ${
                  current === i ? 'border-orange-500/40 bg-orange-500/5' : 'border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, #f85a22, #ff9e70)` }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-[#71717a]">{t.company}</p>
                  </div>
                </div>
                <p className="text-xs text-[#a1a1aa] line-clamp-2 leading-relaxed">"{t.content}"</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
