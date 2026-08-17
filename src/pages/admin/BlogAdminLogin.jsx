import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound, User, Lock, AlertCircle, ArrowLeft } from 'lucide-react'
import { api, getRoleFromToken } from '../../hooks/useAdminApi'

export default function BlogAdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('minibee_admin_token')
    if (token) navigate('/blog/admin')
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await api.login(username, password)
      if (res.success && res.token) {
        const role = getRoleFromToken(res.token)
        if (role !== 'blog_admin' && role !== 'system_admin') {
          setError('Access Denied: Invalid role permissions for blog administration.')
          return
        }
        localStorage.setItem('minibee_admin_token', res.token)
        navigate('/blog/admin')
      } else {
        setError(res.error || 'Invalid credentials')
      }
    } catch (err) {
      setError('Connection failed. Is the API server running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070708] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-xs text-[#71717a] hover:text-white mb-6 transition-colors group cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Homepage
        </button>

        <div className="bg-[#0f0f11]/80 border border-white/[0.06] backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center shadow-[0_0_30px_rgba(248,90,34,0.4)]">
            <KeyRound size={28} className="text-white" />
          </div>

          <div className="text-center mt-6 mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">Blog Admin Login</h1>
            <p className="text-[#71717a] text-sm mt-1">Authorized access only</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 mb-6 flex items-center gap-3">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#52525b]">
                  <User size={18} />
                </div>
                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-[#070708] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/35 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#52525b]">
                  <Lock size={18} />
                </div>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#070708] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/35 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(248,90,34,0.3)] mt-6 cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
