import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import UserSidebar from '../../components/UserSidebar'
import { Share2 } from 'lucide-react'
import { getMyActions } from '../../services/api'

const BG = 'linear-gradient(180deg, #004D40 0%, #2E7D32 100%)'
const mockActions = [
  {id:1,status:'approved',action_name:'Penanaman 10 Pohon Bakau',   created_at:'2023-10-12',location:'Kawasan Pesisir Utara',img:'/images/pohon-bakau.jpg'},
  {id:2,status:'pending', action_name:'Donasi 50 Botol Plastik',    created_at:'2023-10-10',location:'Bank Sampah Sejahtera',  img:'/images/botol-plastik.jpg'},
  {id:3,status:'rejected',action_name:'Laporan Pembersihan Selokan',created_at:'2023-10-08',location:'Foto Tidak Jelas',       img:null},
  {id:4,status:'approved',action_name:'Penggunaan Reusable Bag',    created_at:'2023-10-05',location:'Supermarket Lokal',      img:'/images/reusable-bag.jpg'},
  {id:5,status:'approved',action_name:'Kompos Sampah Organik',      created_at:'2023-10-01',location:'Kebun Belakang Rumah',   img:'/images/kompos.jpg'},
]
const statusMap = {
  approved:{label:'DISETUJUI',color:'#166534',bg:'#dcfce7'},
  pending: {label:'TERTUNDA', color:'#92400e',bg:'#fef3c7'},
  rejected:{label:'DITOLAK',  color:'#991b1b',bg:'#fee2e2'},
}

export default function UserRiwayat() {
  const navigate = useNavigate()
  const [actions, setActions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{ fetchActions() },[])
  const fetchActions = async () => {
    try { const res = await getMyActions(); setActions(res.data?.length?res.data:mockActions) }
    catch { setActions(mockActions) } finally { setLoading(false) }
  }
  const fmt = (d) => { if(!d) return '-'; const dt=new Date(d); return isNaN(dt)?d:dt.toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'}) }

  return (
    <div className="flex min-h-screen" style={{ background:BG }}>
      <UserSidebar/>
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="font-black text-3xl text-white mb-6">Riwayat Aksi Saya</h1>
        {loading ? (
          <div className="text-center text-white/40 py-10">Memuat...</div>
        ) : (
          <div className="grid grid-cols-2 gap-5">
            {actions.map(item => {
              const st = statusMap[item.status]||statusMap.pending
              return (
                <div key={item.id} className="rounded-2xl overflow-hidden shadow-md" style={{ background:item.status==='rejected'?'#f0fdf4':'white' }}>
                  <div className="p-4 pb-3">
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full inline-block mb-3 tracking-wide"
                      style={{ background:st.bg, color:st.color }}>{st.label}</span>
                    <div className="flex gap-3 items-start">
                      <div className="flex-1">
                        <div className="font-extrabold text-base text-gray-800 mb-1 leading-snug">{item.action_name}</div>
                        <div className="text-xs text-gray-400">{fmt(item.created_at)}{item.location?` • ${item.location}`:''}</div>
                      </div>
                      {item.img
                        ? <img src={item.img} alt="" className="w-20 h-18 object-cover rounded-xl flex-shrink-0" style={{ height:'72px' }}/>
                        : <div className="w-20 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl" style={{ height:'72px' }}>🪣</div>
                      }
                    </div>
                  </div>
                  <div className="px-4 pb-4 pt-2.5 border-t border-gray-100">
                    {item.status==='approved' && (
                      <div className="flex gap-2 items-center">
                        <button className="flex-1 py-2.5 bg-green-400 text-green-900 font-extrabold text-sm rounded-full cursor-pointer border-none hover:bg-green-500 transition-colors">Lihat Detail</button>
                        <button className="w-10 h-10 bg-gray-100 rounded-full cursor-pointer border-none flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors flex-shrink-0"><Share2 size={14}/></button>
                      </div>
                    )}
                    {item.status==='pending' && (
                      <button className="w-full py-2.5 bg-white border border-gray-200 rounded-full text-gray-500 text-sm font-bold cursor-pointer hover:bg-gray-50 transition-colors">Pantau Status</button>
                    )}
                    {item.status==='rejected' && (
                      <button onClick={()=>navigate('/user/aksi')} className="w-full py-2.5 bg-transparent border border-red-400 rounded-full text-red-400 text-sm font-bold cursor-pointer hover:bg-red-50 transition-colors">Ajukan Ulang</button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
