// src/pages/LoginPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft, Mail, X, CheckCircle2 } from 'lucide-react'
import { auth, googleProvider, db } from '../config/firebase_config'
import { sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetMessage, setResetMessage] = useState('')
  const [resetError, setResetError] = useState('')

  // ✅ Login email/password — SAVE JWT TOKEN
    const handleLogin = async () => {
    if (!email || !password) { setError('Email dan password wajib diisi!'); return }
    setError(''); setLoading(true)
    try {
      // STEP 1: Login ke Backend (dapatkan JWT token)
      console.log('1️⃣ Logging in to backend...')
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      
      const backendRes = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })

      const backendData = await backendRes.json()

      if (!backendRes.ok) {
        setError(backendData.message || 'Login gagal')
        setLoading(false)
        return
      }

      // STEP 2: Simpan JWT token ke localStorage
      if (backendData.token) {
        localStorage.setItem('token', backendData.token)
        console.log('✅ JWT Token saved')
      }

      // STEP 3: Login ke Firebase juga
      console.log('2️⃣ Logging in to Firebase...')
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = cred.user
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      const userData = userDoc.exists() ? userDoc.data() : { role: 'user' }

      if (userDoc.exists()) {
        await updateDoc(doc(db, 'users', firebaseUser.uid), { status: 'online' })
      }

      // STEP 4: Redirect
      console.log('3️⃣ Redirecting...')
      if (userData.role === 'admin') navigate('/admin/dashboard')
      else navigate('/user/dashboard')

    } catch (err) {
      console.error('❌ Login error:', err)
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') setError('Email atau password salah!')
      else if (err.code === 'auth/user-not-found')   setError('Email tidak terdaftar!')
      else if (err.code === 'auth/too-many-requests') setError('Terlalu banyak percobaan. Coba lagi nanti.')
      else setError(err.message || 'Login gagal!')
    } finally { setLoading(false) }
  }
  
  // ✅ Login Google — SAVE TOKEN
  const handleGoogleLogin = async () => {
    setError(''); setLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const firebaseUser = result.user
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      let role = 'user'

      if (!userDoc.exists()) {
        // User baru dari Google, backend akan create di Firestore
      } else {
        role = userDoc.data().role || 'user'
        await updateDoc(doc(db, 'users', firebaseUser.uid), { status: 'online' })
      }

      // 2. Get Firebase ID Token dan simpan
      const idToken = await firebaseUser.getIdToken()
      localStorage.setItem('token', idToken)
      console.log('✅ Firebase ID Token saved to localStorage')

      // ✅ Redirect
      if (role === 'admin') navigate('/admin/dashboard')
      else navigate('/user/dashboard')

    } catch (err) {
      console.error('❌ Google login error:', err)
      if (err.code === 'auth/popup-closed-by-user') setError('Popup login ditutup.')
      else setError(err.message || 'Gagal login dengan Google!')
    } finally { setLoading(false) }
  }

  const openResetModal = () => {
    setResetEmail(email)
    setResetError('')
    setResetMessage('')
    setShowResetModal(true)
  }

  const handleResetPassword = async () => {
    const targetEmail = resetEmail.trim()
    if (!targetEmail) {
      setResetError('Email wajib diisi.')
      return
    }

    setResetLoading(true)
    setResetError('')
    setResetMessage('')

    try {
      console.log('🔄 Mengirim request reset password ke backend...')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      
      const response = await fetch(`${apiUrl}/auth/send-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail })
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Terlalu banyak permintaan. Coba lagi dalam 1 jam.')
        }
        throw new Error(data.message || 'Gagal mengirim reset email')
      }

      console.log('✅ Backend response:', data)

      // If link is returned (SendGrid not configured or fallback), show it
      if (data.link) {
        setResetMessage(
          <>
            <div className="mb-3 text-green-700 font-semibold">✅ Reset link telah dibuat!</div>
            <div className="mb-3 text-sm text-green-600">Klik tombol di bawah untuk membuka link reset password:</div>
            <button
              onClick={() => window.open(data.link, '_blank')}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 mb-3"
            >
              Buka Link Reset Password
            </button>
            <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded break-all border border-gray-200">
              Atau copy-paste link ini: {data.link}
            </div>
          </>
        )
      } else {
        // Email was sent via SendGrid
        setResetMessage('✅ Link reset password telah dikirim ke email Anda. Cek inbox (atau folder spam/promotions).')
      }
    } catch (err) {
      console.error('❌ Reset password error:', err.message)
      setResetError(`❌ Gagal: ${err.message}`)
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <>
    <div className="flex h-screen overflow-hidden font-poppins">
      <div className="w-5/12 overflow-hidden">
        <img src="/images/pohon.jpg" alt="" className="w-full h-full object-cover"/>
      </div>
      <div className="flex-1 relative overflow-hidden">
        <img src="/images/pohon.jpg" alt="" className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"/>
        <div className="absolute inset-0 bg-black/20"/>
        <div className="relative z-10 flex items-center justify-center h-full p-10">
          <button onClick={() => navigate(-1)}
            className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all z-20">
            <ArrowLeft size={18}/><span className="text-sm font-medium">Back</span>
          </button>
          <div className="w-full max-w-md">
            <h1 className="font-black text-4xl text-white text-center mb-2">Welcome Back</h1>
            <p className="text-white/75 text-sm text-center mb-7 leading-relaxed">Please enter your credentials to access<br/>your account.</p>
            {error && <div className="bg-red-500/15 border border-red-400/40 rounded-lg p-3 mb-4 text-red-300 text-sm text-center">{error}</div>}
            <div className="mb-4">
              <label className="block text-xs font-bold tracking-widest text-white/70 mb-2 uppercase">EMAIL</label>
              <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@gmail.com"
                className="w-full px-4 py-3 bg-white rounded-xl text-sm text-gray-800 outline-none font-poppins"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}/>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-bold tracking-widest text-white/70 mb-2 uppercase">PASSWORD</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••" className="w-full px-4 py-3 pr-12 bg-white rounded-xl text-sm text-gray-800 outline-none font-poppins"
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}/>
                <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 bg-transparent border-none cursor-pointer p-0">
                  {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center mb-5">
              <button type="button" onClick={openResetModal} className="text-green-400 text-sm font-semibold cursor-pointer hover:text-green-300 transition">
                Forgot Password?
              </button>
              <div className="flex items-center gap-2">
                <span className="text-white/75 text-sm">Remember sign in details</span>
                <div onClick={() => setRemember(!remember)} className="w-11 h-6 rounded-full cursor-pointer relative transition-colors"
                  style={{ background: remember ? '#4caf50' : 'rgba(255,255,255,0.3)' }}>
                  <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all shadow" style={{ left: remember ? '22px' : '2px' }}/>
                </div>
              </div>
            </div>
            <button onClick={handleLogin} disabled={loading}
              className="w-full py-4 rounded-full text-white font-bold text-base cursor-pointer mb-4 transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: '#1B4332' }}>
              {loading ? 'Loading...' : 'Log in'}
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/20"/><span className="text-white/60 text-sm font-semibold">OR</span><div className="flex-1 h-px bg-white/20"/>
            </div>
            <button onClick={handleGoogleLogin} disabled={loading}
              className="w-full py-3 rounded-full text-white text-sm font-semibold cursor-pointer mb-5 flex items-center justify-center gap-2 hover:bg-white/20 transition-all disabled:opacity-50"
              style={{ background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.26)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {loading ? 'Loading...' : 'Continue with Google'}
            </button>
            <p className="text-center text-sm text-white/65">
              Don't have an account?{' '}
              <span onClick={() => navigate('/register')} className="text-green-400 font-bold cursor-pointer">Register</span>
            </p>
          </div>
        </div>
      </div>
    </div>

      {showResetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[32px] bg-white shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-800">Reset Password</h2>
                <p className="text-xs text-gray-400 font-semibold">Link akan dikirim melalui email Firebase Auth.</p>
              </div>
              <button type="button" onClick={() => setShowResetModal(false)} className="text-gray-300 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold tracking-widest text-gray-400 mb-2 uppercase">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    placeholder="email@gmail.com"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-green-400"
                  />
                </div>
              </div>

              {resetError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">
                  {resetError}
                </div>
              )}

              {resetMessage && (
                <div className="rounded-2xl border border-green-200 bg-green-50 text-green-700 text-sm px-4 py-3 flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{resetMessage}</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-600 font-bold text-sm"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={resetLoading}
                  className="flex-1 py-3 rounded-2xl bg-green-600 text-white font-bold text-sm disabled:opacity-60"
                >
                  {resetLoading ? 'Mengirim...' : 'Kirim Link Reset'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}