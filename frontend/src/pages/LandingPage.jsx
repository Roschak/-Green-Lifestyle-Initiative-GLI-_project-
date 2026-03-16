import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()
  const articles = [
    { img:'/images/menanam.png',           title:'Cara Menanam Pohon di Lingkungan Rumah',  desc:'Menanam pohon di sekitar rumah dapat membantu menjaga kualitas udara, memberikan keteduhan, serta membuat lingkungan terlihat lebih hijau.' },
    { img:'/images/bersih-lingkungan.png', title:'Aksi Bersih Lingkungan Bersama',          desc:'Kegiatan bersih lingkungan bersama dapat meningkatkan kesadaran masyarakat untuk menjaga kebersihan serta menciptakan lingkungan yang sehat.' },
    { img:'/images/botol-plastik.png',     title:'Manfaat Daur Ulang Sampah Plastik',       desc:'Daur ulang sampah plastik dapat mengurangi jumlah limbah yang mencemari lingkungan. Selain itu, juga membantu menghemat sumber daya dan energi.' },
    { img:'/images/recycle.png',           title:'Tips Mengurangi Sampah Plastik',          desc:'Mengurangi penggunaan plastik sekali pakai dapat membantu menjaga kelestarian lingkungan. Gunakan tas belanja dan botol minum yang dapat digunakan kembali.' },
  ]

  return (
    <div className="min-h-screen font-poppins" style={{ background:'#b7eb8f' }}>

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-12 py-3" style={{ background:'#b7eb8f' }}>
        <div className="flex items-center gap-8">
          <span className="font-black text-lg" style={{ color:'#1B4332' }}>GLS</span>
          <div className="flex gap-7">
            {['Home','Tentang','Fitur'].map(item => (
              <span key={item} className="text-sm font-medium cursor-pointer" style={{ color:'#1B4332' }}>{item}</span>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/login')} className="px-5 py-2 text-sm font-medium bg-transparent border-none cursor-pointer" style={{ color:'#1B4332' }}>Login</button>
          <button onClick={() => navigate('/register')} className="px-5 py-2 text-sm font-medium bg-transparent border-none cursor-pointer" style={{ color:'#1B4332' }}>Sign Up</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex items-center justify-between px-12 py-12 relative overflow-hidden" style={{ minHeight:'380px' }}>
        <div className="absolute w-56 h-56 rounded-full border-2 border-green-700/25 -left-16 -top-8 pointer-events-none" />
        <div className="absolute w-40 h-40 rounded-full border-2 border-green-700/20 left-16 top-24 pointer-events-none" />
        <div className="absolute w-48 h-48 rounded-full border-2 border-green-700/18 right-24 top-5 pointer-events-none" />
        <div className="absolute w-64 h-64 rounded-full border-2 border-green-700/15 -right-14 -bottom-20 pointer-events-none" />
        <div className="absolute text-9xl select-none pointer-events-none" style={{ left:'370px', top:'18px', color:'rgba(45,106,79,0.18)', lineHeight:1 }}>★</div>

        <div className="flex-1 max-w-lg relative z-10 text-center">
          <h1 className="font-black leading-tight mb-4" style={{ fontSize:'50px', color:'#1B4332' }}>
            Mulai Aksi<br/>Lingkungan dari<br/>Sekarang
          </h1>
          <p className="text-sm mb-8 leading-relaxed" style={{ color:'#2D6A4F' }}>
            Platform untuk melaporkan aksi lingkungan<br/>agar komunitas menjadi lebih hijau.
          </p>
          <button onClick={() => navigate('/register')}
            className="px-7 py-3 rounded-lg text-sm font-bold text-white border-none cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background:'#1B4332' }}>
            Mulai Sekarang
          </button>
        </div>

        <div className="flex-shrink-0 relative z-10">
          <div className="rounded-2xl overflow-hidden border-2 border-green-800" style={{ width:'320px', height:'270px' }}>
            <img src="/images/tangan-bumi.jpg" alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* TENTANG */}
      <section className="flex items-center gap-16 px-12 py-10">
        <div className="flex-shrink-0 rounded-2xl overflow-hidden border-4 border-green-400" style={{ width:'370px', height:'250px' }}>
          <img src="/images/bumi.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h2 className="font-black text-3xl mb-4" style={{ color:'#1B4332' }}>Tentang Platform Kami</h2>
          <p className="text-sm leading-loose" style={{ color:'#2D6A4F' }}>
            Platform ini dibuat untuk membantu masyarakat melaporkan dan memantau aksi lingkungan seperti membersihkan sampah, menanam pohon, dan kegiatan ramah lingkungan lainnya. Dengan sistem ini, komunitas dapat bekerja sama untuk mewujudkan lingkungan yang lebih hijau dan berkelanjutan.
          </p>
        </div>
      </section>

      {/* ARTIKEL */}
      <section className="px-12 pb-16">
        <div className="grid grid-cols-4 gap-4">
          {articles.map((a, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:-translate-y-1 transition-transform">
              <img src={a.img} alt="" className="w-full h-36 object-cover" />
              <div className="p-4">
                <h4 className="text-xs font-bold mb-2 leading-snug" style={{ color:'#1B4332' }}>{a.title}</h4>
                <p className="text-xs leading-relaxed text-gray-500">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
