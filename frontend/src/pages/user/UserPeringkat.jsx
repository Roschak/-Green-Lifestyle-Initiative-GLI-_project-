import { useState, useEffect } from 'react'
import UserSidebar from '../../components/UserSidebar'
import { useAuth } from '../../context/AuthContext'
import { getLeaderboard } from '../../services/api'

const BG = 'linear-gradient(180deg, #004D40 0%, #2E7D32 100%)'
const mockRank = [
  {rank:1,name:'Putri Aprillia', initials:'PA',aksi:128,poin:12450},
  {rank:2,name:'Hayfa Rania',    initials:'HR',aksi:114,poin:11200},
  {rank:3,name:'Siti Zulfatul',  initials:'SZ',aksi:98, poin:9850},
  {rank:4,name:'Talita Dzakiran',initials:'TD',aksi:85, poin:6300},
  {rank:5,name:'Nasya Fauziyah', initials:'NF',aksi:72, poin:5100},
  {rank:6,name:'Shyfha Ambar',   initials:'SA',aksi:66, poin:4400},
  {rank:7,name:'Indriyanti',     initials:'I', aksi:54, poin:3900},
]
const medals = ['🥇','🥈','🥉']
const getInitials = (name) => name?name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase():'??'

export default function UserPeringkat() {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState([])
  const [myRank, setMyRank] = useState({rank:12,poin:3850,hint:'BUTUH 450 POIN UNTUK NAIK PERINGKAT'})
  const [loading, setLoading] = useState(true)

  useEffect(()=>{ fetchLeaderboard() },[])
  const fetchLeaderboard = async () => {
    try {
      const res = await getLeaderboard()
      const data = res.data||[]
      setLeaderboard(data.length?data.map((u,i)=>({rank:i+1,name:u.name,initials:getInitials(u.name),aksi:u.total_actions||0,poin:u.points||0})):mockRank)
    } catch { setLeaderboard(mockRank) } finally { setLoading(false) }
  }

  return (
    <div className="flex min-h-screen" style={{ background:BG }}>
      <UserSidebar/>
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="font-black text-3xl text-white mb-6">Papan Peringkat</h1>

        {/* Period card */}
        <div className="bg-white/10 rounded-2xl px-6 py-5 border border-white/15 flex justify-between items-center mb-5">
          <div>
            <h4 className="font-extrabold text-base text-white mb-0.5">Periode Ini</h4>
            <p className="text-xs text-white/45">Berakhir dalam 4 hari</p>
            <div className="text-sm text-white/70 font-semibold mt-2.5">🏆 Total 2,450 Kontribusi Bulan Ini</div>
          </div>
          <span className="bg-white text-green-800 text-xs font-extrabold px-5 py-1.5 rounded-full">AKTIF</span>
        </div>

        {loading ? (
          <div className="text-center text-white/40 py-10">Memuat...</div>
        ) : (
          <div className="flex flex-col gap-2">
            {leaderboard.map(item => {
              const isTop3 = item.rank <= 3
              return (
                <div key={item.rank} className={`rounded-2xl px-5 py-3.5 flex items-center gap-4 ${isTop3?'border-none':'border-none'}`}
                  style={{ background:isTop3?'#bbf7d0':'transparent' }}>
                  {isTop3
                    ? <span className="text-xl w-7 text-center">{medals[item.rank-1]}</span>
                    : <span className="text-sm font-black text-white/45 w-7 text-center">{item.rank}</span>
                  }
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${isTop3?'border-2 border-green-700/30 bg-transparent text-transparent':'bg-white/15 text-white/50'}`}>
                    {!isTop3 && (item.initials||getInitials(item.name))}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-bold ${isTop3?'text-green-900':'text-white/65'}`}>{item.name}</div>
                    <div className={`text-xs mt-0.5 ${isTop3?'text-green-700/50':'text-white/35'}`}>{item.aksi} Aksi{isTop3?' Disetujui':''}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-black ${isTop3?'text-green-900':'text-white/30'}`}>{item.poin.toLocaleString('id-ID')}</div>
                    <div className={`text-xs uppercase tracking-wide font-bold ${isTop3?'text-green-700/40':'text-white/20'}`}>POIN</div>
                  </div>
                </div>
              )
            })}

            <div className="rounded-2xl px-5 py-3.5 flex items-center gap-4 mt-1 bg-green-400">
              <span className="text-sm font-black text-green-900/70 w-7 text-center">{myRank.rank}</span>
              <div className="w-11 h-11 rounded-full bg-white/30 border-2 border-white/60 flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" fill="rgba(0,50,0,0.5)"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="rgba(0,50,0,0.5)" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-green-900">Anda (Saya)</div>
                <div className="text-xs font-extrabold uppercase tracking-wide text-green-900/60 mt-0.5">{myRank.hint}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-green-900">{(myRank.poin||user?.points||0).toLocaleString('id-ID')}</div>
                <div className="text-xs uppercase tracking-wide font-bold text-green-900/50">POIN</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
