import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const BLOG_POSTS = [
  {
    id: 1,
    title: 'How WhatsApp API is Revolutionizing Customer Support in 2024',
    excerpt: 'Discover the incredible ROI of integrating automated WhatsApp solutions into your customer service workflows.',
    category: 'WhatsApp API',
    date: 'Oct 24, 2024',
    readTime: '5 min read',
    featured: true,
  },
  {
    id: 2,
    title: '5 Ways a Premium Website Increases Conversion Rates',
    excerpt: 'Your website is your digital storefront. Learn how high-end design translates directly into sales.',
    category: 'Web Development',
    date: 'Oct 18, 2024',
    readTime: '4 min read',
  },
  {
    id: 3,
    title: 'Automating E-commerce Abandoned Carts with WhatsApp',
    excerpt: 'Stop losing sales. A step-by-step guide to recovering abandoned carts using targeted WhatsApp messages.',
    category: 'Growth',
    date: 'Oct 12, 2024',
    readTime: '6 min read',
  },
  {
    id: 4,
    title: 'The Future of AI Chatbots in Retail',
    excerpt: 'How artificial intelligence is shaping the future of retail customer experiences.',
    category: 'AI & Tech',
    date: 'Oct 05, 2024',
    readTime: '3 min read',
  }
]

export default function Blog() {
  const featuredPost = BLOG_POSTS.find(p => p.featured)
  const regularPosts = BLOG_POSTS.filter(p => !p.featured)

  return (
    <div className="pt-32 pb-24">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
          >
            The Minibee <span className="text-gradient-orange">Blog</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#a1a1aa] text-lg"
          >
            Insights, updates, and expert guides on scaling your business with modern web technology and WhatsApp API.
          </motion.p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <Link to={`/blog/${featuredPost.id}`} className="block card-glass group overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="h-64 md:h-auto bg-gradient-to-br from-orange-500/20 to-purple-600/20 relative border-r border-white/[0.04]">
                  <div className="absolute inset-0 bg-mesh opacity-50" />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="badge badge-orange">{featuredPost.category}</span>
                    <div className="flex items-center gap-1.5 text-xs text-[#71717a]">
                      <Calendar size={12} /> {featuredPost.date}
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-orange-400 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-[#a1a1aa] leading-relaxed mb-8">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-orange-500 font-semibold text-sm group-hover:gap-3 transition-all">
                    Read Article <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
            >
              <Link to={`/blog/${post.id}`} className="block card-glass h-full group overflow-hidden flex flex-col">
                <div className="h-48 bg-white/[0.02] border-b border-white/[0.04] relative">
                   <div className="absolute inset-0 bg-mesh opacity-30" />
                </div>
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="badge badge-white">{post.category}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-orange-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[#a1a1aa] text-sm leading-relaxed mb-6 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[#71717a] border-t border-white/[0.06] pt-4 mt-auto">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} /> {post.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} /> {post.readTime}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
