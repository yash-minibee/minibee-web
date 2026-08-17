import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, getRoleFromToken } from '../../hooks/useAdminApi'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.login(username, password)
      if (res.success) {
        const role = getRoleFromToken(res.token)
        if (role !== 'system_admin') {
          setError('Access Denied: You do not have System Administrator privileges.')
          return
        }
        localStorage.setItem('minibee_admin_token', res.token)
        navigate('/admin/pricing')
      } else {
        setError('Invalid username or password.')
      }
    } catch {
      setError('Cannot connect to backend. Make sure PHP server is running on port 8080.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at top, rgba(248,90,34,0.08) 0%, #09090b 60%)' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-400">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Minibee Admin</h1>
          <p className="text-sm text-[#71717a] mt-1">Sign in to manage your content</p>
        </div>

        {/* Card */}
        <div className="bg-[#111113] border border-white/[0.08] rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] mb-2 uppercase tracking-wider">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] mb-2 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-xs text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(248,90,34,0.3)]"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#3f3f46] mt-6">Minibee Admin Panel · Internal Use Only</p>
      </div>
    </div>
  )
}
