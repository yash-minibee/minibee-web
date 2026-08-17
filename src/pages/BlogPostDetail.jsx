import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Calendar, User, ArrowLeft, Image as ImageIcon, Eye } from 'lucide-react'
import { API_BASE, getImageUrl } from '../hooks/useAdminApi'

export default function BlogPostDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [morePosts, setMorePosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`${API_BASE}/blog.php?action=get&id=&slug=${slug}`).then(r => r.json()),
      fetch(`${API_BASE}/blog.php?action=list`).then(r => r.json())
    ])
      .then(([detailRes, listRes]) => {
        if (detailRes.success && detailRes.data) {
          setPost(detailRes.data)
          
          if (listRes.success && listRes.data) {
            // Filter out the active post from the suggestions, and limit to 3 items
            const filtered = listRes.data.filter(p => p.slug !== slug).slice(0, 3)
            setMorePosts(filtered)
          }
        } else {
          setError(detailRes.error || 'Article not found')
        }
      })
      .catch(() => {
        setError('Error reaching server. Please try again.')
      })
      .finally(() => setLoading(false))
  }, [slug])

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="pt-32 pb-24 flex items-center justify-center min-h-[60vh]">
        <span className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="pt-32 pb-24 min-h-[60vh] flex flex-col items-center justify-center font-sans">
        <div className="text-center bg-[#0f0f11] border border-white/[0.06] rounded-3xl p-8 max-w-md shadow-2xl">
          <p className="text-red-400 font-bold mb-4">{error || 'Article not found'}</p>
          <Link to="/blog" className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(248,90,34,0.3)]">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const tagsList = post.tags ? post.tags.split('\n').map(t => t.trim()).filter(Boolean) : []

  return (
    <div className="pt-32 pb-24 font-sans text-[#a1a1aa] leading-relaxed">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Back Link */}
        <Link 
          to="/blog" 
          className="flex items-center gap-2 text-sm text-[#71717a] hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Articles
        </Link>

        {/* Article Meta */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-[#71717a]">
            <span className="flex items-center gap-1 text-orange-400">
              <User size={13} /> {post.author || 'Admin'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={13} /> {formatDate(post.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={13} /> {post.views || 0} views
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Hash Tags row */}
          {tagsList.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {tagsList.map((tag, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.06] rounded-lg text-xs font-semibold text-orange-400 transition-all select-none font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Main Article Body */}
          <div className="lg:col-span-8 space-y-8">
            {/* Featured Image */}
            <div className="aspect-video w-full rounded-3xl bg-[#0f0f11] border border-white/[0.06] overflow-hidden flex items-center justify-center relative shadow-2xl">
              {post.featured_image ? (
                <img 
                  src={getImageUrl(post.featured_image)} 
                  alt={post.title} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-mesh opacity-50" />
                  <ImageIcon size={48} className="text-[#3f3f46]" />
                </>
              )}
            </div>

            {/* Article Content Body */}
            <article className="card-glass rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-white/[0.005] pointer-events-none" />
              
              {/* Render HTML content safely with tailored prose styles */}
              <div 
                className="prose prose-invert max-w-none text-[#d4d4d8] text-base leading-relaxed space-y-6 
                           prose-headings:text-white prose-headings:font-extrabold prose-headings:tracking-tight
                           prose-h2:text-2xl prose-h2:border-b prose-h2:border-white/[0.04] prose-h2:pb-2 prose-h2:mt-10
                           prose-h3:text-xl prose-h3:mt-8
                           prose-p:mb-6
                           prose-a:text-orange-400 prose-a:underline hover:prose-a:text-orange-500 prose-a:transition-colors
                           prose-strong:text-white prose-strong:font-bold
                           prose-em:italic
                           prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
                           prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2
                           prose-li:text-[#d4d4d8]
                           prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-[#a1a1aa]
                           prose-img:max-w-full prose-img:rounded-2xl prose-img:my-6 prose-img:shadow-lg
                           prose-code:font-mono prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-orange-400
                           blog-content-override"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>
          </div>

          {/* Right Column: Sticky Sidebar with More Blogs */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            
            {morePosts.length > 0 && (
              <div className="card-glass rounded-3xl p-6 shadow-2xl space-y-6">
                <h3 className="text-base font-bold text-white border-b border-white/[0.06] pb-3 tracking-tight">
                  More Articles You Might Like
                </h3>
                
                <div className="space-y-4">
                  {morePosts.map(p => (
                    <Link 
                      key={p.id} 
                      to={`/blog/${p.slug}`} 
                      className="flex gap-4 p-2.5 bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] hover:border-orange-500/20 rounded-2xl group transition-all"
                    >
                      {/* Compact Image */}
                      <div className="w-20 aspect-video rounded-xl bg-white/5 border border-white/[0.05] overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {p.featured_image ? (
                          <img 
                            src={getImageUrl(p.featured_image)} 
                            alt={p.title} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <ImageIcon size={14} className="text-[#3f3f46]" />
                        )}
                      </div>
                      
                      {/* Text */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h4 className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug mb-1">
                          {p.title}
                        </h4>
                        <div className="text-[9px] text-[#71717a] font-semibold uppercase tracking-wide">
                          {p.author || 'Admin'}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
