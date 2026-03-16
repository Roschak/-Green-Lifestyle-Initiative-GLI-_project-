import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Shield, CheckCircle, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AdminSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const handleLogout = () => { logout(); navigate('/login') }

  const navItems = [
    { path:'/admin/dashboard',  label:'Dashboard',  icon:LayoutDashboard },
    { path:'/admin/moderasi',   label:'Moderasi',   icon:Shield },
    { path:'/admin/verifikasi', label:'Verifikasi', icon:CheckCircle },
  ]

  return (
    <aside className="w-64 min-h-screen flex flex-col flex-shrink-0 sticky top-0 h-screen"
      style={{ background:'linear-gradient(180deg, #1B4332 0%, #2D6A4F 100%)' }}>
      <div className="p-5 pb-3">
        <div className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-full border-2 border-green-400 flex items-center justify-center flex-shrink-0">
            <div className="w-6 h-6 rounded-full border-2 border-green-400" />
          </div>
          <div>
            <div className="text-green-900 font-bold text-sm">{user?.name?.split(' ')[0] || 'Ragah'}</div>
            <div className="text-green-500 text-xs font-semibold">online</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
          return (
            <div key={item.path} onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 cursor-pointer text-white font-medium text-sm transition-all
                ${isActive ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
              <Icon size={18} /> {item.label}
            </div>
          )
        })}
      </nav>

      <div className="px-3 pb-6">
        <div onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-white/60 text-sm hover:text-white hover:bg-white/10 transition-all">
          <LogOut size={16} /> Logout
        </div>
      </div>
    </aside>
  )
}
