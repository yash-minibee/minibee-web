import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, Zap, CheckCircle } from 'lucide-react'
import { FaWhatsapp, FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa'
import { SectionHeader } from '../components/common/SectionHeader'

const contactInfo = [
  {
    icon: Mail,
    label: 'Email Us',
    value: 'minibeetech@gmail.com',
    sub: 'We reply within 4 hours',
    href: 'mailto:minibeetech@gmail.com',
    color: '#f85a22',
  },
  {
    icon: FaWhatsapp,
    label: 'WhatsApp',
    value: '+91 87991 67809',
    sub: 'Mon–Sat 9:30am–6:30pm IST',
    href: 'https://wa.me/918799167809',
    color: '#25D366',
  },
  {
    icon: Phone,
    label: 'Call Us',
    value: '+91 97123 57424',
    sub: 'Mon–Sat 9:30am–6:30pm IST',
    href: 'tel:+919712357424',
    color: '#7c3aed',
  },
  {
    icon: MapPin,
    label: 'Office',
    value: '1101, R.K. Empire',
    sub: 'near Mavdi Circle, Rajkot 360004',
    href: '#',
    color: '#0ea5e9',
  },
]

const businessTypes = ['Startup', 'SME', 'Enterprise', 'Agency', 'E-Commerce', 'Healthcare', 'Education', 'Other']
const services = ['WhatsApp Business API', 'AI Chatbot', 'Broadcast Campaigns', 'CRM Integration', 'Website Development', 'E-Commerce Store', 'Corporate Website', 'Custom Solution']

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '', company: '', email: '', phone: '', businessType: '', service: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSubmitted(true) }, 1500)
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20  overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-orange-500/8 rounded-full blur-[100px]" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge badge-orange mb-5 inline-flex">Get in Touch</span>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight mb-6">
              Let's Build Something
              <br /><span className="text-gradient-orange">Amazing Together.</span>
            </h1>
            <p className="text-xl text-[#71717a] max-w-xl mx-auto">
              Tell us about your project. We'll get back to you within 4 business hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="pb-16 " ref={ref}>
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map(({ icon: Icon, label, value, sub, href, color }, i) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08 }}
                className="card-glass p-8 group"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <p className="text-xs text-[#71717a] mb-1 font-medium">{label}</p>
                <p className="text-sm font-bold text-white mb-1 group-hover:text-orange-300 transition-colors">{value}</p>
                <p className="text-xs text-[#a1a1aa]">{sub}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="section-padding ">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-start">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="glass border border-white/[0.08] rounded-2xl p-10 lg:p-12">
                <h2 className="text-3xl font-bold mb-3">
                  Request a <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Free Demo</span>
                </h2>
                <p className="text-[#71717a] text-sm mb-8">Fill out the form and our team will reach out within 4 business hours.</p>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-[#71717a] text-sm">We'll get back to you within 4 business hours. Check your email for a confirmation.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-semibold text-[#71717a] mb-2 block">Full Name *</label>
                        <input name="name" value={formData.name} onChange={handleChange} required placeholder="John Smith" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#a1a1aa] focus:outline-none focus:border-orange-500/50 transition-colors" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#71717a] mb-2 block">Company</label>
                        <input name="company" value={formData.company} onChange={handleChange} placeholder="Acme Corp" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#a1a1aa] focus:outline-none focus:border-orange-500/50 transition-colors" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-semibold text-[#71717a] mb-2 block">Email Address *</label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="john@company.com" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#a1a1aa] focus:outline-none focus:border-orange-500/50 transition-colors" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#71717a] mb-2 block">Phone Number</label>
                        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 97123 57424" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#a1a1aa] focus:outline-none focus:border-orange-500/50 transition-colors" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-semibold text-[#71717a] mb-2 block">Business Type</label>
                        <select name="businessType" value={formData.businessType} onChange={handleChange} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors">
                          <option value="" className="bg-[#111113]">Select...</option>
                          {businessTypes.map(t => <option key={t} value={t} className="bg-[#111113]">{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#71717a] mb-2 block">Interested In</label>
                        <select name="service" value={formData.service} onChange={handleChange} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors">
                          <option value="" className="bg-[#111113]">Select...</option>
                          {services.map(s => <option key={s} value={s} className="bg-[#111113]">{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#71717a] mb-2 block">Message *</label>
                      <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="Tell us about your project, goals, and any specific requirements..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#a1a1aa] focus:outline-none focus:border-orange-500/50 transition-colors resize-none" />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 text-base">
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                          Sending...
                        </span>
                      ) : (
                        <><Send size={18} />Send Message</>
                      )}
                    </button>
                    <p className="text-xs text-[#a1a1aa] text-center">By submitting, you agree to our Privacy Policy. We never share your data.</p>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Book Demo CTA */}
              <div className="glass-orange border border-orange-500/20 rounded-2xl p-8">
                <div className="w-12 h-12 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center mb-4">
                  <Zap size={22} className="text-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Instant Chat on WhatsApp</h3>
                <p className="text-sm text-[#a1a1aa] mb-5">See Minibee in action with a live 30-minute walkthrough tailored to your business needs.</p>
                <a href="https://wa.me/918799167809?text=Hi%20Minibee!%20I%20would%20like%20to%20book%20a%20free%20demo." target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center text-sm">
                  <FaWhatsapp size={16} className="text-white" />
                  WhatsApp Now
                </a>
              </div>

              {/* Business hours */}
              <div className="glass border border-white/[0.08] rounded-2xl p-8">
                <div className="flex items-center gap-2.5 mb-4">
                  <Clock size={16} className="text-orange-400" />
                  <h3 className="text-sm font-bold text-white">Business Hours</h3>
                </div>
                <div className="space-y-2.5">
                  {[
                    { day: 'Monday – Saturday', hours: '9:30 AM – 6:30 PM IST' },
                    { day: 'Sunday', hours: 'Closed' },
                  ].map(({ day, hours }) => (
                    <div key={day} className="flex items-center justify-between text-sm">
                      <span className="text-[#a1a1aa]">{day}</span>
                      <span className="text-[#71717a] text-xs">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social */}
              <div className="glass border border-white/[0.08] rounded-2xl p-8">
                <h3 className="text-sm font-bold text-white mb-4">Follow Minibee</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { icon: FaLinkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/company/minibeetech/', color: '#0A66C2' },
                    { icon: FaFacebook, label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61589006804637', color: '#1877F2' },
                    { icon: FaInstagram, label: 'Instagram', href: 'https://www.instagram.com/minibeetech/', color: '#E1306C' },
                    { icon: FaWhatsapp, label: 'WhatsApp', href: 'https://wa.me/918799167809', color: '#25D366' },
                  ].map(({ icon: Icon, label, href, color }) => (
                    <a key={label} href={href} className="flex items-center gap-2 glass border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-[#a1a1aa] hover:text-white transition-all hover:border-white/[0.12]">
                      <Icon size={14} style={{ color }} />
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="pb-20 ">
        <div className="container-custom">
          <div className="glass border border-white/[0.08] rounded-2xl overflow-hidden h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin size={32} className="text-orange-500 mx-auto mb-3" />
              <p className="text-white font-semibold">Mumbai, Maharashtra, India</p>
              <p className="text-sm text-[#71717a] mt-1">Remote-first company · Global delivery</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
