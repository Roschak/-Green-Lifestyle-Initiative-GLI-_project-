import { useNavigate } from 'react-router-dom'
import UserSidebar from '../../components/UserSidebar'
import { useAuth } from '../../context/AuthContext'
import { BarChart, Bar, ResponsiveContainer, Cell, XAxis } from 'recharts'

const BG = 'linear-gradient(180deg, #004D40 0%, #2E7D32 100%)'
const weekData = [
  {day:'Sen',val:2},{day:'Sel',val:5},{day:'Rab',val:3},
  {day:'Kam',val:7},{day:'Jum',val:9},{day:'Sab',val:5},{day:'Min',val:2},
]

export default function UserDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen">
      <UserSidebar/>
      <main className="flex-1 overflow-y-auto p-8" style={{ background:BG }}>
        <h1 className="font-black text-3xl text-white mb-0.5">Halo, Selamat Datang!</h1>
        <div className="text-green-400 text-sm font-semibold mb-7">Level : {user?.level||'Penanaman Pohon'}</div>

        <div className="grid grid-cols-2 gap-5 mb-8">
          {[
            {label:'Total Poin', icon:'⊕'},
            {label:'Total Aksi', icon:'🌿'},
          ].map(card=>(
            <div key={card.label} className="rounded-2xl p-6" style={{ background:'linear-gradient(135deg,#4ade80,#22c55e)', minHeight:'130px' }}>
              <div className="text-sm text-white/90 font-bold flex items-center gap-2">{card.icon} {card.label}</div>
            </div>
          ))}
        </div>

        {/* Status Kontribusi */}
        <h2 className="font-extrabold text-xl text-white mb-4">Status Kontribusi</h2>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div onClick={()=>navigate('/user/riwayat')} className="rounded-2xl py-7 flex flex-col items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity" style={{ background:'linear-gradient(135deg,#4ade80,#22c55e)' }}>
            <div className="w-11 h-11 rounded-full border-2 border-white/70 flex items-center justify-center bg-white/15">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span className="text-white font-bold text-sm">Disetujui</span>
          </div>
          <div onClick={()=>navigate('/user/riwayat')} className="rounded-2xl py-7 flex flex-col items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity" style={{ background:'linear-gradient(135deg,#86efac,#4ade80)' }}>
            <div className="w-11 h-11 rounded-full border-2 border-white/70 flex items-center justify-center bg-white/15">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2.2"/><path d="M12 7v5l3 3" stroke="white" strokeWidth="2.2" strokeLinecap="round"/></svg>
            </div>
            <span className="text-white font-bold text-sm">Tertunda</span>
          </div>
          <div onClick={()=>navigate('/user/riwayat')} className="rounded-2xl py-7 flex flex-col items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity" style={{ background:'linear-gradient(135deg,#bbf7d0,#86efac)' }}>
            <div className="w-11 h-11 rounded-full border-2 border-red-400/80 flex items-center justify-center bg-red-100/10">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </div>
            <span className="font-bold text-sm" style={{ color:'#1B4332' }}>Ditolak</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <h2 className="font-extrabold text-xl text-white">Kontribusi Mingguan</h2>
          <select className="bg-white/15 border border-white/20 rounded-lg text-white text-xs px-2.5 py-1 outline-none cursor-pointer">
            <option style={{ background:'#1B4332' }}>Minggu Ini</option>
            <option style={{ background:'#1B4332' }}>Bulan Ini</option>
          </select>
        </div>
        <div className="rounded-2xl p-5" style={{ background:'#b7eb8f', height:'200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekData} barSize={18}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill:'#555', fontSize:11 }}/>
              <Bar dataKey="val" radius={[5,5,0,0]}>
                {weekData.map((entry,i)=>(
                  <Cell key={i} fill={entry.val===Math.max(...weekData.map(d=>d.val))?'#1B4332':'#52c41a'}/>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  )
}
