import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSidebar'
import { Bell } from 'lucide-react'
import { getPendingActions, getAllActions } from '../../services/api'

const BG = 'linear-gradient(180deg, #004D40 0%, #2E7D32 100%)'
const catColors = {
  'Menanam pohon': 'bg-green-100 text-green-800',
  'Energi':        'bg-yellow-100 text-yellow-800',
  'Lingkungan':    'bg-blue-100 text-blue-800',
  'Limbah':        'bg-red-100 text-red-800',
  'Daur Ulang':    'bg-orange-100 text-orange-800',
}
const mockPending = [
  {id:1,user_name:'Raissa Wulan',     initials:'RW',color:'#e8d5d5',description:'Menanam 5 bibit pohon mangga di lahan A',             action_name:'Menanam pohon'},
  {id:2,user_name:'Keysha Desmayanti',initials:'KD',color:'#d5d5e8',description:'Pemasangan panel surya mandiri untuk penerangan jalan',action_name:'Energi'},
  {id:3,user_name:'Nasya Fauziyyah',  initials:'NF',color:'#d5e8e5',description:'Pembersihan sampah plastik di selokan warga',          action_name:'Lingkungan'},
  {id:4,user_name:'Shyfha Ambarsari', initials:'SA',color:'#e5e8d5',description:'Penanaman bibit pohon jambu untuk penghijauan taman',  action_name:'Menanam pohon'},
  {id:5,user_name:'Putri Aprillia',   initials:'PA',color:'#e8d5e2',description:'Daur ulang botol plastik jadi pot tanaman',            action_name:'Limbah'},
]

export default function AdminModerasi() {
  const navigate = useNavigate()
  const [pending,  setPending]  = useState([])
  const [rejected, setRejected] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(()=>{ fetchData() },[])
  const fetchData = async () => {
    try {
      const [pRes, aRes] = await Promise.all([getPendingActions(), getAllActions()])
      setPending(pRes.data?.length ? pRes.data : mockPending)
      setRejected((aRes.data||[]).filter(a=>a.status==='rejected').length ? (aRes.data||[]).filter(a=>a.status==='rejected') : [])
    } catch { setPending(mockPending); setRejected([]) }
    finally { setLoading(false) }
  }

  const TableRows = ({ rows, showVerif }) => (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {['NAMA USER','DETAIL AKSI','KATEGORI','BUKTI FOTO',...(showVerif?['']:[''])].map((h,i)=>(
            <th key={i} className="text-left text-xs font-extrabold text-gray-400 tracking-wider pb-3 px-2 uppercase">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr><td colSpan="5" className="py-5 text-center text-gray-400 text-sm">Memuat...</td></tr>
        ) : rows.map((row,i)=>(
          <tr key={row.id||i} className={i<rows.length-1?'border-b border-gray-100':''}>
            <td className="py-3 px-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold text-gray-600 flex-shrink-0" style={{ background:row.color||'#e0e0e0' }}>{row.initials||'??'}</div>
                <span className="text-sm text-gray-800 font-medium">{row.user_name}</span>
              </div>
            </td>
            <td className="py-3 px-2 text-sm text-gray-500 leading-snug max-w-xs">{row.description}</td>
            <td className="py-3 px-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${catColors[row.action_name]||'bg-gray-100 text-gray-600'}`}>{row.action_name||'-'}</span>
            </td>
            <td className="py-3 px-2">
              <div className="w-10 h-10 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-300 text-lg bg-gray-50">📷+</div>
            </td>
            {showVerif && (
              <td className="py-3 px-2">
                <button onClick={()=>navigate(`/admin/verifikasi/${row.id||''}`)}
                  className="px-5 py-2 bg-green-400 text-white font-bold text-sm rounded-lg cursor-pointer border-none hover:bg-green-500 transition-colors">Verifikasi</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <div className="flex min-h-screen" style={{ background:BG }}>
      <AdminSidebar/>
      <main className="flex-1 overflow-y-auto">
        <div className="flex justify-between items-center px-8 py-7 border-b border-white/10">
          <h1 className="font-black text-3xl text-white">Daftar Moderasi</h1>
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer">
              <Bell size={22} color="white"/>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full"/>
            </div>
            <span className="text-white/60 text-sm">3 Maret 2026</span>
          </div>
        </div>
        <div className="p-8">
          {/* PENDING */}
          <div className="bg-white rounded-2xl p-6 mb-5">
            <div className="text-xs font-extrabold tracking-widest text-yellow-500 uppercase mb-4 pb-3 border-b border-gray-100">PENDING</div>
            <TableRows rows={pending} showVerif={true}/>
          </div>
          {/* DITOLAK */}
          <div className="rounded-xl overflow-hidden border border-white/20">
            <div className="px-6 py-4 bg-white/10">
              <span className="text-xs font-extrabold tracking-widest text-red-400 uppercase">DITOLAK</span>
            </div>
            {rejected.length > 0 && (
              <div className="bg-white p-6">
                <TableRows rows={rejected} showVerif={false}/>
              </div>
            )}
            {rejected.length === 0 && (
              <div className="bg-white/5 px-6 py-5 text-sm text-white/40 text-center">Tidak ada data yang ditolak</div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
