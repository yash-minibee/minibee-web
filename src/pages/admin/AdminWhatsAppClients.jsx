import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Check, Image as ImageIcon } from 'lucide-react'
import { api, getImageUrl } from '../../hooks/useAdminApi'

const EMPTY_CLIENT = { name: '', logo_url: '', sort_order: 0 }

function ClientModal({ client, onClose, onSave }) {
  const [form, setForm] = useState(client || EMPTY_CLIENT)
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await onSave(form, file)
    setSaving(false)
  }

  return (
    <div data-lenis-prevent className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="bg-[#111113] border border-white/[0.08] rounded-2xl w-full max-w-md shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <h2 className="text-base font-bold text-white">{client?.id ? 'Edit WhatsApp Client' : 'New WhatsApp Client'}</h2>
            <button onClick={onClose} className="text-[#71717a] hover:text-white cursor-pointer"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">Client Name *</label>
              <input required value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">Upload Logo File</label>
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])}
                className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all file:mr-4 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-500/10 file:text-orange-400 hover:file:bg-orange-500/20" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">Or Logo URL (fallback)</label>
              <input value={form.logo_url} onChange={e => set('logo_url', e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all" />
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
                {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : <><Check size={15} /> Save Client</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function AdminWhatsAppClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null)
  const [deleting, setDeleting] = useState(null)

  // Scroll speed states
  const [speed, setSpeed] = useState(120)
  const [savingSpeed, setSavingSpeed] = useState(false)
  const [speedSavedMessage, setSpeedSavedMessage] = useState('')

  const loadClients = async () => {
    try {
      const res = await api.whatsappClients.list()
      if (res.success) setClients(res.data)
      else setError('Failed to load clients')
    } catch {
      setError('Cannot reach backend. Is PHP server running on port 8080?')
    } finally {
      setLoading(false)
    }
  }

  const loadSpeed = async () => {
    try {
      const res = await api.settings.get('whatsapp_clients_speed')
      if (res.success && res.value) {
        setSpeed(parseInt(res.value) || 120)
      }
    } catch {}
  }

  useEffect(() => {
    loadClients()
    loadSpeed()
  }, [])

  const handleSave = async (form, file) => {
    const data = new FormData()
    if (form.id) {
      data.append('id', form.id)
    }
    data.append('name', form.name || '')
    data.append('sort_order', form.sort_order || 0)
    data.append('logo_url', form.logo_url || '')
    if (file) {
      data.append('logo', file)
    }

    if (form.id) await api.whatsappClients.update(data)
    else await api.whatsappClients.create(data)
    setModal(null)
    loadClients()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this client? This cannot be undone.')) return
    setDeleting(id)
    await api.whatsappClients.delete(id)
    setDeleting(null)
    loadClients()
  }

  const handleSaveSpeed = async () => {
    setSavingSpeed(true)
    setSpeedSavedMessage('')
    try {
      const res = await api.settings.set('whatsapp_clients_speed', speed.toString())
      if (res.success) {
        setSpeedSavedMessage('Marquee scroll speed saved successfully!')
        setTimeout(() => setSpeedSavedMessage(''), 3000)
      } else {
        setError(res.error || 'Failed to save speed setting')
      }
    } catch {
      setError('Cannot save settings. Server error.')
    } finally {
      setSavingSpeed(false)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">WhatsApp Clients</h1>
          <p className="text-sm text-[#71717a] mt-1">Manage WhatsApp Business API clients shown on the portfolio page</p>
        </div>
        <button
          onClick={() => setModal('new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(248,90,34,0.3)] cursor-pointer"
        >
          <Plus size={16} /> Add Client
        </button>
      </div>

      {/* Speed Setting Control */}
      <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="max-w-md">
          <h3 className="text-sm font-bold text-white mb-1">Scrolling Speed</h3>
          <p className="text-xs text-[#71717a]">
            Set the scroll speed of the clients marquee rows (in seconds). Higher = slower scrolling (e.g. 120 is slow, 30 is fast).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={speed}
            onChange={(e) => setSpeed(Math.max(10, parseInt(e.target.value) || 120))}
            className="w-24 bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50 text-center"
          />
          <button
            onClick={handleSaveSpeed}
            disabled={savingSpeed}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs rounded-lg transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            {savingSpeed ? "Saving..." : "Save Speed"}
          </button>
        </div>
      </div>

      {speedSavedMessage && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-xl px-4 py-2.5 mb-6">
          {speedSavedMessage}
        </div>
      )}

      {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 mb-6">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/[0.06] rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex items-center justify-center mx-auto mb-4">
            <ImageIcon size={24} className="text-[#3f3f46]" />
          </div>
          <p className="text-[#71717a] font-medium">No clients yet</p>
          <p className="text-xs text-[#3f3f46] mt-1">Click "Add Client" to add your first WhatsApp client</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map(client => (
            <div key={client.id} className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5 flex items-center justify-between group">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {client.logo_url ? (
                    <img src={getImageUrl(client.logo_url)} alt={client.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <ImageIcon size={20} className="text-[#52525b]" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">{client.name}</h3>
                  <p className="text-[10px] text-[#71717a] font-medium">Sort Order: {client.sort_order}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button onClick={() => setModal(client)} className="p-1.5 rounded-lg bg-white/[0.04] text-[#71717a] hover:text-white transition-all cursor-pointer"><Edit2 size={13} /></button>
                <button onClick={() => handleDelete(client.id)} disabled={deleting === client.id}
                  className="p-1.5 rounded-lg bg-red-500/[0.06] text-red-400/60 hover:text-red-400 transition-all cursor-pointer disabled:opacity-50">
                  {deleting === client.id ? <span className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin block" /> : <Trash2 size={13} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && <ClientModal client={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
    </div>
  )
}
