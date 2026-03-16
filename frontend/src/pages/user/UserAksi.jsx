import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserSidebar from '../../components/UserSidebar'
import { useAuth } from '../../context/AuthContext'
import { Camera } from 'lucide-react'
import { reportAction } from '../../services/api'

const BG = 'linear-gradient(180deg, #004D40 0%, #2E7D32 100%)'

export default function UserAksi() {
  const navigate = useNavigate()
  const { user }  = useAuth()
  const [kategori, setKategori] = useState('')
  const [jenis,    setJenis]    = useState('')
  const [detail,   setDetail]   = useState('')
  const [loading,  setLoading]  = useState(false)
  const [toast,    setToast]    = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(''),3000) }
  const handleSubmit = async () => {
    if (!kategori||!jenis||!detail.trim()) { showToast('⚠️ Semua field wajib diisi!'); return }
    setLoading(true)
    try { await reportAction({user_id:user?.id,action_name:`${kategori} - ${jenis}`,description:detail}) } catch {}
    showToast('✅ Aksi berhasil disimpan!')
    setTimeout(()=>navigate('/user/riwayat'),1200)
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen" style={{ background:BG }}>
      <UserSidebar/>
      {toast && <div className="fixed top-5 right-5 z-50 bg-green-900 text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-2xl border-l-4 border-green-400">{toast}</div>}
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="font-black text-3xl text-white mb-6">Aksi Lingkungan</h1>

        {/* Target */}
        <div className="rounded-2xl px-6 py-5 mb-7 bg-green-400">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase tracking-wider text-white/85 font-bold">TARGET MINGGU INI</span>
            <span className="text-xl">🌿</span>
          </div>
          <div className="text-5xl font-black text-white my-2 leading-none">85%</div>
          <div className="bg-white/35 rounded-full h-2 mb-2.5">
            <div className="bg-white h-full rounded-full w-[85%]"/>
          </div>
          <p className="text-sm text-white/90">Luar biasa! 3 aksi lagi untuk mencapai target mingguanmu.</p>
        </div>

        <h3 className="font-extrabold text-xl text-white mb-1">Catat Aksi Baru</h3>
        <p className="text-sm text-white/55 mb-5">Lengkapi data kontribusi lingkunganmu hari ini.</p>

        <div className="grid grid-cols-2 gap-7">
          <div>
            <label className="block text-sm text-white/85 font-semibold mb-2">Kategori Kontribusi</label>
            <select value={kategori} onChange={e=>setKategori(e.target.value)} className="w-full px-4 py-3 bg-white rounded-xl text-sm text-gray-500 outline-none mb-5 font-poppins cursor-pointer appearance-none">
              <option value="" disabled>Pilih Kategori</option>
              <option>Menanam Pohon</option>
              <option>Daur Ulang</option>
              <option>Energi Terbarukan</option>
              <option>Kebersihan Lingkungan</option>
              <option>Pengelolaan Limbah</option>
            </select>
            <label className="block text-sm text-white/85 font-semibold mb-2">Jenis Aksi</label>
            <select value={jenis} onChange={e=>setJenis(e.target.value)} className="w-full px-4 py-3 bg-white rounded-xl text-sm text-gray-500 outline-none mb-5 font-poppins cursor-pointer appearance-none">
              <option value="" disabled>Pilih Jenis Aksi</option>
              <option>Penanaman Bibit</option>
              <option>Pembuatan Kompos</option>
              <option>Bersih-Bersih Lingkungan</option>
              <option>Daur Ulang Plastik</option>
              <option>Donasi Sampah</option>
            </select>
            <label className="block text-sm text-white/85 font-semibold mb-2">Detail Aksi / Catatan</label>
            <textarea value={detail} onChange={e=>setDetail(e.target.value)}
              placeholder="Tuliskan detail kontribusimu atau catatan tambahan di sini..." rows={5}
              className="w-full px-4 py-3 bg-white rounded-xl text-sm text-gray-500 outline-none resize-none font-poppins"/>
          </div>
          <div>
            <label className="block text-sm text-white/85 font-semibold mb-2">Bukti Foto</label>
            <div className="bg-white/10 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-2.5 cursor-pointer mb-5 hover:border-white/40 transition-colors relative" style={{ height:'220px' }}>
              <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-extrabold text-sm">
                {user?.name?.[0]?.toUpperCase()||'R'}
              </div>
              <Camera size={32} color="rgba(255,255,255,0.25)"/>
              <span className="text-sm text-white/40">Ambil foto atau unggah galeri</span>
            </div>
            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-4 rounded-xl text-green-900 font-extrabold text-base cursor-pointer border-none hover:opacity-90 transition-opacity"
              style={{ background:loading?'#16a34a':'#4ade80' }}>
              {loading ? 'Menyimpan...' : 'Simpan Aksi Sekarang'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
