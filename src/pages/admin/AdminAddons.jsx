import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react'
import { api } from '../../hooks/useAdminApi'

const ICON_KEYS = [
  { key: 'extra-agent',     label: '👥 Extra Agent' },
  { key: 'shopify-store',   label: '🛒 Shopify / E-Comm' },
  { key: 'bot-trigger',     label: '⚡ Bot Trigger' },
  { key: 'social-channels', label: '🔗 Social Channels' },
]

const EMPTY = { icon_key: 'extra-agent', name: '', description: '', price_usd: '', price_inr: '', period: '', sort_order: 0 }

function AddonModal({ addon, onClose, onSave }) {
  const [form, setForm] = useState(addon || EMPTY)
  const [saving, setSaving] = useState(false)
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <div data-lenis-prevent className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4">
      <div className="bg-[#111113] border border-white/[0.08] rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-base font-bold text-white">{addon?.id ? 'Edit Add-on' : 'New Add-on'}</h2>
          <button onClick={onClose} className="text-[#71717a] hover:text-white cursor-pointer"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">Name *</label>
            <input required value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="Extra Team Member"
              className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">Description</label>
            <textarea rows={2} value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Short description..."
              className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">Icon</label>
            <select value={form.icon_key} onChange={e => set('icon_key', e.target.value)}
              className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all cursor-pointer appearance-none">
              {ICON_KEYS.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">Price USD ($)</label>
              <input type="number" value={form.price_usd} onChange={e => set('price_usd', e.target.value)}
                placeholder="Leave blank = Custom"
                className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">Price INR (₹)</label>
              <input type="number" value={form.price_inr} onChange={e => set('price_inr', e.target.value)}
                placeholder="Leave blank = Custom"
                className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">Period Label</label>
              <input value={form.period} onChange={e => set('period', e.target.value)}
                placeholder="user / year"
                className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)}
                className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all" />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-sm text-[#a1a1aa] hover:text-white hover:border-white/20 transition-all cursor-pointer">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(248,90,34,0.3)]">
              {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : <><Check size={15} /> Save</>}
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  )
}

export default function AdminAddons() {
  const [addons, setAddons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const loadAddons = async () => {
    try {
      const res = await api.addons.list()
      if (res.success) setAddons(res.data)
      else setError('Failed to load add-ons')
    } catch {
      setError('Cannot reach backend. Is PHP server running on port 8080?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAddons() }, [])

  const handleSave = async (form) => {
    const payload = {
      ...form,
      price_usd: form.price_usd === '' ? null : parseFloat(form.price_usd),
      price_inr: form.price_inr === '' ? null : parseFloat(form.price_inr),
    }
    if (form.id) await api.addons.update(payload)
    else await api.addons.create(payload)
    setModal(null)
    loadAddons()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this add-on?')) return
    setDeleting(id)
    await api.addons.delete(id)
    setDeleting(null)
    loadAddons()
  }

  const iconLabel = (key) => ICON_KEYS.find(i => i.key === key)?.label ?? key

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Add-ons</h1>
          <p className="text-sm text-[#71717a] mt-1">Manage optional add-ons shown on the pricing page</p>
        </div>
        <button
          onClick={() => setModal('new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(248,90,34,0.3)] cursor-pointer"
        >
          <Plus size={16} /> Add Add-on
        </button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 mb-6">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : addons.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/[0.06] rounded-2xl">
          <p className="text-[#71717a] font-medium">No add-ons yet</p>
          <p className="text-xs text-[#3f3f46] mt-1">Run seed.php first or click "Add Add-on"</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addons.map(addon => (
            <div key={addon.id} className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5 flex items-start gap-4 group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs text-[#52525b] font-mono">{iconLabel(addon.icon_key)}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{addon.name}</h3>
                <p className="text-xs text-[#71717a] mb-2 line-clamp-2">{addon.description}</p>
                <div className="flex gap-4 text-xs">
                  <span className="text-[#a1a1aa]">USD: <strong className="text-white">{addon.price_usd != null ? `$${addon.price_usd}` : 'Custom'}</strong></span>
                  <span className="text-[#a1a1aa]">INR: <strong className="text-white">{addon.price_inr != null ? `₹${addon.price_inr}` : 'Custom'}</strong></span>
                  <span className="text-[#a1a1aa]">Period: <strong className="text-white">{addon.period}</strong></span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setModal(addon)} className="p-1.5 rounded-lg bg-white/[0.04] text-[#71717a] hover:text-white transition-all cursor-pointer"><Edit2 size={13} /></button>
                <button onClick={() => handleDelete(addon.id)} disabled={deleting === addon.id}
                  className="p-1.5 rounded-lg bg-red-500/[0.06] text-red-400/60 hover:text-red-400 transition-all cursor-pointer disabled:opacity-50">
                  {deleting === addon.id ? <span className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin block" /> : <Trash2 size={13} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && <AddonModal addon={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
    </div>
  )
}
