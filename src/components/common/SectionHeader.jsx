import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export function SectionHeader({ badge, title, titleHighlight, subtitle, center = true, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div ref={ref} className={`${center ? 'text-center' : ''} ${className}`}>
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="inline-flex mb-4"
        >
          <span className="badge badge-orange">{badge}</span>
        </motion.div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight ${center ? 'max-w-3xl mx-auto' : ''}`}
      >
        {title}{' '}
        {titleHighlight && (
          <span className="text-gradient-orange">{titleHighlight}</span>
        )}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`mt-4 text-base sm:text-lg text-[#71717a] leading-relaxed ${center ? 'max-w-2xl mx-auto' : 'max-w-xl'}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}

export function GradientText({ children, className = '' }) {
  return (
    <span className={`text-gradient-orange ${className}`}>{children}</span>
  )
}
