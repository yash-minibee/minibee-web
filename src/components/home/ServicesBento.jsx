import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { Code2, Bot, Radio, GitBranch, Link2, BarChart3, ShoppingCart, Inbox, Globe, LayoutDashboard, Shield, Zap } from 'lucide-react'
import { SectionHeader } from '../common/SectionHeader'

const services = [
  {
    icon: FaWhatsapp,
    title: 'Official WhatsApp API',
    description: 'Get Meta-verified and start sending messages at scale with full compliance.',
    color: '#25D366',
    size: 'large',
  },
  {
    icon: Bot,
    title: 'AI Chatbot',
    description: 'Intelligent bots that handle enquiries, qualify leads, and convert customers 24/7.',
    color: '#f85a22',
    size: 'medium',
  },
  {
    icon: Radio,
    title: 'Broadcast Campaigns',
    description: 'Reach thousands with personalized messages in one click.',
    color: '#0ea5e9',
    size: 'medium',
  },
  {
    icon: Inbox,
    title: 'Shared Team Inbox',
    description: 'Collaborate across agents with a unified WhatsApp inbox.',
    color: '#7c3aed',
    size: 'small',
  },
  {
    icon: GitBranch,
    title: 'Workflow Automation',
    description: 'Build no-code automation flows for any business process.',
    color: '#f59e0b',
    size: 'small',
  },
  {
    icon: Link2,
    title: 'CRM Integration',
    description: 'Sync Salesforce, HubSpot, Zoho, and 50+ tools.',
    color: '#10b981',
    size: 'small',
  },
  {
    icon: Code2,
    title: 'React & Web Apps',
    description: 'Modern, high-performance web applications built with the latest stack.',
    color: '#61dafb',
    size: 'large',
  },
  {
    icon: ShoppingCart,
    title: 'E-Commerce',
    description: 'Conversion-optimized stores with WhatsApp checkout integration.',
    color: '#ef4444',
    size: 'medium',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Real-time insights on messages, campaigns, and customer journeys.',
    color: '#8b5cf6',
    size: 'medium',
  },
]

const gridClasses = {
  large: 'md:col-span-2',
  medium: 'col-span-1',
  small: 'col-span-1',
}

export default function ServicesBento() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="section-padding ">
      <div className="container-custom">
        <SectionHeader
          badge="Our Services"
          title="Everything You Need to"
          titleHighlight="Grow Faster."
          subtitle="WhatsApp Business solutions and premium web development — all under one roof, all engineered for scale."
        />

        <div ref={ref} className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
          {services.map(({ icon: Icon, title, description, color, size }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`${gridClasses[size]} card-glass p-8 group relative overflow-hidden flex flex-col gap-4`}
            >
              {/* Hover glows */}
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: color }}
              />
              <div
                className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: color }}
              />

              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}
              >
                <Icon size={18} style={{ color }} />
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-white text-sm mb-1">{title}</h3>
                <p className="text-[#71717a] text-xs leading-relaxed">{description}</p>
              </div>


            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
