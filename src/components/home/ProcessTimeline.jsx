import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { SectionHeader } from '../common/SectionHeader'
import { Search, Lightbulb, Palette, Code2, TestTube, Rocket, HeadphonesIcon } from 'lucide-react'

const steps = [
  { icon: Search, number: '01', title: 'Discovery', description: 'Deep-dive into your business goals, target audience, and technical requirements to build the perfect foundation.', color: '#f85a22' },
  { icon: Lightbulb, number: '02', title: 'Strategy & Planning', description: 'We craft a detailed roadmap covering architecture, technology stack, timeline, and milestones.', color: '#f59e0b' },
  { icon: Palette, number: '03', title: 'UI/UX Design', description: 'Premium wireframes and high-fidelity prototypes that deliver intuitive, conversion-focused user experiences.', color: '#7c3aed' },
  { icon: Code2, number: '04', title: 'Development', description: 'Clean, scalable code built with the latest technologies — React, Laravel, or WhatsApp API — reviewed at every stage.', color: '#0ea5e9' },
  { icon: TestTube, number: '05', title: 'QA & Testing', description: 'Rigorous testing across devices, browsers, and edge cases to ensure a flawless, production-ready release.', color: '#10b981' },
  { icon: Rocket, number: '06', title: 'Launch & Deploy', description: 'Smooth deployment to cloud infrastructure with monitoring, performance optimization, and zero-downtime rollout.', color: '#ef4444' },
  { icon: HeadphonesIcon, number: '07', title: 'Support & Growth', description: 'Ongoing support, analytics reviews, and iterative improvements to maximize your ROI post-launch.', color: '#25D366' },
]

export default function ProcessTimeline() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="section-padding ">
      <div className="container-custom">
        <SectionHeader
          badge="Our Process"
          title="How We Deliver"
          titleHighlight="Excellence."
          subtitle="A proven, transparent process that gets you from idea to live product — on time, every time."
        />

        <div ref={ref} className="mt-12 relative">
          {/* Vertical connector line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/50 via-orange-500/20 to-transparent -translate-x-1/2" />

          <div className="space-y-8 lg:space-y-0 lg:grid lg:gap-y-10">
            {steps.map(({ icon: Icon, number, title, description, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative flex items-start gap-6 lg:gap-0 ${
                  i % 2 === 0 ? 'lg:flex-row lg:pr-[calc(50%+2rem)] lg:text-right' : 'lg:flex-row-reverse lg:pl-[calc(50%+2rem)]'
                }`}
              >
                {/* Content card */}
                <div className={`card-glass p-8 group hover:border-orange-500/20 w-full lg:max-w-sm ${i % 2 === 0 ? 'lg:ml-auto' : 'lg:mr-auto'}`}>
                  <div className={`flex items-center gap-3 mb-3 ${i % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}>
                      <Icon size={18} style={{ color }} />
                    </div>
                    <span className="text-xs font-black text-[#3f3f46] tracking-widest">{number}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-[#71717a] leading-relaxed">{description}</p>
                </div>

                {/* Center dot */}
                <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 items-center justify-center z-10"
                  style={{ borderColor: color, backgroundColor: `${color}30` }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
