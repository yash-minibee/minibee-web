import { useEffect } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, PlusCircle, LogOut, ExternalLink, Shield } from 'lucide-react'
import { getRoleFromToken } from '../../hooks/useAdminApi'

export default function BlogAdminLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('minibee_admin_token')
    if (!token) {
      navigate('/blog/admin/login')
    } else {
      const role = getRoleFromToken(token)
      if (role !== 'blog_admin' && role !== 'system_admin') {
        localStorage.removeItem('minibee_admin_token')
        navigate('/blog/admin/login')
      }
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('minibee_admin_token')
    navigate('/blog/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#070708] text-[#a1a1aa] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-white/[0.06] bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/blog/admin" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-white shadow-lg">B</span>
              <span className="font-extrabold text-white tracking-tight text-lg">Blog<span className="text-orange-500">Admin</span></span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1.5 ml-4">
              <NavLink 
                to="/blog/admin" 
                end
                className={({ isActive }) => 
                  `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive 
                      ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
                      : 'hover:text-white border border-transparent'
                  }`
                }
              >
                <LayoutDashboard size={14} /> Dashboard
              </NavLink>
              <NavLink 
                to="/blog/admin/add" 
                className={({ isActive }) => 
                  `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive 
                      ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
                      : 'hover:text-white border border-transparent'
                  }`
                }
              >
                <PlusCircle size={14} /> New Post
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              to="/admin" 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] text-[10px] font-bold text-[#a1a1aa] hover:text-white transition-all"
            >
              <Shield size={12} className="text-purple-400" /> System Admin
            </Link>
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] text-[10px] font-bold text-[#a1a1aa] hover:text-white transition-all"
            >
              Live Site <ExternalLink size={11} />
            </a>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/[0.06] hover:bg-red-500/10 border border-red-500/10 text-[10px] font-bold text-red-400 hover:text-red-300 transition-all cursor-pointer"
            >
              <LogOut size={12} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
