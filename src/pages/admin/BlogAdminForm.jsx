import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Check, Image as ImageIcon, Sparkles, Eye, FileText, Code, Heading } from 'lucide-react'
import { api, getImageUrl } from '../../hooks/useAdminApi'

export default function BlogAdminForm() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [author, setAuthor] = useState('Admin')
  const [content, setContent] = useState('')
  const [currentCoverUrl, setCurrentCoverUrl] = useState('')
  const [tags, setTags] = useState('')
  const [file, setFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [status, setStatus] = useState('published')
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('rich') // 'rich' | 'html' | 'preview'

  const handleTabChange = (tab) => {
    if (tab === 'rich' && quillInstance.current) {
      quillInstance.current.root.innerHTML = content
    }
    setActiveTab(tab)
  }

  const editorRef = useRef(null)
  const quillInstance = useRef(null)
  const contentInitialized = useRef(false)

  // Generate Slug automatically from Title
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // remove special characters
      .replace(/\s+/g, '-')         // replace spaces with hyphens
      .replace(/-+/g, '-')          // replace multiple hyphens with single
      .trim()
  }

  const handleTitleChange = (e) => {
    const val = e.target.value
    setTitle(val)
    if (!id) {
      setSlug(generateSlug(val))
    }
  }

  // Load blog post if editing
  useEffect(() => {
    if (!id) return
    
    const fetchBlogPost = async () => {
      setFetching(true)
      try {
        const res = await api.blog.get(id)
        if (res.success && res.data) {
          const post = res.data
          setTitle(post.title || '')
          setSlug(post.slug || '')
          setExcerpt(post.excerpt || '')
          setAuthor(post.author || 'Admin')
          setContent(post.content || '')
          setCurrentCoverUrl(post.featured_image || '')
          setTags(post.tags || '')
          setStatus(post.status || 'published')
        } else {
          setError(res.error || 'Failed to fetch article details')
        }
      } catch {
        setError('Connection error loading article details.')
      } finally {
        setFetching(false)
      }
    }
    
    fetchBlogPost()
  }, [id])

  // Initialize Quill Editor synchronously on mount or when fetch finishes
  useEffect(() => {
    if (fetching) return
    if (!editorRef.current || quillInstance.current || !window.Quill) return

    const container = document.createElement('div')
    editorRef.current.appendChild(container)

    const quill = new window.Quill(container, {
      theme: 'snow',
      placeholder: 'Write your article content here...',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['link', 'image'],
          ['clean']
        ]
      }
    })

    quillInstance.current = quill

    if (content && !contentInitialized.current) {
      quill.root.innerHTML = content
      contentInitialized.current = true
    }

    quill.on('text-change', () => {
      setContent(quill.root.innerHTML)
    })

    return () => {
      if (editorRef.current) {
        editorRef.current.innerHTML = ''
      }
      quillInstance.current = null
    }
  }, [fetching])

  // Sync content with Quill if loaded later (edit page API response lag)
  useEffect(() => {
    if (quillInstance.current && content && !contentInitialized.current) {
      quillInstance.current.root.innerHTML = content
      contentInitialized.current = true
    }
  }, [content])

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (f) {
      setFile(f)
      setFilePreview(URL.createObjectURL(f))
    }
  }

  const handleSubmit = async (submitStatus) => {
    setLoading(true)
    setError('')

    const formData = new FormData()
    if (id) {
      formData.append('id', id)
    }
    formData.append('title', title.trim())
    formData.append('slug', slug.trim())
    formData.append('excerpt', excerpt.trim())
    formData.append('author', author.trim())
    formData.append('content', content)
    formData.append('featured_image', currentCoverUrl)
    formData.append('tags', tags.trim())
    formData.append('status', submitStatus)
    
    if (file) {
      formData.append('featured_image', file)
    }

    try {
      let res
      if (id) {
        res = await api.blog.update(formData)
      } else {
        res = await api.blog.create(formData)
      }
      
      if (res.success) {
        navigate('/blog/admin')
      } else {
        setError(res.error || 'Failed to save blog post')
      }
    } catch {
      setError('Connection failure saving article details.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-40">
        <span className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link 
          to="/blog/admin" 
          className="flex items-center gap-2 text-sm text-[#71717a] hover:text-white transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Articles
        </Link>
        
        <div className="flex items-center gap-2.5">
          {id && (
            <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
              status === 'draft' 
                ? 'bg-white/[0.03] border-white/[0.08] text-[#71717a]' 
                : 'bg-green-500/5 border-green-500/10 text-green-400'
            }`}>
              {status}
            </span>
          )}
          <h1 className="text-xl font-bold text-white tracking-tight">
            {id ? 'Edit Article' : 'Write New Article'}
          </h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Inputs (Left Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0f0f11] border border-white/[0.06] rounded-3xl p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">Article Title *</label>
              <input
                required
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. 7 Signs Your Business Needs a WhatsApp API"
                className="w-full bg-[#070708] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">URL Slug (Dynamic) *</label>
                <input
                  required
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  placeholder="my-article-url"
                  className="w-full bg-[#070708] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all font-mono"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">Author *</label>
                <input
                  required
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Admin"
                  className="w-full bg-[#070708] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">Short Excerpt / Summary *</label>
              <textarea
                required
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary of the article shown on list cards..."
                className="w-full bg-[#070708] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Main Article Content Editor */}
          <div className="bg-[#0f0f11] border border-white/[0.06] rounded-3xl overflow-hidden flex flex-col h-[520px]" data-lenis-prevent>
            {/* Editor Tabs & Toolbar */}
            <div className="px-6 py-4 border-b border-white/[0.04] bg-[#0c0c0e] flex items-center justify-between gap-4 flex-wrap flex-shrink-0">
              <div className="flex items-center gap-1.5 bg-[#070708] p-1 rounded-xl border border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => handleTabChange('rich')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'rich'
                      ? 'bg-orange-500 text-white shadow'
                      : 'text-[#71717a] hover:text-white'
                  }`}
                >
                  <FileText size={13} /> Rich Text
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('html')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'html'
                      ? 'bg-orange-500 text-white shadow'
                      : 'text-[#71717a] hover:text-white'
                  }`}
                >
                  <Code size={13} /> HTML Source
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'preview'
                      ? 'bg-orange-500 text-white shadow'
                      : 'text-[#71717a] hover:text-white'
                  }`}
                >
                  <Eye size={13} /> Preview
                </button>
              </div>
            </div>

            {/* Editor Workarea */}
            <div className="flex-1 min-h-0 bg-[#070708] flex flex-col relative">
              {/* Quill Editor hosting ref wrapper */}
              <div className={`flex-1 flex flex-col min-h-0 ${activeTab === 'rich' ? '' : 'hidden'}`}>
                <div ref={editorRef} className="flex-1 min-h-0 overflow-y-auto" />
              </div>

              {/* HTML Source code editor wrapper */}
              <div className={`flex-1 flex flex-col min-h-0 ${activeTab === 'html' ? '' : 'hidden'}`}>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type raw HTML markup here..."
                  className="flex-1 w-full bg-[#070708] p-6 text-sm text-white font-mono placeholder-[#3f3f46] focus:outline-none resize-none leading-relaxed overflow-y-auto"
                />
              </div>
              
              {/* HTML live compiler preview */}
              <div 
                className={`flex-1 p-6 overflow-y-auto prose prose-invert max-w-none text-[#a1a1aa] leading-relaxed text-sm space-y-4 ${activeTab === 'preview' ? '' : 'hidden'}`}
                dangerouslySetInnerHTML={{ __html: content || '<p class="text-[#3f3f46] italic">No content written yet. Use the editor tabs to draft your post.</p>' }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar Controls (Right Columns) */}
        <div className="space-y-6">
          {/* Cover image upload container */}
          <div className="bg-[#0f0f11] border border-white/[0.06] rounded-3xl p-6 space-y-5">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Featured Cover Image</h3>
              
              <div className="relative aspect-video rounded-2xl bg-[#070708] border border-white/[0.08] overflow-hidden flex flex-col items-center justify-center mb-4 group">
                {filePreview ? (
                  <img src={filePreview} alt="Upload preview" className="w-full h-full object-cover" />
                ) : currentCoverUrl ? (
                  <img src={getImageUrl(currentCoverUrl)} alt="Existing cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-[#3f3f46] flex flex-col items-center gap-2">
                    <ImageIcon size={32} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">No cover uploaded</span>
                  </div>
                )}

                {/* Upload button cover hover overlay */}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-xs text-white font-semibold gap-1.5 z-20">
                  <ImageIcon size={14} /> Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              
              <p className="text-[10px] text-[#71717a] leading-relaxed">
                Choose a high-resolution landscape cover image. Stores in the <code>uploads/blog-covers/</code> folder.
              </p>
            </div>
          </div>

          {/* Tags Configuration panel */}
          <div className="bg-[#0f0f11] border border-white/[0.06] rounded-3xl p-6 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Hash Tags</h3>
              <label className="block text-[10px] text-[#71717a] mb-2 leading-relaxed">
                Add each hashtag tag on a new line (one tag per line).
              </label>
              <textarea
                rows={4}
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g.&#10;whatsapp-api&#10;marketing&#10;customer-support"
                className="w-full bg-[#070708] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all font-mono resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-[#0f0f11] border border-white/[0.06] rounded-3xl p-6 space-y-3.5">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit('published')}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(248,90,34,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={16} /> Publish Post
                </>
              )}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit('draft')}
              className="w-full py-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/20 disabled:opacity-50 text-[#a1a1aa] hover:text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#a1a1aa]/30 border-t-[#a1a1aa] rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FileText size={16} /> Save as Draft
                </>
              )}
            </button>
            
            <Link
              to="/blog/admin"
              className="w-full py-2.5 block text-center rounded-xl border border-white/[0.08] text-xs font-semibold text-[#a1a1aa] hover:text-white hover:border-white/20 transition-all"
            >
              Cancel & Discard
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
