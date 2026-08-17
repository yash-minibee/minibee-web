import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, Edit2, Trash2, Calendar, User, Eye, BarChart3, FileText, Image as ImageIcon, Check, ExternalLink, RefreshCw } from 'lucide-react'
import { api, getImageUrl } from '../../hooks/useAdminApi'

export default function BlogAdminDashboard() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [togglingId, setTogglingId] = useState(null)
  const [error, setError] = useState('')
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const POSTS_PER_PAGE = 6

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedAuthor, selectedStatus])

  const navigate = useNavigate()

  const loadBlogs = async () => {
    try {
      const res = await api.blog.list()
      if (res.success) {
        setBlogs(res.data)
      } else {
        setError(res.error || 'Failed to load blogs')
      }
    } catch {
      setError('Cannot reach server. Verify backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBlogs()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this blog post permanently? This action cannot be undone.')) return
    setDeletingId(id)
    try {
      const res = await api.blog.delete(id)
      if (res.success) {
        loadBlogs()
      } else {
        setError(res.error || 'Failed to delete blog post')
      }
    } catch {
      setError('Network error deleting blog post')
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleStatus = async (id) => {
    setTogglingId(id)
    try {
      const res = await api.blog.toggleStatus(id)
      if (res.success) {
        loadBlogs()
      } else {
        setError(res.error || 'Failed to toggle status')
      }
    } catch {
      setError('Network error toggling status')
    } finally {
      setTogglingId(null)
    }
  }

  // Get unique authors for filter dropdown
  const uniqueAuthors = Array.from(new Set(blogs.map(b => b.author || 'Admin')))

  // Calculate filtered list
  const filteredBlogs = blogs.filter(post => {
    const q = searchQuery.toLowerCase().trim()
    const titleMatch = post.title.toLowerCase().includes(q)
    const excerptMatch = (post.excerpt || '').toLowerCase().includes(q)
    const contentMatch = (post.content || '').toLowerCase().includes(q)
    const tagsMatch = (post.tags || '').toLowerCase().includes(q)
    const matchesSearch = titleMatch || excerptMatch || contentMatch || tagsMatch
    
    const authorMatch = selectedAuthor === 'All' || (post.author || 'Admin') === selectedAuthor
    const postStatus = post.status || 'published'
    const statusMatch = selectedStatus === 'All' || postStatus === selectedStatus
    
    return matchesSearch && authorMatch && statusMatch
  })

  // Format Date String helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Blog Management</h1>
          <p className="text-sm text-[#71717a] mt-1">Manage articles, updates, and documentation posts</p>
        </div>
        <Link
          to="/blog/admin/add"
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(248,90,34,0.3)] cursor-pointer"
        >
          <Plus size={16} /> New Article
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Stats Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#0f0f11] border border-white/[0.05] rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/5 border border-orange-500/10 flex items-center justify-center text-orange-400">
            <FileText size={22} />
          </div>
          <div>
            <p className="text-xs text-[#71717a] uppercase font-bold tracking-wider">Total Articles</p>
            <h4 className="text-2xl font-extrabold text-white mt-0.5">{blogs.length}</h4>
          </div>
        </div>
        
        <div className="bg-[#0f0f11] border border-white/[0.05] rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/5 border border-green-500/10 flex items-center justify-center text-green-400">
            <Check size={22} />
          </div>
          <div>
            <p className="text-xs text-[#71717a] uppercase font-bold tracking-wider">Published Blogs</p>
            <h4 className="text-2xl font-extrabold text-white mt-0.5">
              {blogs.filter(b => b.status === 'published' || !b.status).length}
            </h4>
          </div>
        </div>

        <div className="bg-[#0f0f11] border border-white/[0.05] rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/5 border border-yellow-500/10 flex items-center justify-center text-yellow-400">
            <FileText size={22} className="text-yellow-400/80" />
          </div>
          <div>
            <p className="text-xs text-[#71717a] uppercase font-bold tracking-wider">Draft Posts</p>
            <h4 className="text-2xl font-extrabold text-white mt-0.5">
              {blogs.filter(b => b.status === 'draft').length}
            </h4>
          </div>
        </div>

        <div className="bg-[#0f0f11] border border-white/[0.05] rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-400">
            <Eye size={22} />
          </div>
          <div>
            <p className="text-xs text-[#71717a] uppercase font-bold tracking-wider">Total Views</p>
            <h4 className="text-2xl font-extrabold text-white mt-0.5">
              {blogs.reduce((sum, b) => sum + (parseInt(b.views) || 0), 0).toLocaleString()}
            </h4>
          </div>
        </div>

        <div className="bg-[#0f0f11] border border-white/[0.05] rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/5 border border-purple-500/10 flex items-center justify-center text-purple-400">
            <Calendar size={22} />
          </div>
          <div>
            <p className="text-xs text-[#71717a] uppercase font-bold tracking-wider">Latest Update</p>
            <h4 className="text-sm font-bold text-white mt-1.5">
              {blogs.length > 0 ? formatDate(blogs[0].created_at) : 'No posts yet'}
            </h4>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#52525b]">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, excerpt text..."
            className="w-full bg-[#0f0f11] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all"
          />
        </div>
        {/* Author filter */}
        <div className="w-full sm:w-48">
          <select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            className="w-full bg-[#0f0f11] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 cursor-pointer appearance-none"
          >
            <option value="All">All Authors</option>
            {uniqueAuthors.map(author => (
              <option key={author} value={author}>{author}</option>
            ))}
          </select>
        </div>
        {/* Status filter */}
        <div className="w-full sm:w-48">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-[#0f0f11] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 cursor-pointer appearance-none"
          >
            <option value="All">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Blogs list */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <span className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/[0.06] rounded-3xl bg-[#0f0f11]/30">
          <ImageIcon size={40} className="text-[#3f3f46] mx-auto mb-4" />
          <p className="text-[#71717a] font-medium">No articles found</p>
          <p className="text-xs text-[#3f3f46] mt-1">Try modifying your search query or add a new article</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE).map(post => (
              <div 
                key={post.id} 
                className="bg-[#0f0f11] border border-white/[0.06] rounded-3xl overflow-hidden shadow-lg hover:border-orange-500/20 transition-all flex flex-col group"
              >
                {/* Cover Visual */}
                <div className="aspect-video w-full bg-white/5 border-b border-white/[0.04] relative overflow-hidden flex items-center justify-center flex-shrink-0">
                  {post.featured_image ? (
                    <img 
                      src={getImageUrl(post.featured_image)} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="text-[#52525b] flex flex-col items-center gap-2">
                      <ImageIcon size={32} />
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#3f3f46]">No featured image</span>
                    </div>
                  )}
                  
                  {/* Status Badge overlay */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border backdrop-blur-md ${
                      post.status === 'draft'
                        ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                        : 'bg-green-500/10 border-green-500/20 text-green-400'
                    }`}>
                      {post.status || 'published'}
                    </span>
                  </div>
                  
                  {/* Meta details overlay */}
                  <div className="absolute bottom-3 left-3 bg-[#0a0a0c]/80 backdrop-blur-md rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-[10px] text-orange-400 font-medium">
                    <Calendar size={11} />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                </div>

                {/* Text Area */}
                <div className="p-6 flex-1 flex flex-col min-w-0">
                  <div className="flex items-center justify-between text-[10px] text-[#71717a] font-semibold mb-2 uppercase tracking-wide">
                    <div className="flex items-center gap-1.5">
                      <User size={11} />
                      <span>{post.author || 'Admin'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={11} className="text-[#52525b]" />
                      <span>{post.views || 0} views</span>
                    </div>
                  </div>
                  
                  <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 mb-2 leading-snug">
                    {post.title}
                  </h3>
                  
                  <p className="text-xs text-[#71717a] line-clamp-3 mb-4 leading-relaxed flex-1">
                    {post.excerpt || 'No description provided.'}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 border-t border-white/[0.04] pt-4 mt-auto">
                    <button
                      onClick={() => navigate(`/blog/admin/edit/${post.id}`)}
                      className="flex-1 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/10 text-xs font-semibold text-[#a1a1aa] hover:text-white rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(post.id)}
                      disabled={togglingId === post.id}
                      className={`px-3.5 py-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 ${
                        post.status === 'draft'
                          ? 'bg-yellow-500/[0.06] hover:bg-yellow-500/10 border-yellow-500/10 text-yellow-400 hover:text-yellow-300'
                          : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.05] hover:border-white/10 text-[#a1a1aa] hover:text-white'
                      }`}
                      title={post.status === 'draft' ? "Publish this draft" : "Revert to draft"}
                    >
                      {togglingId === post.id ? (
                        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <RefreshCw size={13} />
                      )}
                    </button>
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-blue-500/[0.06] hover:bg-blue-500/10 border border-blue-500/10 text-blue-400 hover:text-blue-300 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                      title="View published article"
                    >
                      <ExternalLink size={13} />
                    </a>
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={deletingId === post.id}
                      className="px-3.5 py-2 bg-red-500/[0.06] hover:bg-red-500/10 border border-red-500/10 text-red-400 hover:text-red-300 rounded-xl flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
                    >
                      {deletingId === post.id ? (
                        <span className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {Math.ceil(filteredBlogs.length / POSTS_PER_PAGE) > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => {
                  setCurrentPage(prev => Math.max(prev - 1, 1))
                  window.scrollTo({ top: 150, behavior: 'smooth' })
                }}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-white/[0.08] hover:border-white/20 disabled:opacity-30 disabled:hover:border-white/[0.08] rounded-xl text-xs font-bold text-[#a1a1aa] hover:text-white transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.ceil(filteredBlogs.length / POSTS_PER_PAGE) }).map((_, idx) => {
                const page = idx + 1
                return (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page)
                      window.scrollTo({ top: 150, behavior: 'smooth' })
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
                  const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE)
                  setCurrentPage(prev => Math.min(prev + 1, totalPages))
                  window.scrollTo({ top: 150, behavior: 'smooth' })
                }}
                disabled={currentPage === Math.ceil(filteredBlogs.length / POSTS_PER_PAGE)}
                className="px-4 py-2 border border-white/[0.08] hover:border-white/20 disabled:opacity-30 disabled:hover:border-white/[0.08] rounded-xl text-xs font-bold text-[#a1a1aa] hover:text-white transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
