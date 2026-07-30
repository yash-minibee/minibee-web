import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Zap } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { SectionHeader } from '../components/common/SectionHeader'
import { Bot, Inbox, Radio, GitBranch, Link2, BarChart3, ShoppingCart, Shield, Globe, Webhook } from 'lucide-react'
import { faqs } from '../data/faqs'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const features = [
  {
    id: 'official-api',
    icon: FaWhatsapp,
    color: '#25D366',
    badge: 'Core',
    title: 'Official WhatsApp Business API',
    subtitle: 'Enterprise-grade messaging infrastructure',
    description: 'Connect your business to WhatsApp\'s official API with Meta-approved access. Get a verified green tick, send template messages, manage multiple phone numbers, and scale to millions of conversations — all with full compliance.',
    benefits: [
      'Meta-approved Business Solution Provider setup',
      'Green tick verification assistance',
      'Multi-number and multi-account support',
      'Approved message templates for all use cases',
      'End-to-end encrypted messaging',
      'Webhook integration for real-time events',
    ],
    stats: [
      { label: 'Open Rate', value: '96%' },
      { label: 'Delivery Rate', value: '99.5%' },
      { label: 'Setup Time', value: '< 7 Days' },
    ],
  },
  {
    id: 'ai-chatbot',
    icon: Bot,
    color: '#f85a22',
    badge: 'AI',
    title: 'Intelligent AI Chatbot',
    subtitle: 'Automate conversations at scale',
    description: 'Deploy a smart AI chatbot that understands context, handles FAQs, qualifies leads, books appointments, and escalates complex queries to your team — all without writing a single line of code.',
    benefits: [
      'Natural language understanding (NLU)',
      'Context-aware multi-turn conversations',
      'Lead qualification and scoring',
      'Appointment booking integration',
      'Multilingual bot support (20+ languages)',
      'Seamless human handoff with full chat history',
    ],
    stats: [
      { label: 'Queries Automated', value: '80%' },
      { label: 'Response Time', value: '< 1s' },
      { label: 'Languages', value: '20+' },
    ],
  },
  {
    id: 'shared-inbox',
    icon: Inbox,
    color: '#7c3aed',
    badge: 'Team',
    title: 'Shared Team Inbox',
    subtitle: 'Collaborate on every conversation',
    description: 'Give your entire support and sales team a unified inbox to manage WhatsApp conversations. Assign chats, leave internal notes, use quick replies, and ensure no customer is ever left waiting.',
    benefits: [
      'Unlimited agent seats (Business+)',
      'Chat assignment and routing rules',
      'Internal notes and @mentions',
      'Canned responses for faster replies',
      'Customer history and CRM context',
      'Performance reports per agent',
    ],
    stats: [
      { label: 'Response Time Reduction', value: '60%' },
      { label: 'Agent Efficiency', value: '+45%' },
      { label: 'Customer Satisfaction', value: '94%' },
    ],
  },
  {
    id: 'broadcast',
    icon: Radio,
    color: '#0ea5e9',
    badge: 'Marketing',
    title: 'Broadcast Campaigns',
    subtitle: 'Reach thousands with one click',
    description: 'Send highly personalized bulk messages to segmented audiences. Use dynamic variables, rich media, and interactive buttons to create campaigns that convert — all within Meta\'s messaging policy.',
    benefits: [
      'Segment audiences by any custom attribute',
      'Personalize with dynamic variables',
      'Schedule campaigns in advance',
      'Rich media: images, videos, documents',
      'Interactive buttons and quick replies',
      'Real-time delivery and read analytics',
    ],
    stats: [
      { label: 'Average Open Rate', value: '94%' },
      { label: 'Click-Through Rate', value: '35%' },
      { label: 'Messages/Minute', value: '1,000+' },
    ],
  },
  {
    id: 'automation',
    icon: GitBranch,
    color: '#f59e0b',
    badge: 'Automation',
    title: 'Workflow Automation',
    subtitle: 'Build once, run forever',
    description: 'Design powerful automation workflows using our visual flow builder. Trigger actions based on customer behavior, time delays, CRM updates, and more — without writing code.',
    benefits: [
      'Visual drag-and-drop flow builder',
      'Trigger on message, event, or time',
      'Conditional branching and logic',
      'Integration with 50+ external tools',
      'Retry logic and error handling',
      'A/B testing for flows',
    ],
    stats: [
      { label: 'Time Saved/Week', value: '40h+' },
      { label: 'Flows Available', value: '50+' },
      { label: 'Integration Apps', value: '50+' },
    ],
  },
  {
    id: 'crm',
    icon: Link2,
    color: '#10b981',
    badge: 'Integration',
    title: 'CRM Integration',
    subtitle: 'Connect your entire stack',
    description: 'Sync WhatsApp conversations with Salesforce, HubSpot, Zoho, Pipedrive, and 50+ CRMs. Auto-create contacts, update deal stages, and log every interaction — automatically.',
    benefits: [
      'Bi-directional CRM sync',
      'Auto-create and update contacts',
      'Deal stage progression via WhatsApp',
      'Custom field mapping',
      'Webhook-based real-time sync',
      'Native Zapier and Make integration',
    ],
    stats: [
      { label: 'CRM Integrations', value: '50+' },
      { label: 'Sync Accuracy', value: '99.9%' },
      { label: 'Setup Time', value: '< 30 min' },
    ],
  },
  {
    id: 'analytics',
    icon: BarChart3,
    color: '#8b5cf6',
    badge: 'Insights',
    title: 'Analytics Dashboard',
    subtitle: 'Data-driven decisions',
    description: 'Track message delivery, campaign performance, bot accuracy, agent productivity, and customer satisfaction — all in one real-time dashboard with exportable reports.',
    benefits: [
      'Real-time message volume tracking',
      'Campaign ROI and conversion tracking',
      'Bot performance and accuracy metrics',
      'Agent performance leaderboard',
      'Customer satisfaction (CSAT) scoring',
      'Custom date range reports',
    ],
    stats: [
      { label: 'Metrics Tracked', value: '50+' },
      { label: 'Report Types', value: '12+' },
      { label: 'Data Retention', value: '2 Years' },
    ],
  },
  {
    id: 'commerce',
    icon: ShoppingCart,
    color: '#ef4444',
    badge: 'Commerce',
    title: 'WhatsApp Commerce',
    subtitle: 'Sell directly in chat',
    description: 'Enable customers to browse your product catalog, add items to cart, and complete purchases — all within WhatsApp. Integrate with payment gateways for a seamless checkout experience.',
    benefits: [
      'WhatsApp product catalog integration',
      'In-chat shopping cart and checkout',
      'Payment gateway integration (Razorpay, Stripe)',
      'Order confirmation and tracking',
      'Abandoned cart recovery automation',
      'Product recommendation engine',
    ],
    stats: [
      { label: 'Conversion Lift', value: '3x' },
      { label: 'Cart Abandonment Reduction', value: '65%' },
      { label: 'Avg. Order Value Increase', value: '28%' },
    ],
  },
]

