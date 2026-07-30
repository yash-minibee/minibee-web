import { Home, Star, Briefcase, Tag, Mail, BookOpen, Layout } from 'lucide-react'

export const navLinks = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Features', href: '/features', icon: Star },
  { label: 'Use Cases', href: '/use-cases', icon: Briefcase },
  { label: 'Portfolio', href: '/portfolio', icon: Layout },
  { label: 'Pricing', href: '/pricing', icon: Tag },
  { label: 'Blog', href: '/blog', icon: BookOpen },
  { label: 'Contact', href: '/contact', icon: Mail },
]

export const megaMenuServices = {
  whatsapp: [
    { label: 'Official API Setup', desc: 'Get verified & connected', icon: '✅' },
    { label: 'AI Chatbots', desc: 'Intelligent automation', icon: '🤖' },
    { label: 'Shared Team Inbox', desc: 'Collaborate at scale', icon: '📥' },
    { label: 'Broadcast Campaigns', desc: 'Reach thousands instantly', icon: '📢' },
    { label: 'CRM Integration', desc: 'Sync your customer data', icon: '🔗' },
    { label: 'Analytics Dashboard', desc: 'Data-driven insights', icon: '📊' },
  ],
  webdev: [
    { label: 'React Applications', desc: 'Modern web apps', icon: '⚛️' },
    { label: 'E-Commerce', desc: 'Online stores that convert', icon: '🛒' },
    { label: 'Corporate Websites', desc: 'Brand authority online', icon: '🏢' },
    { label: 'API Development', desc: 'Scalable backends', icon: '🔌' },
    { label: 'UI/UX Design', desc: 'Beautiful interfaces', icon: '🎨' },
    { label: 'Laravel Development', desc: 'Powerful PHP apps', icon: '🐘' },
  ],
}
