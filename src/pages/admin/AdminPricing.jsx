import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Check, Star, Copy } from 'lucide-react'
import { api } from '../../hooks/useAdminApi'

const EMPTY_PLAN = {
  name: '', tagline: '', quarterly_usd: '', yearly_usd: '',
  quarterly_inr: '', yearly_inr: '', popular: false,
  cta: 'Get Started', href: '/contact',
  features: [], not_included: [],
}

const cleanPrice = (val) => {
  if (val === null || val === undefined || val === '') return null
  const num = Number(val)
  return isNaN(num) ? val : (num % 1 === 0 ? Math.round(num) : num)
}

function Badge({ children, color = 'orange' }) {
  const cls = color === 'orange' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    : 'bg-white/[0.06] text-[#a1a1aa] border-white/[0.08]'
  return <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${cls}`}>{children}</span>
}

function FeatureListEditor({ label, items, onChange }) {
  // Join array → textarea string; split string → array on save
  const text = items.join('\n')

  const handleChange = (e) => {
    const lines = e.target.value.split('\n') // each line = one feature
    onChange(lines)
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-[#a1a1aa] mb-2 uppercase tracking-wider">{label}</label>
      <textarea
        value={text}
        onChange={handleChange}
        rows={6}
        placeholder={'One feature per line\nFeature A\nFeature B\n...'}
        className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/40 transition-all resize-y leading-relaxed"
      />
      {items.filter(f => f.trim()).length > 0 && (
        <p className="text-[10px] text-[#52525b] mt-1">
          {items.filter(f => f.trim()).length} item{items.filter(f => f.trim()).length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}


function PlanModal({ plan, onClose, onSave }) {
  const [form, setForm] = useState(() => {
    if (!plan) return EMPTY_PLAN
    return {
      ...plan,
      quarterly_usd: plan.quarterly_usd ?? plan.monthly_usd ?? '',
      quarterly_inr: plan.quarterly_inr ?? plan.monthly_inr ?? '',
      yearly_usd: plan.yearly_usd ?? '',
      yearly_inr: plan.yearly_inr ?? '',
    }
  })
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
      <div className="bg-[#111113] border border-white/[0.08] rounded-2xl w-full max-w-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] sticky top-0 bg-[#111113] z-10">
          <h2 className="text-base font-bold text-white">{plan?.id ? 'Edit Pricing Plan' : 'New Pricing Plan'}</h2>
          <button onClick={onClose} className="text-[#71717a] hover:text-white transition-colors cursor-pointer"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name & Tagline */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">Plan Name *</label>
              <input required value={form.name} onChange={e => set('name', e.target.value)}
                className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all" placeholder="e.g. Growth" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">CTA Button Text</label>
              <input value={form.cta} onChange={e => set('cta', e.target.value)}
                className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all" placeholder="Get Started" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">Tagline</label>
            <input value={form.tagline} onChange={e => set('tagline', e.target.value)}
              className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all" placeholder="Short description of this plan" />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'quarterly_usd', label: 'Quarterly USD ($)' },
              { key: 'yearly_usd',    label: 'Yearly USD ($/year)' },
              { key: 'quarterly_inr', label: 'Quarterly INR (₹)' },
              { key: 'yearly_inr',    label: 'Yearly INR (₹/year)' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">{label}</label>
                <input type="number" value={form[key]} onChange={e => set(key, e.target.value)}
                  className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all" placeholder="Leave blank for Custom" />
              </div>
            ))}
          </div>

          {/* CTA href & Popular */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">Button Link</label>
              <input value={form.href} onChange={e => set('href', e.target.value)}
                className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 transition-all" placeholder="/contact" />
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-3 cursor-pointer select-none pb-1">
                <div
                  onClick={() => set('popular', !form.popular)}
                  className={`w-11 h-6 rounded-full transition-colors duration-300 flex items-center px-0.5 cursor-pointer ${form.popular ? 'bg-orange-500' : 'bg-white/20'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${form.popular ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <span className="text-sm font-medium text-white flex items-center gap-1.5"><Star size={13} className="text-orange-400" /> Mark as Popular</span>
              </label>
            </div>
          </div>

          {/* Feature lists */}
          <div className="grid grid-cols-2 gap-4">
            <FeatureListEditor label="✅ Included Features" items={form.features} onChange={v => set('features', v)} />
            <FeatureListEditor label="❌ Not Included" items={form.not_included} onChange={v => set('not_included', v)} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-sm text-[#a1a1aa] hover:text-white hover:border-white/20 transition-all cursor-pointer">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(248,90,34,0.3)]">
              {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : <><Check size={15} /> Save Plan</>}
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  )
}

export default function AdminPricing() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null) // null | 'new' | plan_object
  const [deleting, setDeleting] = useState(null)

  const loadPlans = async () => {
    try {
      const res = await api.pricing.list()
      if (res.success) setPlans(res.data)
      else setError('Failed to load plans')
    } catch {
      setError('Cannot reach backend. Is PHP server running on port 8080?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPlans() }, [])

  const handleSave = async (form) => {
    const q_usd = form.quarterly_usd === '' ? null : parseFloat(form.quarterly_usd)
    const q_inr = form.quarterly_inr === '' ? null : parseFloat(form.quarterly_inr)
    const payload = {
      ...form,
      quarterly_usd: q_usd,
      yearly_usd:    form.yearly_usd   === '' ? null : parseFloat(form.yearly_usd),
      quarterly_inr: q_inr,
      yearly_inr:    form.yearly_inr   === '' ? null : parseFloat(form.yearly_inr),
      monthly_usd:   q_usd,
      monthly_inr:   q_inr,
      // Filter out blank lines left from textarea newlines
      features:     (form.features     || []).map(f => f.trim()).filter(Boolean),
      not_included: (form.not_included || []).map(f => f.trim()).filter(Boolean),
    }
    if (form.id) await api.pricing.update(payload)
    else await api.pricing.create(payload)
    setModal(null)
    loadPlans()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this pricing plan? This cannot be undone.')) return
    setDeleting(id)
    await api.pricing.delete(id)
    setDeleting(null)
    loadPlans()
  }

  const handleClone = async (plan) => {
    setLoading(true)
    try {
      const q_usd = plan.quarterly_usd ?? plan.monthly_usd
      const q_inr = plan.quarterly_inr ?? plan.monthly_inr
      const cloneData = {
        name: `${plan.name} (Copy)`,
        tagline: plan.tagline,
        quarterly_usd: q_usd,
        yearly_usd: plan.yearly_usd,
        quarterly_inr: q_inr,
        yearly_inr: plan.yearly_inr,
        monthly_usd: q_usd,
        monthly_inr: q_inr,
        popular: plan.popular ? 1 : 0,
        cta: plan.cta,
        href: plan.href,
        features: plan.features || [],
        not_included: plan.not_included || [],
      }
      await api.pricing.create(cloneData)
      await loadPlans()
    } catch {
      setError('Failed to clone plan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Pricing Plans</h1>
          <p className="text-sm text-[#71717a] mt-1">Manage additional pricing plans shown on the pricing page</p>
        </div>
        <button
          onClick={() => setModal('new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(248,90,34,0.3)] cursor-pointer"
        >
          <Plus size={16} /> Add Plan
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 mb-6">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/[0.06] rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex items-center justify-center mx-auto mb-4">
            <Plus size={24} className="text-[#3f3f46]" />
          </div>
          <p className="text-[#71717a] font-medium">No custom plans yet</p>
          <p className="text-xs text-[#3f3f46] mt-1">Click "Add Plan" to create your first custom pricing tier</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {plans.map(plan => (
            <div key={plan.id} className="bg-[#111113] border border-white/[0.06] rounded-2xl p-5 flex items-start gap-5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <h3 className="text-base font-bold text-white">{plan.name}</h3>
                  {plan.popular && <Badge color="orange"><Star size={10} fill="currentColor" /> Popular</Badge>}
                </div>
                <p className="text-xs text-[#71717a] mb-3">{plan.tagline}</p>
                <div className="flex flex-wrap gap-3 text-xs">
                  <span className="text-[#a1a1aa]">USD: <strong className="text-white">{cleanPrice(plan.quarterly_usd ?? plan.monthly_usd) !== null ? `$${cleanPrice(plan.quarterly_usd ?? plan.monthly_usd)}/quarter` : 'Custom'}</strong></span>
                  <span className="text-[#a1a1aa]">INR: <strong className="text-white">{cleanPrice(plan.quarterly_inr ?? plan.monthly_inr) !== null ? `₹${cleanPrice(plan.quarterly_inr ?? plan.monthly_inr)}/quarter` : 'Custom'}</strong></span>
                  <span className="text-[#a1a1aa]">Features: <strong className="text-white">{plan.features?.length ?? 0}</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleClone(plan)} className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#71717a] hover:text-white hover:border-white/20 transition-all cursor-pointer" title="Clone Plan">
                  <Copy size={14} />
                </button>
                <button onClick={() => setModal(plan)} className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#71717a] hover:text-white hover:border-white/20 transition-all cursor-pointer" title="Edit Plan">
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  disabled={deleting === plan.id}
                  className="p-2 rounded-lg bg-red-500/[0.06] border border-red-500/10 text-red-400/60 hover:text-red-400 hover:border-red-500/30 transition-all cursor-pointer disabled:opacity-50"
                  title="Delete Plan"
                >
                  {deleting === plan.id ? <span className="w-3.5 h-3.5 border border-red-400/30 border-t-red-400 rounded-full animate-spin block" /> : <Trash2 size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <PlanModal
          plan={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
