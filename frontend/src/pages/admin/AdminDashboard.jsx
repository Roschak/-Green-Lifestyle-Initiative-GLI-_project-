import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSidebar'
import { Bell, Users, X, Clock } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'

const BG = 'linear-gradient(180deg, #004D40 0%, #2E7D32 100%)'
const chartData = [
  {day:'MON',value:60},{day:'TUE',value:45},{day:'WED',value:80},
  {day:'THU',value:55},{day:'FRI',value:70},{day:'SAT',value:90},{day:'SUN',value:110},
]
const recentActions = [
  {id:1,initials:'RW',color:'#e57373',name:'Raissa Wulan',     time:'10.45 AM',cat:'Menanam Pohon',desc:'Menanam 5 bibit pohon mangga di lahan A'},
  {id:2,initials:'KD',color:'#7986cb',name:'Keysha Desmayanti',time:'09.55 AM',cat:'Energi',       desc:'Pemasangan panel surya mandiri untuk penerangan jalan'},
  {id:3,initials:'NF',color:'#4db6ac',name:'Nasya Fauziyyah',  time:'08.00 AM',cat:'Menanam Pohon',desc:'Menanam 50 Bibit Mahoni di lahan kritis.'},
  {id:4,initials:'SA',color:'#aed581',name:'Shyfha Ambarsari', time:'10.39 AM',cat:'Menanam Pohon',desc:'Penanaman bibit pohon jambu untuk penghijauan taman'},
  {id:5,initials:'PA',color:'#f06292',name:'Putri Aprillia',   time:'11.13 AM',cat:'Limbah',       desc:'Daur ulang botol plastik jadi pot tanaman'},
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [modal, setModal] = useState(null)

  return (
    <div className="flex min-h-screen" style={{ background:BG }}>
      <AdminSidebar/>
      <main className="flex-1 overflow-y-auto" style={{ background:BG }}>
        <div className="flex justify-between items-center px-8 py-7 border-b border-white/10">
          <h1 className="font-black text-3xl text-white">Dashboard Admin!</h1>
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer">
              <Bell size={22} color="white"/>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full"/>
            </div>
            <span className="text-white/60 text-sm">3 Maret 2026</span>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-[1fr_240px] gap-5 mb-5">

            <div className="bg-white rounded-2xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-bold text-base text-gray-800">Tren Aksi (7 Hari Terakhir)</div>
                  <div className="text-xs text-gray-400 mt-0.5">Aktivitas moderasi harian</div>
                </div>
                <span className="bg-green-50 text-green-800 text-xs font-bold px-3 py-1 rounded-full">Total: 842 Aksi ↑</span>
              </div>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip contentStyle={{ background:'#1B4332', border:'none', borderRadius:'8px', color:'white', fontSize:'12px' }} formatter={v=>[v,'Aksi']}/>
                    <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2.5} fill="url(#ag)" dot={false} activeDot={{ r:4, fill:'#22c55e' }}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between pt-1">
                {chartData.map(d=><span key={d.day} className="text-xs text-gray-300">{d.day}</span>)}
              </div>
            </div>

            
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl p-5" style={{ background:'#1B4332' }}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-white">User Aktif</span>
                  <Users size={20} color="rgba(255,255,255,0.6)"/>
                </div>
                <div className="bg-white rounded-xl px-5 py-3">
                  <div className="text-5xl font-black text-gray-800">300</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <X size={13} color="#ef4444"/>
                    <span className="text-xs font-bold text-gray-500">Ditolak</span>
                  </div>
                  <div className="text-4xl font-black text-gray-800">7</div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Clock size={13} color="#f59e0b"/>
                    <span className="text-xs font-bold text-gray-500">Aksi Pending</span>
                  </div>
                  <div className="text-4xl font-black text-gray-800">15</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-extrabold text-lg text-gray-800">Aksi Terbaru</span>
              <span onClick={()=>navigate('/admin/moderasi')} className="text-sm text-green-500 cursor-pointer font-bold">Lihat Semua</span>
            </div>
            <div className="grid grid-cols-[1.8fr_1fr_1fr_90px] gap-3 pb-2 border-b border-gray-100">
              {['NAMA USER','KATEGORI','WAKTU',''].map(h=>(
                <span key={h} className="text-xs uppercase tracking-widest text-gray-300 font-bold">{h}</span>
              ))}
            </div>
            {recentActions.map((row,i)=>(
              <div key={row.id} className={`grid grid-cols-[1.8fr_1fr_1fr_90px] gap-3 py-3 items-center ${i<recentActions.length-1?'border-b border-gray-50':''}`}>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0" style={{ background:row.color }}>{row.initials}</div>
                  <span className="text-sm text-gray-800 font-medium">{row.name}</span>
                </div>
                <span className="text-sm text-gray-400">{row.cat}</span>
                <span className="text-sm text-gray-400">{row.time}</span>
                <button onClick={()=>setModal(row)} className="px-4 py-1.5 bg-green-400 text-white font-bold text-sm rounded-lg cursor-pointer border-none hover:bg-green-500 transition-colors">Cek</button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {modal && (
        <div onClick={()=>setModal(null)} className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50 flex items-center justify-center">
          <div onClick={e=>e.stopPropagation()} className="rounded-2xl p-7 max-w-md w-11/12 border border-white/10" style={{ background:'#1B4332' }}>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-extrabold text-white" style={{ background:modal.color }}>{modal.initials}</div>
              <div>
                <div className="text-xl font-extrabold text-white">{modal.name}</div>
                <div className="flex gap-3 mt-1">
                  <span className="text-xs text-white/50">▶ 24 Aksi Dikirim</span>
                  <span className="text-xs text-yellow-400">◉ 12.500 Poin</span>
                </div>
              </div>
            </div>
            <div className="text-xs uppercase tracking-widest text-white/35 mb-2 font-bold">KATEGORI AKSI</div>
            <div className="flex items-center gap-2 bg-white/8 rounded-xl px-4 py-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background:'#2D6A4F' }}>🌱</div>
              <span className="font-bold text-white text-sm">{modal.cat}</span>
            </div>
            <div className="text-xs uppercase tracking-widest text-white/35 mb-2 font-bold">DETAIL AKSI</div>
            <p className="text-sm text-white/65 leading-relaxed mb-4">{modal.desc}</p>
            <div className="flex gap-6 mb-5">
              <div>
                <div className="text-xs text-white/35 mb-1">Tanggal Pengiriman</div>
                <div className="text-sm text-white font-semibold">14 Okt 2023</div>
              </div>
              <div>
                <div className="text-xs text-white/35 mb-1">Status Aksi</div>
                <span className="bg-green-400/15 text-green-400 text-xs font-bold px-3 py-1 rounded-full">DITERIMA</span>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={()=>{ setModal(null); navigate('/admin/verifikasi') }} className="px-5 py-2.5 bg-green-400 text-green-900 font-bold text-sm rounded-xl cursor-pointer border-none">Verifikasi</button>
              <button onClick={()=>setModal(null)} className="px-6 py-2.5 text-white font-semibold text-sm rounded-xl cursor-pointer border-none bg-white/10">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
