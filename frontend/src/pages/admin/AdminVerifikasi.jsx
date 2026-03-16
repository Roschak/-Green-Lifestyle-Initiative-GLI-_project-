import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSidebar'
import { Bell, Camera } from 'lucide-react'
import { getPendingActions, verifyAction } from '../../services/api'

const BG = 'linear-gradient(180deg, #004D40 0%, #2E7D32 100%)'
const mockAction = { id:3, user_name:'Nasya Fauziyyah', initials:'NF', aksi_count:24, poin:12500, action_name:'Menanam Pohon', description:'Menanam 50 Bibit Mahoni di lahan kritis untuk membantu reboisasi dan meningkatkan penyerapan emisi karbon di area perkotaan.' }

export default function AdminVerifikasi() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [action,  setAction]  = useState(null)
  const [poin,    setPoin]    = useState('')
  const [catatan, setCatatan] = useState('')
  const [saran,   setSaran]   = useState('')
  const [loading, setLoading] = useState(false)
  const [toast,   setToast]   = useState('')

  useEffect(()=>{ fetchAction() },[id])
  const fetchAction = async () => {
    try { const res = await getPendingActions(); setAction(id?(res.data||[]).find(a=>String(a.id)===String(id)):(res.data||[])[0]||mockAction) }
    catch { setAction(mockAction) }
  }
  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(''),2500) }
  const handleVerify = async (status) => {
    if (status==='rejected'&&!saran.trim()) { showToast('⚠️ Saran perbaikan wajib diisi!'); return }
    setLoading(true)
    try { await verifyAction(action?.id,{status,points_earned:status==='approved'?Number(poin)||0:0,admin_note:catatan,rejection_reason:saran}) } catch {}
    showToast(status==='approved'?'✅ Aksi berhasil diterima!':'❌ Aksi ditolak.')
    setTimeout(()=>navigate('/admin/moderasi'),1000)
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen" style={{ background:BG }}>
      <AdminSidebar/>
      {toast && <div className="fixed top-5 right-5 z-50 bg-green-900 text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-2xl border-l-4 border-green-400">{toast}</div>}
      <main className="flex-1 overflow-y-auto">
        <div className="flex justify-between items-center px-8 py-7 border-b border-white/10">
          <h1 className="font-black text-3xl text-white">Verifikasi Aksi</h1>
          <div className="flex items-center gap-4">
            <Bell size={22} color="white"/>
            <span className="text-white/60 text-sm">3 Maret 2026</span>
          </div>
        </div>
        <div className="px-8 py-6">
          <h2 className="font-extrabold text-xl text-white mb-1">Review Aksi User</h2>
          <p className="text-white/55 text-sm mb-6">Tinjau detail foto dan aksi sebelum memberikan poin.</p>

          {/* User card */}
          <div className="bg-white/15 rounded-2xl px-5 py-4 flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center text-lg font-extrabold text-white flex-shrink-0">{action?.initials||'NF'}</div>
            <div>
              <div className="text-xl font-black text-white">{action?.user_name||'Nasya Fauziyyah'}</div>
              <div className="flex gap-3 mt-1.5">
                <span className="bg-white/15 text-white/80 text-xs px-3 py-1 rounded-full">▶ {action?.aksi_count||24} Aksi Dikirim</span>
                <span className="bg-yellow-400/20 text-yellow-300 text-xs px-3 py-1 rounded-full">⊙ {action?.poin?.toLocaleString('id-ID')||'12.500'} Poin</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_360px] gap-6">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-white/45 mb-3 flex items-center gap-1.5"><Camera size={12}/> BUKTI DOKUMENTASI</div>
              <div className="border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-white/40 transition-colors" style={{ height:'320px' }}>
                <Camera size={36} color="rgba(255,255,255,0.25)"/>
                <span className="text-sm text-white/35">Ambil foto atau unggah galeri</span>
              </div>
            </div>

            {/* Info + Form */}
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-white/45 mb-3">INFORMASI AKSI</div>
              <div className="bg-white rounded-2xl p-5 mb-5">
                <div className="text-xs text-gray-400 font-bold mb-2">Kategori Aksi</div>
                <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full mb-4">
                  <div className="w-7 h-7 bg-green-400 rounded-lg flex items-center justify-center text-sm">🌲</div>
                  <span className="font-bold text-green-800 text-sm">{action?.action_name||'Menanam Pohon'}</span>
                </div>
                <div className="text-xs text-gray-400 font-bold mb-2">Detail Aksi</div>
                <p className="text-sm text-gray-500 leading-relaxed">{action?.description||'-'}</p>
              </div>

              <div className="text-xs font-extrabold uppercase tracking-wider text-white/45 mb-3">VERIFIKASI</div>
              <div className="bg-white rounded-2xl p-5">
                <label className="block text-sm text-gray-600 font-semibold mb-2">Input Poin</label>
                <input type="number" value={poin} onChange={e=>setPoin(e.target.value)} placeholder="Contoh: 50"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none mb-4 font-poppins focus:border-green-400"/>
                <label className="block text-sm text-gray-600 font-semibold mb-2">Catatan Admin</label>
                <textarea value={catatan} onChange={e=>setCatatan(e.target.value)} placeholder="tambahkan catatan disini..." rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none mb-4 resize-none font-poppins focus:border-green-400"/>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm text-gray-600 font-semibold">Saran Perbaikan</label>
                  <span className="bg-red-500 text-white text-xs font-extrabold px-2 py-0.5 rounded uppercase">WAJIB JIKA DITOLAK</span>
                </div>
                <textarea value={saran} onChange={e=>setSaran(e.target.value)} placeholder="Jelaskan alasan penolakan dan langkah perbaikan.." rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none mb-4 resize-none font-poppins focus:border-green-400"/>
                <div className="flex gap-3">
                  <button onClick={()=>handleVerify('rejected')} disabled={loading}
                    className="flex-1 py-3 bg-red-500 text-white font-bold text-sm rounded-full cursor-pointer border-none hover:bg-red-600 transition-colors flex items-center justify-center gap-1.5">
                    🚫 Tolak
                  </button>
                  <button onClick={()=>handleVerify('approved')} disabled={loading}
                    className="flex-1 py-3 bg-green-400 text-white font-bold text-sm rounded-full cursor-pointer border-none hover:bg-green-500 transition-colors flex items-center justify-center gap-1.5">
                    ✅ Terima
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
