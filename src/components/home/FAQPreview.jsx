import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { SectionHeader } from '../common/SectionHeader'
import { faqs } from '../../data/faqs'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`border rounded-xl overflow-hidden transition-all duration-300 ${
        open ? 'border-orange-500/30 bg-orange-500/[0.04]' : 'border-white/[0.07] bg-white/[0.02]'
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left group"
      >
        <span className={`text-sm font-semibold transition-colors ${open ? 'text-orange-400' : 'text-white group-hover:text-orange-100'}`}>
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 ml-4"
        >
          <ChevronDown size={16} className={open ? 'text-orange-400' : 'text-[#71717a]'} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="px-5 pb-5 text-sm text-[#71717a] leading-relaxed">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQPreview() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="section-padding ">
      <div className="container-custom">
        <SectionHeader
          badge="FAQ"
          title="Questions We Get"
          titleHighlight="All the Time."
          subtitle="Everything you need to know about Minibee's WhatsApp API platform and web development services."
        />

        <div ref={ref} className="mt-12 max-w-3xl mx-auto space-y-3">
          {faqs.general.slice(0, 5).map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <Link to="/contact" className="btn-secondary inline-flex text-sm">
            Have more questions? Contact us
            <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
