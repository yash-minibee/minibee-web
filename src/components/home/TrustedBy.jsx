import { motion } from 'framer-motion'
import { 
  SiShopify, SiWoocommerce, SiHubspot, SiZoho, 
  SiZapier, SiGooglesheets, SiRazorpay, SiStripe, 
  SiCalendly, SiN8N
} from 'react-icons/si'
import { FaSalesforce, FaWhatsapp, FaFacebook, FaCreditCard, FaFacebookSquare } from 'react-icons/fa'

const brands = [
  { name: 'Shopify', icon: SiShopify, color: '#95BF47' },
  { name: 'WooCommerce', icon: SiWoocommerce, color: '#96588a' },
  { name: 'InstaMojo', icon: FaCreditCard, color: '#4b0082' },
  { name: 'HubSpot', icon: SiHubspot, color: '#FF7A59' },
  { name: 'Zoho CRM', icon: SiZoho, color: '#E1251B' },
  { name: 'Salesforce', icon: FaSalesforce, color: '#00A1E0' },
  { name: 'Calendly', icon: SiCalendly, color: '#006BFF' },
  { name: 'Stripe', icon: SiStripe, color: '#008CDD' },
  { name: 'Razorpay', icon: SiRazorpay, color: '#3385ff' },
  { name: 'WhatsApp Pay', icon: FaWhatsapp, color: '#25D366' },
  { name: 'Facebook Lead Forms', icon: FaFacebook, color: '#1877F2' },
  { name: 'FB Leads App', icon: FaFacebookSquare, color: '#1877F2' },
  { name: 'Zapier', icon: SiZapier, color: '#FF4A00' },
  { name: 'N8N', icon: SiN8N, color: '#EA4335' },
  { name: 'Google Sheets', icon: SiGooglesheets, color: '#34A853' },
]

export default function TrustedBy() {
  return (
    <section className="py-10 border-y border-white/[0.06] overflow-hidden ">
      <div className="container-custom mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#a1a1aa]">
          Integrated with the tools you already use
        </p>
      </div>
      <div className="relative">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#09090b] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#09090b] to-transparent z-10 pointer-events-none" />
        
        <div className="flex gap-8 items-center" style={{ animation: 'marquee 30s linear infinite', width: 'max-content' }}>
          {[...brands, ...brands].map((brand, i) => (
            <div
              key={i}
              className="flex-shrink-0 px-5 py-2.5 glass rounded-xl border border-white/[0.06] text-[#71717a] text-sm font-semibold whitespace-nowrap hover:text-white hover:border-white/[0.12] hover:bg-white/[0.03] transition-all cursor-default flex items-center gap-2.5 group"
            >
              <brand.icon 
                className="transition-transform duration-300 group-hover:scale-110" 
                size={16} 
                style={{ color: brand.color }}
              />
              {brand.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
