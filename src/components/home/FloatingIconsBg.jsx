import { motion } from 'framer-motion'
import { 
  SiShopify, SiWoocommerce, SiHubspot, SiZoho, 
  SiZapier, SiRazorpay, SiStripe, SiNotion, SiAirtable, SiMeta 
} from 'react-icons/si'
import { FaSalesforce, FaSlack, FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa'
import { TbBrandTwilio } from 'react-icons/tb'

const BG_ICONS = [
  { icon: FaWhatsapp, color: '#25D366' },
  { icon: SiShopify, color: '#95BF47' },
  { icon: SiWoocommerce, color: '#96588a' },
  { icon: SiHubspot, color: '#FF7A59' },
  { icon: SiZoho, color: '#E1251B' },
  { icon: SiZapier, color: '#FF4A00' },
  { icon: SiRazorpay, color: '#3385ff' },
  { icon: SiStripe, color: '#008CDD' },
  { icon: SiNotion, color: '#ffffff' },
  { icon: SiAirtable, color: '#18BFFF' },
  { icon: FaSalesforce, color: '#00A1E0' },
  { icon: FaSlack, color: '#E01E5A' },
  { icon: TbBrandTwilio, color: '#F22F46' },
  { icon: SiMeta, color: '#0468FF' },
  { icon: FaFacebook, color: '#1877F2' },
  { icon: FaInstagram, color: '#E1306C' },
]

export default function FloatingIconsBg() {
  // Generate pseudo-random positions for 40+ icons to cover the background
  const elements = [...BG_ICONS, ...BG_ICONS, ...BG_ICONS].map((item, i) => {
    // Stable pseudo-random numbers based on index
    const top = `${(i * 17) % 100}%`
    const left = `${(i * 23) % 100}%`
    const delay = (i * 0.3) % 5
    const duration = 12 + (i % 8)
    const size = 16 + (i % 12) // Between 16px and 28px
    const baseOpacity = 0.03 + ((i % 5) * 0.015) // Extremely subtle: 0.03 to 0.09

    return (
      <motion.div
        key={i}
        initial={{ y: 0, opacity: 0 }}
        animate={{ 
          y: [0, -40 - (i % 20), 0], 
          opacity: [baseOpacity, baseOpacity * 2, baseOpacity] 
        }}
        transition={{
          y: { duration, repeat: Infinity, ease: "easeInOut", delay },
          opacity: { duration: duration * 0.8, repeat: Infinity, ease: "easeInOut", delay }
        }}
        className="absolute"
        style={{ top, left }}
      >
        <item.icon size={size} style={{ color: item.color }} />
      </motion.div>
    )
  })

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      <div className="relative w-full h-full max-w-[1400px] mx-auto">
        {elements}
      </div>
    </div>
  )
}
