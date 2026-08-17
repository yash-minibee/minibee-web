import { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, DollarSign, BarChart2, FolderOpen, LogOut, ExternalLink, Zap, Users } from 'lucide-react'
import { getRoleFromToken } from '../../hooks/useAdminApi'

const NAV_ITEMS = [
  { to: '/admin/pricing',          icon: DollarSign,  label: 'Pricing Plans' },
  { to: '/admin/addons',           icon: Zap,         label: 'Add-ons'       },
  { to: '/admin/comparison',       icon: BarChart2,   label: 'Comparison'    },
  { to: '/admin/portfolio',        icon: FolderOpen,  label: 'Web Portfolio' },
  { to: '/admin/whatsapp-clients', icon: Users,       label: 'WA Clients'    },
]

export default function AdminLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('minibee_admin_token')
    if (!token) {
      navigate('/admin/login')
    } else {
      const role = getRoleFromToken(token)
      if (role !== 'system_admin') {
        localStorage.removeItem('minibee_admin_token')
        navigate('/admin/login')
      }
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('minibee_admin_token')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-[#0a0a0c] border-r border-white/[0.06] flex flex-col fixed top-0 left-0 z-20">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <LayoutDashboard size={16} className="text-orange-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Minibee</div>
              <div className="text-[10px] text-[#71717a] font-medium">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    : 'text-[#71717a] hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/[0.06] space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#71717a] hover:text-white hover:bg-white/[0.04] transition-all"
          >
            <ExternalLink size={16} />
            View Website
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#71717a] hover:text-red-400 hover:bg-red-500/[0.06] transition-all cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
