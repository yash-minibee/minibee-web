import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, X, Globe, Lock, ExternalLink, ChevronLeft, ChevronRight, Laptop, Code2, ShoppingBag, Smartphone, Layers, Terminal, Palette, Cpu, Database } from 'lucide-react'
import { api, getImageUrl } from '../hooks/useAdminApi'

const PAGE_SIZE = 6

const ICON_MAP = {
  Globe,
  Laptop,
  Code2,
  ShoppingBag,
  Smartphone,
  Layers,
  Terminal,
  Palette,
  Cpu,
  Database
}

export default function Portfolio() {
  const [categories, setCategories] = useState(['All'])
  const [categoryIcons, setCategoryIcons] = useState({})
  const [activeCategory, setActiveCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [previewProject, setPreviewProject] = useState(null)
  const [projects, setProjects] = useState([])
  const [waClients, setWaClients] = useState([])
  const [scrollSpeed, setScrollSpeed] = useState(120)
  const [loading, setLoading] = useState(true)

  // Fetch all items from DB
  useEffect(() => {
    Promise.all([
      api.portfolio.list(),
      api.whatsappClients.list(),
      api.settings.get('whatsapp_clients_speed'),
      api.portfolioCategories.list()
    ])
      .then(([portfolioRes, waClientsRes, speedRes, categoriesRes]) => {
        if (portfolioRes.success) {
          setProjects(portfolioRes.data.map(item => ({
            id:       item.id,
            title:    item.title,
            category: item.category,
            url:      item.url,
            desc:     item.description,
          })))
        }
        if (waClientsRes.success) {
          setWaClients(waClientsRes.data)
        }
        if (speedRes && speedRes.success && speedRes.value) {
          setScrollSpeed(parseInt(speedRes.value) || 120)
        }
        if (categoriesRes && categoriesRes.success) {
          setCategories(['All', ...categoriesRes.data.map(c => c.name)])
          const iconsMap = {}
          categoriesRes.data.forEach(c => {
            iconsMap[c.name] = c.icon_key || 'Globe'
          })
          setCategoryIcons(iconsMap)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
    setCurrentPage(1)
  }

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  const totalPages = Math.ceil(filteredProjects.length / PAGE_SIZE)
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  // Split WhatsApp clients into three rows
  const size = Math.ceil(waClients.length / 3)
  const row1 = waClients.slice(0, size)
  const row2 = waClients.slice(size, size * 2)
  const row3 = waClients.slice(size * 2)

  // Repeat lists to fill width for infinite scroll
  const list1 = row1.length > 0 ? [...row1, ...row1, ...row1, ...row1, ...row1] : []
  const list2 = row2.length > 0 
    ? [...row2, ...row2, ...row2, ...row2, ...row2] 
    : (row1.length > 0 ? [...row1, ...row1, ...row1, ...row1, ...row1] : [])
  const list3 = row3.length > 0 
    ? [...row3, ...row3, ...row3, ...row3, ...row3] 
    : (row1.length > 0 ? [...row1, ...row1, ...row1, ...row1, ...row1] : [])

  return (
    <div className={`pt-32 pb-24 relative ${previewProject ? 'z-[100]' : 'z-10'}`}>
      <div className="container-custom">
        {/* WhatsApp Business API Clients Section */}
        {waClients.length > 0 && (
          <div className="mb-24 border-b border-white/[0.04] pb-16">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
                WhatsApp <span className="text-gradient-orange">Business API Clients</span>
              </h2>
              <p className="text-[#a1a1aa] text-lg leading-relaxed">
                Trusted by Forward-Thinking Brands
              </p>
            </div>
            
            <div className="flex flex-col gap-5">
              {/* Row 1: Scrolls Left */}
              {list1.length > 0 && (
                <div className="marquee-container">
                  <div className="marquee-content" style={{ animationDuration: `${scrollSpeed}s` }}>
                    {list1.map((client, idx) => (
                      <div
                        key={`r1-${client.id}-${idx}`}
                        className="flex flex-col items-center justify-center bg-white/[0.02] border border-white/[0.04] rounded-2xl w-56 h-36 hover:border-green-500/30 hover:bg-white/[0.05] transition-all cursor-default select-none shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(37,211,102,0.1)] group p-4 overflow-hidden"
                        title={client.name}
                      >
                        <div className="w-full h-20 flex items-center justify-center transition-all duration-300">
                          {client.logo_url ? (
                            <img src={getImageUrl(client.logo_url)} alt={client.name} className="max-w-full max-h-full object-contain p-1" />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-orange-500 animate-pulse" />
                          )}
                        </div>
                        <span className="mt-2 text-sm font-bold text-[#a1a1aa] group-hover:text-white transition-colors duration-300 truncate max-w-full px-2">
                          {client.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Row 2: Scrolls Right */}
              {list2.length > 0 && (
                <div className="marquee-container">
                  <div className="marquee-content-reverse" style={{ animationDuration: `${scrollSpeed}s` }}>
                    {list2.map((client, idx) => (
                      <div
                        key={`r2-${client.id}-${idx}`}
                        className="flex flex-col items-center justify-center bg-white/[0.02] border border-white/[0.04] rounded-2xl w-56 h-36 hover:border-green-500/30 hover:bg-white/[0.05] transition-all cursor-default select-none shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(37,211,102,0.1)] group p-4 overflow-hidden"
                        title={client.name}
                      >
                        <div className="w-full h-20 flex items-center justify-center transition-all duration-300">
                          {client.logo_url ? (
                            <img src={getImageUrl(client.logo_url)} alt={client.name} className="max-w-full max-h-full object-contain p-1" />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-orange-500 animate-pulse" />
                          )}
                        </div>
                        <span className="mt-2 text-sm font-bold text-[#a1a1aa] group-hover:text-white transition-colors duration-300 truncate max-w-full px-2">
                          {client.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Row 3: Scrolls Left */}
              {list3.length > 0 && (
                <div className="marquee-container">
                  <div className="marquee-content" style={{ animationDuration: `${scrollSpeed}s` }}>
                    {list3.map((client, idx) => (
                      <div
                        key={`r3-${client.id}-${idx}`}
                        className="flex flex-col items-center justify-center bg-white/[0.02] border border-white/[0.04] rounded-2xl w-56 h-36 hover:border-green-500/30 hover:bg-white/[0.05] transition-all cursor-default select-none shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(37,211,102,0.1)] group p-4 overflow-hidden"
                        title={client.name}
                      >
                        <div className="w-full h-20 flex items-center justify-center transition-all duration-300">
                          {client.logo_url ? (
                            <img src={getImageUrl(client.logo_url)} alt={client.name} className="max-w-full max-h-full object-contain p-1" />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-orange-500 animate-pulse" />
                          )}
                        </div>
                        <span className="mt-2 text-sm font-bold text-[#a1a1aa] group-hover:text-white transition-colors duration-300 truncate max-w-full px-2">
                          {client.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
          >
            Our <span className="text-gradient-orange">Web Portfolio</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#a1a1aa] text-lg leading-relaxed"
          >
            Discover our track record of premium digital experiences, high-performance web applications, and automated WhatsApp integrations built to scale modern enterprises.
          </motion.p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${activeCategory === cat
                  ? 'border-orange-500 bg-orange-500/10 text-white shadow-[0_0_15px_rgba(248,90,34,0.15)]'
                  : 'border-white/[0.06] text-[#71717a] hover:text-white hover:border-white/[0.15] bg-[#111113]/40'
                }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Loading skeletons */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[380px] rounded-2xl border border-white/[0.06] bg-[#111113] animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Projects Grid */}
            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {paginatedProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <div
                      onClick={() => setPreviewProject(project)}
                      className="block card-glass group overflow-hidden h-[380px] flex flex-col relative cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-white/[0.01] group-hover:bg-white/[0.03] transition-colors" />

                      {/* Mock Visual Area */}
                      <div className="flex-1 border-b border-white/[0.04] p-8 flex flex-col justify-center items-center gap-6 relative bg-gradient-to-br from-orange-500/5 to-purple-500/5 overflow-hidden">
                        <div className="absolute inset-0 bg-mesh opacity-20" />

                        {/* Central Icon */}
                        <div className="w-20 h-20 rounded-2xl bg-[#111113] border border-white/[0.06] shadow-2xl flex items-center justify-center relative z-10 group-hover:scale-105 group-hover:border-orange-500/30 transition-all duration-500">
                          {(() => {
                            const iconKey = categoryIcons[project.category] || 'Globe'
                            const IconComp = ICON_MAP[iconKey] || Globe
                            return <IconComp size={28} className="text-[#71717a] group-hover:text-orange-400 transition-colors" />
                          })()}
                        </div>

                        {/* Brief description */}
                        <p className="text-xs text-[#71717a] text-center max-w-[200px] mx-auto z-10 leading-relaxed group-hover:text-[#a1a1aa] transition-colors">
                          {project.desc}
                        </p>
                      </div>

                      {/* Card Bottom Panel */}
                      <div className="p-6 flex items-center justify-between relative z-10 bg-[#0a0a0c]/80 backdrop-blur-md">
                        <div>
                          <span className="badge badge-orange text-[10px] mb-2">{project.category}</span>
                          <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                            {project.title}
                          </h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 group-hover:text-white transition-all text-[#71717a] shadow-lg">
                          <ArrowUpRight size={16} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${currentPage === 1
                      ? 'border-white/[0.04] text-[#3f3f46] cursor-not-allowed opacity-50'
                      : 'border-white/[0.08] text-[#a1a1aa] hover:text-white hover:border-white/[0.15] bg-[#111113]/40'
                    }`}
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${currentPage === pageNum
                          ? 'border-orange-500 bg-orange-500/10 text-white shadow-[0_0_15px_rgba(248,90,34,0.15)]'
                          : 'border-white/[0.08] text-[#71717a] hover:text-white hover:border-white/[0.15] bg-[#111113]/40'
                        }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${currentPage === totalPages
                      ? 'border-white/[0.04] text-[#3f3f46] cursor-not-allowed opacity-50'
                      : 'border-white/[0.08] text-[#a1a1aa] hover:text-white hover:border-white/[0.15] bg-[#111113]/40'
                    }`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Browser Mockup Iframe Preview Modal */}
      <AnimatePresence>
        {previewProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewProject(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Simulated Browser Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-6xl h-[85vh] bg-[#111113] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-10"
            >
              {/* Browser Header Bar */}
              <div className="h-12 bg-[#09090b] border-b border-white/[0.08] flex items-center justify-between px-4">
                {/* Simulated macOS Dots */}
                <div className="flex gap-1.5 w-20">
                  <button onClick={() => setPreviewProject(null)} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>

                {/* Browser Address Bar */}
                <div className="flex-1 max-w-md bg-[#111113] border border-white/[0.06] rounded-lg h-8 flex items-center justify-center gap-2 px-3 text-xs text-[#71717a] font-mono select-none">
                  <Lock size={12} className="text-green-500" />
                  <span className="truncate text-white/70">{previewProject.url}</span>
                </div>

                {/* External Link & Close Buttons */}
                <div className="flex items-center gap-3 w-20 justify-end">
                  <a
                    href={previewProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#71717a] hover:text-white transition-colors"
                    title="Open website in new tab"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <button
                    onClick={() => setPreviewProject(null)}
                    className="text-[#71717a] hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Warning Banner for IFrame limitations */}
              <div className="bg-orange-500/10 border-b border-orange-500/20 text-orange-400 py-2.5 px-4 text-center text-xs flex items-center justify-center gap-1.5">
                <Globe size={13} />
                <span>Live Preview Loaded. If the site is blocked from framing,</span>
                <a
                  href={previewProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline hover:text-orange-300 flex items-center gap-0.5"
                >
                  click here to open in a new tab <ExternalLink size={10} />
                </a>
              </div>

              {/* Simulated Browser Body containing Iframe */}
              <div className="flex-1 bg-white relative">
                <iframe
                  src={previewProject.url}
                  className="w-full h-full border-0 bg-white"
                  title={previewProject.title}
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
