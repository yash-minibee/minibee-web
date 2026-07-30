import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, MessageCircle } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

export default function HomeCTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="section-padding  relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-[#111113] to-[#111113] p-12 md:p-20 text-center"
        >
          {/* Decorative orbs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-500/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <span className="badge badge-orange">
              <Zap size={12} />
              Get Started Today — Free Trial
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-5 relative z-10"
          >
            Ready to Transform Your
            <br />
            <span className="text-gradient-orange">Customer Experience?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-lg text-[#71717a] max-w-xl mx-auto mb-10 relative z-10"
          >
            Join 200+ businesses already using Minibee to automate conversations, deliver better experiences, and grow revenue.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10"
          >
            <Link to="/contact" className="btn-primary text-base px-8 py-4 glow-orange">
              <Zap size={20} />
              Book Free Demo
              <ArrowRight size={18} />
            </Link>
            <a
              href="https://wa.me/918799167809"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-base px-8 py-4"
            >
              <FaWhatsapp size={20} className="text-[#25D366]" />
              Chat on WhatsApp
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="mt-6 text-xs text-[#52525b] relative z-10"
          >
            No credit card required · 14-day free trial · Cancel anytime
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
