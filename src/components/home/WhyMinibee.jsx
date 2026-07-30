import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Zap, Globe, HeadphonesIcon, TrendingUp, Code2 } from 'lucide-react'
import { SectionHeader } from '../common/SectionHeader'

const reasons = [
  {
    icon: Shield,
    title: 'Official Meta Partner',
    description: 'We\'re an authorized Meta Business Solution Provider, ensuring your WhatsApp account stays verified, compliant, and protected.',
    color: '#25D366',
    badge: 'Certified',
  },
  {
    icon: Zap,
    title: 'Rapid Deployment',
    description: 'Go live in days, not months. Our streamlined onboarding process gets your WhatsApp API running with your first automation in under a week.',
    color: '#f85a22',
    badge: 'Fast',
  },
  {
    icon: Code2,
    title: 'Premium Engineering',
    description: 'Every solution we build is production-ready, scalable, and maintainable. We use modern architectures that grow with your business.',
    color: '#7c3aed',
    badge: 'Quality',
  },
  {
    icon: Globe,
    title: 'Multi-Channel Reach',
    description: 'From WhatsApp to web, CRM to commerce — Minibee connects your entire digital ecosystem into one seamless, intelligent platform.',
    color: '#0ea5e9',
    badge: 'Unified',
  },
  {
    icon: TrendingUp,
    title: 'Measurable Results',
    description: 'Data-driven campaigns with real-time analytics. Track delivery, read rates, conversions, and ROI — all in one intuitive dashboard.',
    color: '#f59e0b',
    badge: 'Proven',
  },
  {
    icon: HeadphonesIcon,
    title: 'Dedicated Support',
    description: 'A real team that cares. Get a dedicated account manager, priority WhatsApp support, and expert guidance at every stage of growth.',
    color: '#ef4444',
    badge: 'Always On',
  },
]

export default function WhyMinibee() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section className="section-padding ">
      <div className="container-custom">
        <SectionHeader
          badge="Why Minibee"
          title="Built Different. Designed"
          titleHighlight="for Results."
          subtitle="We combine deep technical expertise with a relentless focus on business outcomes — so every solution we deliver drives measurable growth."
        />

        <div ref={ref} className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map(({ icon: Icon, title, description, color, badge }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-glass p-8 group relative overflow-hidden"
            >
              {/* Background glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[1.25rem]"
                style={{ background: `radial-gradient(circle at 0% 0%, ${color}08, transparent 70%)` }}
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}
                  >
                    <Icon size={22} style={{ color }} />
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ color, backgroundColor: `${color}12`, border: `1px solid ${color}20` }}
                  >
                    {badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2.5 group-hover:text-orange-100 transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-[#71717a] leading-relaxed">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Link to="/features" className="btn-secondary inline-flex">
            See All Features
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
