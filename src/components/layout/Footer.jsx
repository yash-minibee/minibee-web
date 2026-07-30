import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, Phone, MapPin, GitBranch } from 'lucide-react'
import { FaWhatsapp, FaFacebook, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa'

const footerLinks = {
  Platform: [
    { label: 'WhatsApp API', href: '/features' },
    { label: 'AI Chatbot', href: '/features' },
    { label: 'Shared Inbox', href: '/features' },
    { label: 'Broadcast Campaigns', href: '/features' },
    { label: 'Analytics Dashboard', href: '/features' },
    { label: 'Integrations', href: '/features' },
  ],
  Solutions: [
    { label: 'E-Commerce', href: '/use-cases' },
    { label: 'Healthcare', href: '/use-cases' },
    { label: 'Education', href: '/use-cases' },
    { label: 'Retail', href: '/use-cases' },
    { label: 'Finance', href: '/use-cases' },
    { label: 'Restaurants', href: '/use-cases' },
  ],
  Company: [
    { label: 'About Us', href: '/' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' },
    { label: 'Blog', href: '/' },
    { label: 'Careers', href: '/' },
    { label: 'Partner Program', href: '/contact' },
  ],
  Resources: [
    { label: 'Documentation', href: '/' },
    { label: 'API Reference', href: '/' },
    { label: 'Case Studies', href: '/use-cases' },
    { label: 'Help Center', href: '/' },
    { label: 'Status Page', href: '/' },
    { label: 'Changelog', href: '/' },
  ],
}

const socialLinks = [
  { icon: FaInstagram, href: 'https://www.instagram.com/minibeetech/', label: 'Instagram' },
  { icon: FaFacebook, href: 'https://www.facebook.com/profile.php?id=61589006804637', label: 'Facebook' },
  { icon: FaLinkedin, href: 'https://www.linkedin.com/company/minibeetech/', label: 'LinkedIn' },
]

export default function Footer() {
  return (
    <footer className=" border-t border-white/[0.06] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Top CTA Strip */}
        <div className="py-16 border-b border-white/[0.06]">
          <div className="glass rounded-2xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Ready to transform your business?
              </h3>
              <p className="text-[#71717a]">
                Start your free trial today. No credit card required.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">

              <Link to="/contact" className="btn-primary text-sm">
                Book Free Demo
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-4">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="inline-block group mb-6">
              <img src="/Logo/main-logo.png" alt="Minibee" className="h-10 md:h-12 object-contain group-hover:scale-105 transition-transform duration-200" />
            </Link>
            <p className="text-[#71717a] text-sm leading-relaxed mb-6 max-w-xs">
              Official WhatsApp Business API solutions and premium web development for modern businesses ready to scale.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a href="mailto:minibeetech@gmail.com" className="flex items-center gap-2.5 text-sm text-[#a1a1aa] hover:text-white transition-colors group">
                <Mail size={15} className="text-orange-500 flex-shrink-0" />
                minibeetech@gmail.com
              </a>
              <a href="tel:+919712357424" className="flex items-center gap-2.5 text-sm text-[#a1a1aa] hover:text-white transition-colors">
                <Phone size={15} className="text-orange-500 flex-shrink-0" />
                +91 97123 57424
              </a>
              <a href="https://wa.me/918799167809" className="flex items-center gap-2.5 text-sm text-[#a1a1aa] hover:text-[#25D366] transition-colors">
                <FaWhatsapp size={15} className="text-[#25D366] flex-shrink-0" />
                WhatsApp Us
              </a>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-xs font-semibold text-[#71717a] uppercase tracking-wider mb-3">
                Newsletter
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#a1a1aa] focus:outline-none focus:border-orange-500/50 transition-colors"
                />
                <button className="btn-primary text-sm py-2.5 px-4">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
                {title}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-[#71717a] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#a1a1aa]">
            © {new Date().getFullYear()} Minibee Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xs text-[#a1a1aa] hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/" className="text-xs text-[#a1a1aa] hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/" className="text-xs text-[#a1a1aa] hover:text-white transition-colors">Cookie Policy</Link>
          </div>
          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#71717a] hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
