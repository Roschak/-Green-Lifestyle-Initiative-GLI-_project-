import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [form, setForm] = useState({ email:'', password:'', confirm:'' })
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRegister = () => {
    setError(''); setSuccess('')
    if (!form.email || !form.password) { setError('Semua field wajib diisi!'); return }
    if (form.password !== form.confirm) { setError('Password tidak cocok!'); return }
    if (!agree) { setError('Centang persetujuan terlebih dahulu.'); return }
    setSuccess('Registrasi berhasil! Silakan login.')
    setTimeout(() => navigate('/login'), 1500)
  }

  return (
    <div className="flex h-screen overflow-hidden font-poppins">
      <div className="w-5/12 overflow-hidden">
        <img src="/images/pohon.jpg" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 relative overflow-hidden">
        <img src="/images/pohon.jpg" alt="" className="absolute inset-0 w-full h-full object-cover blur-xl scale-110" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex items-center justify-center h-full p-10 overflow-y-auto">
          <div className="w-full max-w-md">
            <h1 className="font-black text-4xl text-white text-center mb-2">Create an account</h1>
            <p className="text-white/75 text-sm text-center mb-7 leading-relaxed">Join our community and start your journey today</p>

            {error   && <div className="bg-red-500/15 border border-red-400/40 rounded-lg p-3 mb-4 text-red-300 text-sm text-center">{error}</div>}
            {success && <div className="bg-green-500/15 border border-green-400/40 rounded-lg p-3 mb-4 text-green-300 text-sm text-center">{success}</div>}

            <div className="mb-4">
              <label className="block text-xs font-bold tracking-widest text-white/70 mb-2 uppercase">EMAIL</label>
              <input type="text" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
                placeholder="email@gmail.com"
                className="w-full px-4 py-3 bg-white rounded-xl text-sm text-gray-800 outline-none font-poppins" />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-bold tracking-widest text-white/70 mb-2 uppercase">PASSWORD</label>
              <div className="relative">
                <input type={showPass?'text':'password'} value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
                  placeholder="••••••••••"
                  className="w-full px-4 py-3 pr-12 bg-white rounded-xl text-sm text-gray-800 outline-none font-poppins" />
                <button onClick={()=>setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 bg-transparent border-none cursor-pointer p-0">
                  {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-xs font-bold tracking-widest text-white/70 mb-2 uppercase">CONFIRM PASSWORD</label>
              <div className="relative">
                <input type={showConf?'text':'password'} value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})}
                  placeholder="••••••••••"
                  className="w-full px-4 py-3 pr-12 bg-white rounded-xl text-sm text-gray-800 outline-none font-poppins" />
                <button onClick={()=>setShowConf(!showConf)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 bg-transparent border-none cursor-pointer p-0">
                  {showConf ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div onClick={()=>setAgree(!agree)}
                className="w-5 h-5 rounded flex items-center justify-center cursor-pointer flex-shrink-0 transition-all"
                style={{ background:agree?'#4caf50':'transparent', border:`2px solid ${agree?'#4caf50':'rgba(255,255,255,0.5)'}` }}>
                {agree && <span className="text-white text-xs font-black">✓</span>}
              </div>
              <span className="text-white/80 text-sm">
                I agree to the <span className="text-green-400 cursor-pointer font-semibold">Terms of Service</span> and <span className="text-green-400 cursor-pointer font-semibold">Privacy Policy</span>
              </span>
            </div>

            <button onClick={handleRegister}
              className="w-full py-4 rounded-full text-white font-bold text-base cursor-pointer mb-4 hover:opacity-90 transition-opacity"
              style={{ background:'#1B4332' }}>Create account</button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/20" />
              <span className="text-white/60 text-sm font-semibold">OR</span>
              <div className="flex-1 h-px bg-white/20" />
            </div>

            <button className="w-full py-3 rounded-full text-white text-sm font-semibold cursor-pointer mb-5 flex items-center justify-center gap-2"
              style={{ background:'rgba(255,255,255,0.13)', border:'1px solid rgba(255,255,255,0.26)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>

            <p className="text-center text-sm text-white/65">
              Already have an account?{' '}
              <span onClick={()=>navigate('/login')} className="text-green-400 font-bold cursor-pointer">Log in</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