function FeatureSection({ feature, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const isEven = index % 2 === 0

  return (
    <div id={feature.id} ref={ref} className="py-20 border-b border-white/[0.05] last:border-0">
      <div className="container-custom">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? -30 : 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className={isEven ? 'order-1' : 'order-1 lg:order-2'}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${feature.color}15`, border: `1px solid ${feature.color}25` }}>
                <feature.icon size={22} style={{ color: feature.color }} />
              </div>
              <span className="badge" style={{ color: feature.color, backgroundColor: `${feature.color}12`, border: `1px solid ${feature.color}20` }}>
                {feature.badge}
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">{feature.title}</h2>
            <p className="text-[#a1a1aa] font-medium mb-4">{feature.subtitle}</p>
            <p className="text-[#71717a] leading-relaxed mb-6">{feature.description}</p>

            <div className="grid sm:grid-cols-2 gap-2.5 mb-8">
              {feature.benefits.map((b) => (
                <div key={b} className="flex items-start gap-2.5">
                  <CheckCircle size={14} className="mt-0.5 flex-shrink-0" style={{ color: feature.color }} />
                  <span className="text-sm text-[#a1a1aa]">{b}</span>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {feature.stats.map(({ label, value }) => (
                <div key={label} className="glass border border-white/[0.07] rounded-xl p-4 md:p-5 text-center">
                  <p className="text-xl font-black mb-0.5" style={{ color: feature.color }}>{value}</p>
                  <p className="text-[10px] text-[#71717a] leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? 30 : -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={isEven ? 'order-2' : 'order-2 lg:order-1'}
          >
            <div className="glass border border-white/[0.08] rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)]" style={{ borderColor: `${feature.color}15` }}>
              {/* Feature preview card */}
              <div className="bg-[#111113] px-6 py-4 md:py-5 border-b flex items-center gap-2" style={{ borderColor: `${feature.color}15` }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs text-[#a1a1aa] ml-2">{feature.title}</span>
              </div>
              <div className="p-8 min-h-[300px] flex flex-col justify-center items-center gap-6">
                {/* Animated icon */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: `${feature.color}20`, border: `2px solid ${feature.color}30` }}
                >
                  <feature.icon size={36} style={{ color: feature.color }} />
                </motion.div>
                <div className="text-center">
                  <p className="text-white font-bold mb-1">{feature.title}</p>
                  <p className="text-sm text-[#71717a]">{feature.subtitle}</p>
                </div>
                {/* Mini stats */}
                <div className="w-full grid grid-cols-3 gap-2">
                  {feature.stats.map(({ label, value }) => (
                    <div key={label} className="rounded-lg p-3 text-center" style={{ backgroundColor: `${feature.color}08` }}>
                      <p className="text-base font-black" style={{ color: feature.color }}>{value}</p>
                      <p className="text-[9px] text-[#71717a] mt-0.5 leading-tight">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function FeaturesHero() {
  return (
    <section className="relative pt-32 pb-20  overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-orange-500/8 rounded-full blur-[100px]" />
      <div className="container-custom relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="badge badge-orange mb-5 inline-flex"><Zap size={12} />Platform Features</span>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight mb-6">
            Every Tool You Need to
            <br /><span className="text-gradient-orange">Win on WhatsApp.</span>
          </h1>
          <p className="text-xl text-[#71717a] max-w-2xl mx-auto mb-10">
            From AI chatbots to broadcast campaigns, shared inboxes to CRM integrations — Minibee gives you the complete WhatsApp Business toolkit to grow faster.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/contact" className="btn-primary"><Zap size={18} />Start Free Trial<ArrowRight size={16} /></Link>
            <Link to="/pricing" className="btn-secondary">View Pricing</Link>
          </div>
        </motion.div>

        {/* Feature quick-nav */}
        <div className="mt-12 flex flex-wrap gap-2.5 justify-center">
          {features.map(f => (
            <a key={f.id} href={`#${f.id}`} className="glass border border-white/[0.07] rounded-full px-4 py-2 text-xs font-medium text-[#a1a1aa] hover:text-white hover:border-white/[0.15] transition-all flex items-center gap-1.5">
              <f.icon size={12} style={{ color: f.color }} />
              {f.title.split(' ')[0]}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Features() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <>
      <FeaturesHero />
      <div className="">
        {features.map((feature, i) => (
          <FeatureSection key={feature.id} feature={feature} index={i} />
        ))}
      </div>

      {/* FAQ */}
      <section className="section-padding ">
        <div className="container-custom">
          <SectionHeader badge="FAQ" title="Feature" titleHighlight="Questions." subtitle="Common questions about Minibee's platform features and capabilities." />
          <div className="mt-10 max-w-3xl mx-auto space-y-3">
            {faqs.general.map((faq, i) => (
              <div key={i} className={`border rounded-xl overflow-hidden transition-all ${openFaq === i ? 'border-orange-500/30 bg-orange-500/[0.04]' : 'border-white/[0.07] bg-white/[0.02]'}`}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className={`text-sm font-semibold ${openFaq === i ? 'text-orange-400' : 'text-white'}`}>{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} className={openFaq === i ? 'text-orange-400' : 'text-[#71717a]'} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <p className="px-5 pb-5 text-sm text-[#71717a] leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
