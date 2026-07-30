import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle, Bot, Inbox, Radio, GitBranch, BarChart3, ShoppingCart, Link2, CheckCircle } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { SectionHeader } from '../common/SectionHeader'

const features = [
  { icon: CheckCircle, label: 'Official API Setup', color: '#25D366' },
  { icon: Bot, label: 'AI Chatbot', color: '#f85a22' },
  { icon: Inbox, label: 'Shared Team Inbox', color: '#7c3aed' },
  { icon: Radio, label: 'Broadcast Campaigns', color: '#0ea5e9' },
  { icon: GitBranch, label: 'Workflow Automation', color: '#f59e0b' },
  { icon: Link2, label: 'CRM Integration', color: '#10b981' },
  { icon: ShoppingCart, label: 'WhatsApp Commerce', color: '#ef4444' },
  { icon: BarChart3, label: 'Analytics Dashboard', color: '#8b5cf6' },
]

export default function WhatsAppOverview() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 ">
        <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="container-custom relative z-10" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative order-2 lg:order-1"
          >
            {/* Central WhatsApp Icon */}
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-24 h-24 rounded-3xl bg-[#25D366] flex items-center justify-center shadow-[0_0_60px_rgba(37,211,102,0.3)] z-10 relative"
              >
                <FaWhatsapp size={48} className="text-white" />
              </motion.div>

              {/* Radiating rings */}
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-[#25D366]/20"
                  style={{ width: `${i * 120}px`, height: `${i * 120}px` }}
                  animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
                />
              ))}
            </div>

            {/* Feature pills arranged around center */}
            <div className="grid grid-cols-2 gap-3 mt-8">
              {features.map(({ icon: Icon, label, color }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="glass border border-white/[0.06] rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 group hover:border-white/[0.12] transition-all"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
                    <Icon size={14} style={{ color }} />
                  </div>
                  <span className="text-xs font-medium text-[#a1a1aa] group-hover:text-white transition-colors">{label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="order-1 lg:order-2"
          >
            <span className="badge badge-orange mb-4 inline-flex">
              <FaWhatsapp size={12} />
              WhatsApp Business API
            </span>

            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight mb-5">
              The Full Power of
              <span className="text-gradient-orange"> WhatsApp</span>
              <br />for Your Business.
            </h2>

            <p className="text-[#71717a] leading-relaxed mb-8">
              Go beyond basic messaging. Minibee's Official WhatsApp Business API platform gives you enterprise-grade tools to automate conversations, run bulk campaigns, manage team inboxes, and build AI chatbots — all with Meta's full compliance and security.
            </p>

            <div className="space-y-3 mb-8">
              {[
                'Reach customers on their most-used app — WhatsApp',
                '96% average message open rate vs 20% for email',
                'Automate up to 80% of customer enquiries with AI',
                'Send rich media: images, videos, documents & catalogs',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle size={11} className="text-[#25D366]" />
                  </div>
                  <p className="text-sm text-[#a1a1aa]">{item}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Link to="/features" className="btn-primary text-sm">
                Explore Features
                <ArrowRight size={16} />
              </Link>
              <Link to="/use-cases" className="btn-secondary text-sm">
                See Use Cases
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
