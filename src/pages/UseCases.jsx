import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, CheckCircle } from 'lucide-react'
import { SectionHeader } from '../components/common/SectionHeader'
import { useCases } from '../data/useCases'

function UseCaseCard({ useCase, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-6 py-5 rounded-2xl border transition-all duration-200 ${
        isActive
          ? 'border-orange-500/40 bg-orange-500/8 text-white'
          : 'border-white/[0.06] text-[#71717a] hover:text-white hover:border-white/[0.12]'
      }`}
    >
      <span className="text-xl mr-3">{useCase.icon}</span>
      <span className="text-sm font-semibold">{useCase.industry}</span>
    </button>
  )
}

export default function UseCases() {
  const [active, setActive] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const uc = useCases[active]

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20  overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-orange-500/8 rounded-full blur-[100px]" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge badge-orange mb-5 inline-flex">Industry Solutions</span>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight mb-6">
              WhatsApp Solutions for
              <br /><span className="text-gradient-orange">Every Industry.</span>
            </h1>
            <p className="text-xl text-[#71717a] max-w-2xl mx-auto mb-10">
              See how businesses across industries use Minibee's WhatsApp API to automate operations, delight customers, and drive measurable growth.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/contact" className="btn-primary"><Zap size={18} />Book a Demo<ArrowRight size={16} /></Link>
              <Link to="/pricing" className="btn-secondary">View Pricing</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive use case explorer */}
      <section ref={ref} className="section-padding ">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
            {/* Industry selector */}
            <div className="lg:sticky lg:top-24 space-y-2">
              <p className="text-xs font-bold text-[#a1a1aa] uppercase tracking-widest mb-4">Select Industry</p>
              {useCases.map((uc, i) => (
                <UseCaseCard key={uc.id} useCase={uc} isActive={i === active} onClick={() => setActive(i)} />
              ))}
            </div>

            {/* Detail panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="space-y-8"
              >
                {/* Header */}
                <div className="glass border border-white/[0.08] rounded-2xl p-8">
                  <div className="flex items-center gap-4 mb-5">
                    <span className="text-4xl">{uc.icon}</span>
                    <div>
                      <span className="badge badge-orange text-xs mb-2">{uc.industry}</span>
                      <h2 className="text-2xl font-bold text-white">{uc.tagline}</h2>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">The Challenge</p>
                      <p className="text-sm text-[#a1a1aa] leading-relaxed">{uc.challenge}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2">The Solution</p>
                      <p className="text-sm text-[#a1a1aa] leading-relaxed">{uc.solution}</p>
                    </div>
                  </div>
                </div>

                {/* Stats + Benefits */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Key stats */}
                  <div className="glass border border-white/[0.08] rounded-2xl p-6">
                    <p className="text-xs font-bold text-[#71717a] uppercase tracking-wider mb-4">Key Results</p>
                    <div className="space-y-3">
                      {Object.entries(uc.stats).map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                          <span className="text-sm text-[#a1a1aa] capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="text-lg font-black" style={{ color: uc.color }}>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="glass border border-white/[0.08] rounded-2xl p-6">
                    <p className="text-xs font-bold text-[#71717a] uppercase tracking-wider mb-4">Key Benefits</p>
                    <div className="space-y-2.5">
                      {uc.benefits.map((b) => (
                        <div key={b} className="flex items-center gap-2.5">
                          <CheckCircle size={14} style={{ color: uc.color }} className="flex-shrink-0" />
                          <span className="text-sm text-[#a1a1aa]">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Workflow */}
                <div className="glass border border-white/[0.08] rounded-2xl p-6">
                  <p className="text-xs font-bold text-[#71717a] uppercase tracking-wider mb-5">Automation Flow</p>
                  <div className="flex flex-col sm:flex-row gap-0">
                    {uc.workflow.map((step, i) => (
                      <div key={i} className="flex sm:flex-col items-center gap-3 sm:gap-2 flex-1">
                        <div className="flex sm:flex-col items-center gap-2 sm:gap-0 flex-1">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                            style={{ backgroundColor: uc.color }}
                          >
                            {i + 1}
                          </div>
                          {i < uc.workflow.length - 1 && (
                            <div className="flex-1 sm:w-full sm:h-px h-px w-full sm:flex-none sm:my-1" style={{ backgroundColor: `${uc.color}30` }} />
                          )}
                        </div>
                        <p className="text-xs text-[#a1a1aa] text-center leading-relaxed flex-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex gap-3">
                  <a 
                    href={`https://wa.me/918799167809?text=${encodeURIComponent(`Hi Minibee, I'm interested in WhatsApp automation for my ${uc.industry} business. How can I get started?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-sm"
                  >
                    Get Started in {uc.industry}
                    <ArrowRight size={16} />
                  </a>
                  <Link to="/contact" className="btn-secondary text-sm">
                    Book a Demo
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  )
}
