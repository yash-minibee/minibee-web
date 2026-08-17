import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react'
import { api } from '../../hooks/useAdminApi'

const EMPTY_ROW = { feature: '', starter: '', growth: '', premium: '', enterprise: '', sort_order: 0 }

const COLS = ['starter', 'growth', 'premium', 'enterprise']

function RowModal({ row, onClose, onSave }) {
  const [form, setForm] = useState(row || EMPTY_ROW)
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
      <div className="bg-[#111113] border border-white/[0.08] rounded-2xl w-full max-w-xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-base font-bold text-white">{row?.id ? 'Edit Comparison Row' : 'New Comparison Row'}</h2>
          <button onClick={onClose} className="text-[#71717a] hover:text-white transition-colors cursor-pointer"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">Feature Name *</label>
            <input required value={form.feature} onChange={e => set('feature', e.target.value)}
              placeholder="e.g. Custom Domain"
              className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {COLS.map(col => (
              <div key={col}>
                <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">{col}</label>
                <input value={form[col]} onChange={e => set(col, e.target.value)}
                  placeholder='true / false / "5 / Month"'
                  className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all" />
              </div>
            ))}
          </div>

          <div className="text-xs text-[#52525b] bg-white/[0.02] border border-white/[0.04] rounded-xl px-3 py-2.5">
            💡 Use <code className="text-orange-400">true</code> for a ✅ checkmark, <code className="text-orange-400">false</code> for an em-dash, or any text like <code className="text-orange-400">5 / Month</code>.
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
              {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : <><Check size={15} /> Save Row</>}
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  )
}

function CellDisplay({ val }) {
  if (val === 'true')  return <Check size={14} className="text-green-400 mx-auto" />
  if (val === 'false') return <span className="text-[#3f3f46]">—</span>
  return <span className="text-xs text-[#a1a1aa]">{val || '—'}</span>
}

export default function AdminComparison() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const loadRows = async () => {
    try {
      const res = await api.comparison.list()
      if (res.success) setRows(res.data)
      else setError('Failed to load comparison rows')
    } catch {
      setError('Cannot reach backend. Is PHP server running on port 8080?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadRows() }, [])

  const handleSave = async (form) => {
    if (form.id) await api.comparison.update(form)
    else await api.comparison.create(form)
    setModal(null)
    loadRows()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this row?')) return
    setDeleting(id)
    await api.comparison.delete(id)
    setDeleting(null)
    loadRows()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Feature Comparison</h1>
          <p className="text-sm text-[#71717a] mt-1">Add extra rows to the comparison table on the pricing page</p>
        </div>
        <button
          onClick={() => setModal('new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(248,90,34,0.3)] cursor-pointer"
        >
          <Plus size={16} /> Add Row
        </button>
      </div>
      {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 mb-6">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/[0.06] rounded-2xl">
          <p className="text-[#71717a] font-medium">No custom comparison rows yet</p>
          <p className="text-xs text-[#3f3f46] mt-1">Click "Add Row" to create a new feature comparison entry</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-white/[0.06] bg-[#111113]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#71717a] uppercase tracking-wider w-[28%]">Feature</th>
                {['Starter', 'Growth', 'Premium', 'Enterprise'].map(p => (
                  <th key={p} className={`text-center px-3 py-3 text-xs font-semibold uppercase tracking-wider ${p === 'Growth' ? 'text-orange-400' : 'text-[#71717a]'}`}>{p}</th>
                ))}
                <th className="px-3 py-3 text-xs font-semibold text-[#71717a] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id} className={`border-b border-white/[0.04] ${i % 2 === 0 ? 'bg-[#111113]' : 'bg-white/[0.01]'}`}>
                  <td className="px-4 py-3 text-sm text-[#a1a1aa]">{row.feature}</td>
                  {COLS.map(col => (
                    <td key={col} className="px-3 py-3 text-center"><CellDisplay val={row[col]} /></td>
                  ))}
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => setModal(row)} className="p-1.5 rounded-lg bg-white/[0.04] text-[#71717a] hover:text-white transition-all cursor-pointer"><Edit2 size={13} /></button>
                      <button onClick={() => handleDelete(row.id)} disabled={deleting === row.id}
                        className="p-1.5 rounded-lg bg-red-500/[0.06] text-red-400/60 hover:text-red-400 transition-all cursor-pointer disabled:opacity-50">
                        {deleting === row.id ? <span className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin block" /> : <Trash2 size={13} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && <RowModal row={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
    </div>
  )
}
