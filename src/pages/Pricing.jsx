import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Check, X, ChevronDown, Star, Users, ShoppingCart, Share2 } from 'lucide-react'
import { SectionHeader } from '../components/common/SectionHeader'
import { faqs } from '../data/faqs'
import { api } from '../hooks/useAdminApi'

// Icon map for addons — keyed by icon_key stored in DB
const ADDON_ICONS = {
  'extra-agent':    <Users size={20} />,
  'shopify-store':  <ShoppingCart size={20} />,
  'bot-trigger':    <Zap size={20} />,
  'social-channels':<Share2 size={20} />,
}

function PricingCard({ plan, isYearly, isINR }) {
  const price = isINR
    ? (isYearly ? plan.inrYearlyPrice : plan.inrMonthlyPrice)
    : (isYearly ? plan.yearlyPrice : plan.monthlyPrice)
  const symbol = isINR ? '₹' : '$'

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`h-full relative rounded-2xl border flex flex-col ${
        plan.popular
          ? 'border-orange-500/50 bg-gradient-to-b from-orange-500/10 to-[#111113] shadow-[0_0_40px_rgba(248,90,34,0.15)]'
          : 'border-white/[0.08] bg-[#111113]'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="badge badge-orange px-4 py-1.5 text-xs font-bold shadow-lg">
            <Star size={11} fill="currentColor" />
            Most Popular
          </span>
        </div>
      )}

      <div className="p-8 flex-1 flex flex-col">
        <div className="mb-6 min-h-[76px]">
          <h3 className="text-xl font-bold text-white mb-1.5">{plan.name}</h3>
          <p className="text-xs text-[#71717a] leading-relaxed">{plan.tagline}</p>
        </div>

        <div className="mb-7 h-[68px] flex flex-col justify-end">
          {price ? (
            <div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black text-white leading-none">{symbol}{price}</span>
                <span className="text-[#71717a] mb-1">/mo</span>
              </div>
              {isYearly && (
                <div className="text-green-400 text-xs mt-1.5 font-bold leading-none">Applicable in Annual Pack</div>
              )}
            </div>
          ) : (
            <div className="text-3xl font-black text-white leading-none pb-1">Custom</div>
          )}
        </div>

        <Link
          to={plan.href}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all mb-7 ${
            plan.popular ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          {plan.cta}
          <ArrowRight size={15} />
        </Link>

        <div className="space-y-2.5">
          {plan.features.map((f) => (
            <div key={f} className="flex items-center gap-2.5">
              <Check size={14} className={plan.popular ? 'text-orange-400' : 'text-green-400'} />
              <span className="text-sm text-[#a1a1aa]">{f}</span>
            </div>
          ))}
          {plan.notIncluded.map((f) => (
            <div key={f} className="flex items-center gap-2.5 opacity-40">
              <X size={14} className="text-[#71717a]" />
              <span className="text-sm text-[#71717a] line-through">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)
  const [isINR, setIsINR] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  // All data from DB
  const [plans, setPlans] = useState([])
  const [comparison, setComparison] = useState([])
  const [addons, setAddons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.pricing.list(),
      api.comparison.list(),
      api.addons.list(),
    ])
      .then(([plansRes, compRes, addonsRes]) => {
        if (plansRes.success) {
          setPlans(plansRes.data.map(item => ({
            id:             item.id,
            name:           item.name,
            tagline:        item.tagline,
            monthlyPrice:   item.monthly_usd  ?? null,
            yearlyPrice:    item.yearly_usd   ?? null,
            inrMonthlyPrice:item.monthly_inr  ?? null,
            inrYearlyPrice: item.yearly_inr   ?? null,
            popular:        Boolean(item.popular),
            cta:            item.cta,
            href:           item.href,
            features:       Array.isArray(item.features)     ? item.features     : [],
            notIncluded:    Array.isArray(item.not_included)  ? item.not_included : [],
          })))
        }
        if (compRes.success) {
          setComparison(compRes.data.map(item => ({
            feature:    item.feature,
            starter:    item.starter    === 'true' ? true : item.starter    === 'false' ? false : item.starter,
            growth:     item.growth     === 'true' ? true : item.growth     === 'false' ? false : item.growth,
            premium:    item.premium    === 'true' ? true : item.premium    === 'false' ? false : item.premium,
            enterprise: item.enterprise === 'true' ? true : item.enterprise === 'false' ? false : item.enterprise,
          })))
        }
        if (addonsRes.success) {
          setAddons(addonsRes.data)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20  overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-orange-500/8 rounded-full blur-[100px]" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge badge-orange mb-5 inline-flex">Simple Pricing</span>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight mb-6">
              Pricing That Scales
              <br /><span className="text-gradient-orange">With Your Business.</span>
            </h1>
            <p className="text-xl text-[#71717a] max-w-xl mx-auto">
              Start free. No credit card required. Upgrade when you're ready. Cancel anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Toggles */}
      <section className="pb-8 flex flex-col items-center gap-6">
        <button
          onClick={() => setIsINR(!isINR)}
          className="relative flex items-center justify-center p-1 rounded-full border border-orange-500/20 bg-orange-500/10 shadow-[0_0_15px_rgba(248,90,34,0.05)] cursor-pointer outline-none"
        >
          <motion.div
            className="absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] bg-orange-500 rounded-full shadow-md"
            animate={{ x: isINR ? "100%" : "0%" }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
          <span className={`relative z-10 w-24 py-1.5 text-center text-sm font-semibold transition-colors duration-300 ${!isINR ? 'text-white' : 'text-orange-500/70'}`}>
            USD ($)
          </span>
          <span className={`relative z-10 w-24 py-1.5 text-center text-sm font-semibold transition-colors duration-300 ${isINR ? 'text-white' : 'text-orange-500/70'}`}>
            INR (₹)
          </span>
        </button>

        <button
          onClick={() => setIsYearly(!isYearly)}
          className="flex items-center justify-center gap-4 cursor-pointer outline-none"
        >
          <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-white' : 'text-[#71717a]'}`}>Monthly</span>
          <div className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isYearly ? 'bg-orange-500' : 'bg-white/20'}`}>
            <motion.div
              animate={{ x: isYearly ? 28 : 4 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
            />
          </div>
          <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-white' : 'text-[#71717a]'}`}>
            Yearly
            <span className="ml-2 text-xs text-green-400 font-bold">Save 20%</span>
          </span>
        </button>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 " ref={ref}>
        <div className="container-custom">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[480px] rounded-2xl border border-white/[0.06] bg-[#111113] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.08 }}
                  className="h-full"
                >
                  <PricingCard plan={plan} isYearly={isYearly} isINR={isINR} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="pb-20">
        <div className="container-custom">
          <SectionHeader
            badge="Boost Your Plan"
            title="Optional"
            titleHighlight="Add-ons."
            subtitle="Customize your experience with additional features tailored to your needs."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {loading
              ? [...Array(4)].map((_, i) => (
                  <div key={i} className="h-48 rounded-2xl border border-white/[0.06] bg-[#111113] animate-pulse" />
                ))
              : addons.map((addon) => {
                  const hasPrice = addon.price_usd !== null && addon.price_usd !== undefined
                  const price = isINR ? addon.price_inr : addon.price_usd
                  const currencySymbol = isINR ? '₹' : '$'

                  return (
                    <motion.div
                      key={addon.id}
                      whileHover={{ y: -4, scale: 1.01 }}
                      className="glass border border-white/[0.08] bg-[#111113] rounded-2xl p-6 flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4 text-orange-400">
                          {ADDON_ICONS[addon.icon_key] ?? <Zap size={20} />}
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">{addon.name}</h4>
                        <p className="text-xs text-[#71717a] leading-relaxed mb-6">{addon.description}</p>
                      </div>

                      <div className="pt-4 border-t border-white/[0.04] flex items-end justify-between">
                        <div>
                          {hasPrice ? (
                            <div className="flex items-end gap-1">
                              <span className="text-2xl font-black text-white">{currencySymbol}{price}</span>
                              <span className="text-[10px] text-[#71717a] mb-1 font-semibold">/ {addon.period}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col">
                              <span className="text-lg font-bold text-white">Custom</span>
                              <span className="text-[9px] text-[#71717a] font-semibold">{addon.period} Pricing</span>
                            </div>
                          )}
                        </div>
                        <Link to="/contact" className="text-xs font-bold text-[#a1a1aa] hover:text-white flex items-center gap-1 transition-colors">
                          Inquire <ArrowRight size={12} />
                        </Link>
                      </div>
                    </motion.div>
                  )
                })
            }
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="section-padding ">
        <div className="container-custom">
          <SectionHeader badge="Compare Plans" title="Full Feature" titleHighlight="Comparison." />
          <div className="mt-12 overflow-x-auto">
            {loading ? (
              <div className="h-64 rounded-2xl border border-white/[0.06] bg-[#111113] animate-pulse" />
            ) : (
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/[0.07]">
                    <th className="text-left py-4 pr-6 text-sm font-semibold text-[#71717a] w-[35%]">Feature</th>
                    {['Starter', 'Growth', 'Premium', 'Enterprise'].map(p => (
                      <th key={p} className={`text-center py-4 px-4 text-sm font-bold ${p === 'Growth' ? 'text-orange-400' : 'text-white'}`}>{p}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.map(({ feature, starter, growth, premium, enterprise }, i) => (
                    <tr key={feature} className={`border-b border-white/[0.04] ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
                      <td className="py-3.5 pr-6 text-sm text-[#a1a1aa]">{feature}</td>
                      {[starter, growth, premium, enterprise].map((val, j) => (
                        <td key={j} className="py-3.5 px-4 text-center">
                          {val === true ? (
                            <Check size={16} className="text-green-400 mx-auto" />
                          ) : val === false ? (
                            <span className="text-[#3f3f46] text-lg">—</span>
                          ) : (
                            <span className={`text-xs font-medium ${j === 1 ? 'text-orange-300' : 'text-[#a1a1aa]'}`}>{val}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="pb-20 ">
        <div className="container-custom">
          <div className="glass border border-white/[0.08] rounded-2xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="badge badge-white mb-3 inline-flex text-xs">Enterprise</span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Need a custom solution?</h3>
              <p className="text-[#71717a] max-w-xl">
                For large enterprises with complex requirements — custom API limits, on-premise deployment, dedicated engineering support, and SLA agreements. Let's build something great together.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link to="/contact" className="btn-primary text-sm"><Zap size={16} />Book Enterprise Demo<ArrowRight size={15} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding ">
        <div className="container-custom">
          <SectionHeader badge="Pricing FAQ" title="Billing" titleHighlight="Questions." />
          <div className="mt-10 max-w-3xl mx-auto space-y-3">
            {faqs.pricing.map((faq, i) => (
              <div key={i} className={`border rounded-xl overflow-hidden ${openFaq === i ? 'border-orange-500/30 bg-orange-500/[0.04]' : 'border-white/[0.07] bg-white/[0.02]'}`}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className={`text-sm font-semibold ${openFaq === i ? 'text-orange-400' : 'text-white'}`}>{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }}>
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
