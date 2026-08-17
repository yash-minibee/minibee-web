import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Check, Globe, Laptop, Code2, ShoppingBag, Smartphone, Layers, Terminal, Palette, Cpu, Database } from 'lucide-react'
import { api } from '../../hooks/useAdminApi'

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

const ICON_OPTIONS = [
  { key: 'Globe',       label: '🌐 Website (Globe)' },
  { key: 'Laptop',      label: '💻 Software (Laptop)' },
  { key: 'Code2',       label: '💻 Coding (Code)' },
  { key: 'ShoppingBag', label: '🛍️ E-Commerce (Bag)' },
  { key: 'Smartphone',  label: '📱 Mobile App (Phone)' },
  { key: 'Layers',      label: '🥞 Tech Stack (Layers)' },
  { key: 'Terminal',    label: '💻 Command Line' },
  { key: 'Palette',     label: '🎨 Design/UI (Palette)' },
  { key: 'Cpu',         label: '⚙️ Systems/Hardware' },
  { key: 'Database',    label: '🗄️ Backend/Database' }
]

const EMPTY_ITEM = { title: '', category: '', url: '', description: '', sort_order: 0 }

function ItemModal({ item, onClose, onSave }) {
  const [form, setForm] = useState(item || EMPTY_ITEM)
  const [saving, setSaving] = useState(false)
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  // Inline Category Management States
  const [categories, setCategories] = useState([])
  const [showManager, setShowManager] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatIcon, setNewCatIcon] = useState('Globe')
  const [editingCatId, setEditingCatId] = useState(null)
  const [editingCatName, setEditingCatName] = useState('')
  const [editingCatIcon, setEditingCatIcon] = useState('Globe')
  const [catError, setCatError] = useState('')

  const loadCategories = async () => {
    try {
      const res = await api.portfolioCategories.list()
      if (res.success) {
        setCategories(res.data)
        // If the item doesn't have a category set, default it to the first category in the list
        if (!form.category && res.data.length > 0) {
          set('category', res.data[0].name)
        }
      }
    } catch {}
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return
    setCatError('')
    try {
      const res = await api.portfolioCategories.create({
        name: newCatName.trim(),
        sort_order: categories.length + 1,
        icon_key: newCatIcon
      })
      if (res.success) {
        setNewCatName('')
        setNewCatIcon('Globe')
        await loadCategories()
      } else {
        setCatError(res.error || 'Failed to add category')
      }
    } catch {
      setCatError('Network error adding category')
    }
  }

  const handleUpdateCategory = async (id) => {
    if (!editingCatName.trim()) return
    setCatError('')
    try {
      const res = await api.portfolioCategories.update({
        id,
        name: editingCatName.trim(),
        sort_order: categories.find(c => c.id === id)?.sort_order || 0,
        icon_key: editingCatIcon
      })
      if (res.success) {
        setEditingCatId(null)
        setEditingCatName('')
        setEditingCatIcon('Globe')
        await loadCategories()
      } else {
        setCatError(res.error || 'Failed to update category')
      }
    } catch {
      setCatError('Network error updating category')
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category? Any projects using it will show a neutral category badge.')) return
    setCatError('')
    try {
      const res = await api.portfolioCategories.delete(id)
      if (res.success) {
        await loadCategories()
      } else {
        setCatError(res.error || 'Failed to delete category')
      }
    } catch {
      setCatError('Network error deleting category')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <div data-lenis-prevent className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4">
      <div className="bg-[#111113] border border-white/[0.08] rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-base font-bold text-white">{item?.id ? 'Edit Portfolio Item' : 'New Portfolio Item'}</h2>
          <button onClick={onClose} className="text-[#71717a] hover:text-white transition-colors cursor-pointer"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">Project Title *</label>
              <input required value={form.title} onChange={e => set('title', e.target.value)}
                placeholder="e.g. My Client Site"
                className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">Category *</label>
                <button
                  type="button"
                  onClick={() => setShowManager(!showManager)}
                  className="text-[10px] text-orange-400 hover:text-orange-500 font-semibold underline cursor-pointer focus:outline-none"
                >
                  {showManager ? 'Close Edit' : 'Add/Edit'}
                </button>
              </div>
              <select required value={form.category} onChange={e => set('category', e.target.value)}
                className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all appearance-none cursor-pointer">
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Inline Category Manager Panel */}
          {showManager && (
            <div className="bg-[#09090b] border border-white/[0.06] rounded-xl p-4 space-y-3">
              <h3 className="text-[10px] font-bold text-white uppercase tracking-wider">Manage Portfolio Categories</h3>
              
              {catError && <p className="text-[10px] text-red-400 font-medium">{catError}</p>}
              
              {/* Add category form */}
              <div className="flex flex-col gap-2 bg-[#111113]/50 p-2.5 rounded-lg border border-white/[0.04]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    placeholder="Category name..."
                    className="flex-1 bg-[#111113] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all"
                  />
                  <select
                    value={newCatIcon}
                    onChange={e => setNewCatIcon(e.target.value)}
                    className="bg-[#111113] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500/50 cursor-pointer"
                  >
                    {ICON_OPTIONS.map(opt => (
                      <option key={opt.key} value={opt.key}>{opt.label}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Category List */}
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 divide-y divide-white/[0.04] data-lenis-prevent">
                {categories.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between py-1.5 text-xs gap-2">
                    {editingCatId === cat.id ? (
                      <div className="flex flex-1 gap-2 min-w-0">
                        <input
                          type="text"
                          value={editingCatName}
                          onChange={e => setEditingCatName(e.target.value)}
                          className="flex-1 min-w-0 bg-[#111113] border border-orange-500/50 rounded px-2 py-0.5 text-xs text-white focus:outline-none"
                        />
                        <select
                          value={editingCatIcon}
                          onChange={e => setEditingCatIcon(e.target.value)}
                          className="bg-[#111113] border border-white/[0.08] rounded px-2 py-0.5 text-xs text-white focus:outline-none cursor-pointer"
                        >
                          {ICON_OPTIONS.map(opt => (
                            <option key={opt.key} value={opt.key}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-[#a1a1aa] min-w-0">
                        {(() => {
                          const IconComp = ICON_MAP[cat.icon_key] || Globe;
                          return <IconComp size={13} className="text-orange-400/80 flex-shrink-0" />;
                        })()}
                        <span className="truncate">{cat.name}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5">
                      {editingCatId === cat.id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleUpdateCategory(cat.id)}
                            className="p-1 text-green-400 hover:text-green-300"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCatId(null)}
                            className="p-1 text-red-400 hover:text-red-300"
                          >
                            <X size={12} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCatId(cat.id)
                              setEditingCatName(cat.name)
                              setEditingCatIcon(cat.icon_key || 'Globe')
                            }}
                            className="p-1 text-[#71717a] hover:text-white"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1 text-red-500/60 hover:text-red-400"
                          >
                            <Trash2 size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">Website URL</label>
            <input type="url" value={form.url} onChange={e => set('url', e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">Description</label>
            <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Brief description of what was built..."
              className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all resize-none" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">Sort Order</label>
            <input type="number" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)}
              className="w-32 bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all" />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-sm text-[#a1a1aa] hover:text-white hover:border-white/20 transition-all cursor-pointer">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(248,90,34,0.3)]">
              {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : <><Check size={15} /> Save Item</>}
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  )
}

export default function AdminPortfolio() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null)
  const [deleting, setDeleting] = useState(null)

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('All')

  const loadItems = async () => {
    try {
      const res = await api.portfolio.list()
      if (res.success) setItems(res.data)
      else setError('Failed to load portfolio items')
    } catch {
      setError('Cannot reach backend. Is PHP server running on port 8080?')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const res = await api.portfolioCategories.list()
      if (res.success) setCategories(res.data)
    } catch {}
  }

  useEffect(() => {
    loadItems()
    loadCategories()
  }, [])

  const handleSave = async (form) => {
    if (form.id) await api.portfolio.update(form)
    else await api.portfolio.create(form)
    setModal(null)
    loadItems()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this portfolio item? This cannot be undone.')) return
    setDeleting(id)
    await api.portfolio.delete(id)
    setDeleting(null)
    loadItems()
  }

  const getCatIcon = (catName) => {
    const cat = categories.find(c => c.name === catName)
    const iconKey = cat ? cat.icon_key : 'Globe'
    const IconComp = ICON_MAP[iconKey] || Globe
    return <IconComp size={18} className="text-[#71717a] group-hover:text-orange-400 transition-colors" />
  }

  const categoryColor = (cat) => {
    const map = {
      'Corporate Website': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'E-Commerce Store':  'bg-green-500/10 text-green-400 border-green-500/20',
      'Web Application':   'bg-purple-500/10 text-purple-400 border-purple-500/20',
      'UI/UX Design':      'bg-pink-500/10 text-pink-400 border-pink-500/20',
    }
    return map[cat] || 'bg-white/[0.06] text-[#a1a1aa] border-white/[0.08]'
  }

  // Filter items based on Search query & Category filter dropdown
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedFilter === 'All' || item.category === selectedFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Web Portfolio</h1>
          <p className="text-sm text-[#71717a] mt-1">Manage web portfolio items shown on the portfolio page</p>
        </div>
        <button
          onClick={() => setModal('new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(248,90,34,0.3)] cursor-pointer"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 mb-6">{error}</div>}

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, description..."
            className="w-full bg-[#111113] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all"
          />
        </div>
        {/* Category Filter Select */}
        <div className="w-full sm:w-64">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="w-full bg-[#111113] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 cursor-pointer appearance-none"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/[0.06] rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex items-center justify-center mx-auto mb-4">
            <Globe size={24} className="text-[#3f3f46]" />
          </div>
          <p className="text-[#71717a] font-medium">No custom projects yet</p>
          <p className="text-xs text-[#3f3f46] mt-1">Click "Add Project" to add a new portfolio entry</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/[0.06] rounded-2xl">
          <p className="text-[#71717a] font-medium">No projects match your search/filter criteria</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5 flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-orange-500/5 border border-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                {getCatIcon(item.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border flex-shrink-0 ${categoryColor(item.category)}`}>
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-[#71717a] mb-2 line-clamp-2">{item.description}</p>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                    className="text-[10px] text-orange-400/70 hover:text-orange-400 font-mono truncate block transition-colors max-w-[200px]">
                    {item.url}
                  </a>
                )}
              </div>
              <div className="flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setModal(item)} className="p-1.5 rounded-lg bg-white/[0.04] text-[#71717a] hover:text-white transition-all cursor-pointer"><Edit2 size={13} /></button>
                <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id}
                  className="p-1.5 rounded-lg bg-red-500/[0.06] text-red-400/60 hover:text-red-400 transition-all cursor-pointer disabled:opacity-50">
                  {deleting === item.id ? <span className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin block" /> : <Trash2 size={13} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && <ItemModal item={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
    </div>
  )
}
