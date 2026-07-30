import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { SectionHeader } from '../common/SectionHeader'
import CountUp from '../common/CountUp'
import { stats } from '../../data/stats'

export default function Stats() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 ">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/3 to-transparent" />
      </div>

      <div className="container-custom relative z-10">
        <SectionHeader
          badge="By the Numbers"
          title="Trusted by Businesses"
          titleHighlight="Worldwide."
          subtitle="Real results for real businesses — from startups to enterprises across 15+ countries."
        />

        <div ref={ref} className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map(({ value, suffix, label, description }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-glass p-8 text-center group col-span-1"
            >
              <div className="text-3xl lg:text-4xl font-black text-gradient-orange mb-1 group-hover:scale-105 transition-transform">
                <CountUp value={value} suffix={suffix} duration={2} />
              </div>
              <p className="text-sm font-semibold text-white mb-1">{label}</p>
              <p className="text-xs text-[#a1a1aa]">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
