import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight, Image as ImageIcon, Search, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { API_BASE, getImageUrl } from '../hooks/useAdminApi'

export default function Blog() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const POSTS_PER_PAGE = 6

  useEffect(() => {
    fetch(`${API_BASE}/blog.php?action=list`)
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          setBlogs(res.data)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Filter Blogs based on search query
  const filteredBlogs = blogs.filter(post => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    const titleMatch = post.title.toLowerCase().includes(q)
    const excerptMatch = (post.excerpt || '').toLowerCase().includes(q)
    const contentMatch = (post.content || '').toLowerCase().includes(q)
    const tagsMatch = (post.tags || '').toLowerCase().includes(q)
    return titleMatch || excerptMatch || contentMatch || tagsMatch
  })

  const isSearching = searchQuery.trim().length > 0

  const featuredPost = !isSearching && filteredBlogs.length > 0 ? filteredBlogs[0] : null
  const regularPosts = isSearching 
    ? filteredBlogs 
    : (filteredBlogs.length > 1 ? filteredBlogs.slice(1) : [])

  // Format Date Helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="pt-32 pb-24 flex items-center justify-center min-h-[60vh]">
        <span className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="pt-32 pb-24 font-sans">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
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
            className="text-[#a1a1aa] text-lg leading-relaxed"
          >
            Insights, updates, and expert guides on scaling your business with modern web technology and WhatsApp API.
          </motion.p>
        </div>

        {/* Search bar row */}
        <div className="max-w-md mx-auto mb-16 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#a1a1aa] z-10">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, tags or topic..."
            className="w-full bg-[#0f0f11]/80 backdrop-blur-md border border-white/[0.06] hover:border-white/[0.12] rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all shadow-xl relative z-0"
          />
        </div>

        {/* Featured Post */}
        {featuredPost && currentPage === 1 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <Link to={`/blog/${featuredPost.slug}`} className="block card-glass group overflow-hidden rounded-3xl">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="h-64 md:h-auto bg-gradient-to-br from-orange-500/20 to-purple-600/20 relative border-r border-white/[0.04] overflow-hidden flex items-center justify-center">
                  {featuredPost.featured_image ? (
                    <img 
                      src={getImageUrl(featuredPost.featured_image)} 
                      alt={featuredPost.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-mesh opacity-50" />
                      <ImageIcon size={48} className="text-[#3f3f46]" />
                    </>
                  )}
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="badge badge-orange">{featuredPost.author || 'Admin'}</span>
                    <div className="flex items-center gap-1.5 text-xs text-[#71717a]">
                      <Calendar size={12} /> {formatDate(featuredPost.created_at)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#71717a]">
                      <Eye size={12} /> {featuredPost.views || 0} views
                    </div>
                  </div>
                  {featuredPost.tags && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {featuredPost.tags.split('\n').map(t => t.trim()).filter(Boolean).slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-[10px] font-semibold text-orange-400 font-mono">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white group-hover:text-orange-400 transition-colors leading-snug">
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
        ) : null}

        {/* Empty State */}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/[0.06] rounded-3xl bg-[#0f0f11]/30">
            {isSearching ? (
              <>
                <Search size={32} className="text-[#3f3f46] mx-auto mb-4" />
                <p className="text-[#71717a] font-medium">No matching articles found</p>
                <p className="text-xs text-[#3f3f46] mt-1">Try modifying your search query or view all articles</p>
              </>
            ) : (
              <p className="text-[#71717a] font-medium">No articles published yet</p>
            )}
          </div>
        )}

        {/* Grid */}
        {regularPosts.length > 0 && (
          <div className="space-y-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE).map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + (i * 0.05) }}
                >
                  <Link to={`/blog/${post.slug}`} className="block card-glass group overflow-hidden flex flex-col rounded-3xl">
                    <div className="aspect-video w-full bg-white/[0.02] border-b border-white/[0.04] relative overflow-hidden flex items-center justify-center flex-shrink-0">
                      {post.featured_image ? (
                        <img 
                          src={getImageUrl(post.featured_image)} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-mesh opacity-30" />
                          <ImageIcon size={32} className="text-[#3f3f46]" />
                        </>
                      )}
                    </div>
                    <div className="p-6 md:p-8 flex-1 flex flex-col min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="badge badge-white">{post.author || 'Admin'}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-3 text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-[#a1a1aa] text-xs leading-relaxed mb-4 flex-1 line-clamp-3">
                        {post.excerpt}
                      </p>
                      {post.tags && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {post.tags.split('\n').map(t => t.trim()).filter(Boolean).slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-[9px] font-semibold text-orange-400 font-mono">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs text-[#71717a] border-t border-white/[0.06] pt-4 mt-auto">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} /> {formatDate(post.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye size={12} /> {post.views || 0}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination controls */}
            {Math.ceil(regularPosts.length / POSTS_PER_PAGE) > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1))
                    window.scrollTo({ top: 400, behavior: 'smooth' })
                  }}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-white/[0.08] hover:border-white/20 disabled:opacity-30 disabled:hover:border-white/[0.08] rounded-xl text-xs font-bold text-[#a1a1aa] hover:text-white transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.ceil(regularPosts.length / POSTS_PER_PAGE) }).map((_, idx) => {
                  const page = idx + 1
                  return (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page)
                        window.scrollTo({ top: 400, behavior: 'smooth' })
                      }}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentPage === page
                          ? 'bg-orange-500 text-white'
                          : 'border border-white/[0.08] hover:border-white/20 text-[#a1a1aa] hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}

                <button
                  onClick={() => {
                    const totalPages = Math.ceil(regularPosts.length / POSTS_PER_PAGE)
                    setCurrentPage(prev => Math.min(prev + 1, totalPages))
                    window.scrollTo({ top: 400, behavior: 'smooth' })
                  }}
                  disabled={currentPage === Math.ceil(regularPosts.length / POSTS_PER_PAGE)}
                  className="px-4 py-2 border border-white/[0.08] hover:border-white/20 disabled:opacity-30 disabled:hover:border-white/[0.08] rounded-xl text-xs font-bold text-[#a1a1aa] hover:text-white transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
