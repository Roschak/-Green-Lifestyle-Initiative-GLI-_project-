import { useState, useEffect, useRef } from 'react'
import UserSidebar from '../../components/UserSidebar'
import MapLocationPicker from '../../components/MapLocationPicker'
import { Plus, X, Calendar, MapPin, Users, Upload, Eye, CheckCircle, XCircle, Camera } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

const BG = 'linear-gradient(180deg, #004D40 0%, #2E7D32 100%)'
const EVENT_DRAFT_KEY = 'gli_user_event_draft'

const emptyForm = {
  title: '',
  description: '',
  wa_link: '',
  location: '',
  latitude: null,
  longitude: null,
  medal_name: 'Medali Sosialisasi',
  thumbnail_type: 'image',
  thumbnail_text: '',
  thumbnail_color: '#22c55e',
  registration_start: '',
  registration_end: '',
  event_start: '',
  event_end: ''
}

const getImageUrl = (img) => {
  if (!img || img === 'no-image.jpg') return null
  if (String(img).startsWith('http')) return String(img)

  const normalized = String(img).replace(/\\/g, '/')
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  const baseUrl = apiUrl.replace('/api', '')
  const uploadsIndex = normalized.lastIndexOf('/uploads/')

  if (uploadsIndex >= 0) return `${baseUrl}${normalized.slice(uploadsIndex)}`
  if (normalized.startsWith('uploads/')) return `${baseUrl}/${normalized}`

  return `${baseUrl}/${normalized.replace(/^\/+/, '')}`
}

const STATUS_LABEL = {
  roundown: { label: 'Pendaftaran', color: 'bg-yellow-400 text-yellow-900' },
  dilaksanakan: { label: 'Berlangsung', color: 'bg-green-400 text-green-900' },
  berakhir: { label: 'Berakhir', color: 'bg-gray-300 text-gray-700' },
}

const STATUS_MAP = {
  roundown: { label: 'Pendaftaran Dibuka', color: 'bg-yellow-400 text-yellow-900' },
  dilaksanakan: { label: 'Sedang Berlangsung', color: 'bg-green-400 text-green-900' },
  berakhir: { label: 'Telah Berakhir', color: 'bg-gray-300 text-gray-700' },
}

const formatDateTime = (d) => {
  if (!d) return '-'
  return new Date(d).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTimeRemaining = (deadline) => {
  if (!deadline) return null
  const now = new Date()
  const end = new Date(deadline)
  const diff = end - now

  if (diff <= 0) return { text: 'Berakhir', expired: true }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return {
    text: `${hours}h ${minutes}m ${seconds}s`,
    expired: false
  }
}

export default function UserEvent() {
  const { user } = useAuth()
  const [myEvents, setMyEvents] = useState({ roundown: [], dilaksanakan: [], berakhir: [] })
  const [myRegs, setMyRegs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('board')
  const [createModal, setCreateModal] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)
  const [mapModalKey, setMapModalKey] = useState(0)
  const [detailModal, setDetailModal] = useState(null)
  const [regModal, setRegModal] = useState(null)
  const [registrations, setRegistrations] = useState([])
  const [proofModal, setProofModal] = useState(null)
  const [proofFile, setProofFile] = useState(null)
  const [proofPreview, setProofPreview] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [thumbFile, setThumbFile] = useState(null)
  const [thumbPreview, setThumbPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [countdown, setCountdown] = useState({})
  const fileInputRef = useRef(null)
  const proofInputRef = useRef(null)

  useEffect(() => {
    const savedDraft = localStorage.getItem(EVENT_DRAFT_KEY)
    if (savedDraft) {
      try {
        setForm(prev => ({ ...prev, ...JSON.parse(savedDraft) }))
      } catch (err) {
        console.warn('Draft event tidak valid:', err)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(EVENT_DRAFT_KEY, JSON.stringify(form))
  }, [form])

  useEffect(() => {
    fetchAll()
  }, [user?.id])

  useEffect(() => {
    const timer = setInterval(() => {
      const newCountdown = {}
      Object.keys(myEvents).forEach(section => {
        myEvents[section].forEach(event => {
          newCountdown[event.id] = getTimeRemaining(event.registration_end)
        })
      })
      setCountdown(newCountdown)
    }, 1000)

    return () => clearInterval(timer)
  }, [myEvents])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const allRes = await api.get('/events?visibility=active')
      const regRes = user?.id ? await api.get(`/events/my/${user.id}`) : { data: [] }

      const grouped = { roundown: [], dilaksanakan: [], berakhir: [] }
      const allEvents = Array.isArray(allRes.data) ? allRes.data : (allRes.data?.data || [])
      allEvents.forEach(event => {
        const status = event.status || 'roundown'
        if (grouped[status]) grouped[status].push(event)
      })

      setMyEvents(grouped)
      setMyRegs(Array.isArray(regRes.data) ? regRes.data : [])
    } catch (err) {
      console.error('❌ Gagal fetch:', err)
      console.error('❌ Error response:', err.response?.data)
      setMyEvents({ roundown: [], dilaksanakan: [], berakhir: [] })
      setMyRegs([])
    } finally {
      setLoading(false)
    }
  }

  const fetchRegistrations = async (eventId) => {
    try {
      const res = await api.get(`/events/${eventId}/registrations`)
      setRegistrations(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error(err)
    }
  }

  const handleLocationSelect = (loc) => {
    setForm(prev => ({
      ...prev,
      location: loc.address,
      latitude: loc.latitude,
      longitude: loc.longitude
    }))
    setShowMapModal(false)
  }

  const openMapModal = () => {
    setMapModalKey(prev => prev + 1)
    setShowMapModal(true)
  }

  const handleCreate = async () => {
    if (!form.title || !form.registration_start || !form.registration_end || !form.event_start || !form.event_end) {
      return alert('Judul dan semua waktu wajib diisi!')
    }

    setSubmitting(true)
    try {
      const data = new FormData()
      Object.entries(form).forEach(([key, value]) => data.append(key, value))
      if (thumbFile) data.append('thumbnail', thumbFile)

      await api.post('/events/create', data)
      setCreateModal(false)
      setForm(emptyForm)
      setThumbFile(null)
      setThumbPreview(null)
      localStorage.removeItem(EVENT_DRAFT_KEY)
      fetchAll()
      alert('✅ Event berhasil dibuat!')
    } catch (err) {
      console.error('Create error:', err)
      alert(err.response?.data?.message || 'Gagal membuat event')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegisterEvent = async (event) => {
    if (!user?.id) return alert('Silakan login dulu')

    const alreadyJoined = myRegs.some(reg => reg.event_id === event.id)
    if (alreadyJoined) return alert('Kamu sudah terdaftar di event ini')

    try {
      await api.post('/events/register', {
        event_id: event.id,
        user_id: user.id,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        is_gli_member: 1,
      })

      fetchAll()
      alert('✅ Berhasil daftar event!')
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal daftar event')
    }
  }

  const handleUploadProof = async () => {
    if (!proofModal || !proofFile) return alert('Pilih foto dulu!')

    try {
      const data = new FormData()
      data.append('registration_id', proofModal.id)
      data.append('proof', proofFile)
      await api.post('/events/proof', data)
      setProofModal(null)
      setProofFile(null)
      setProofPreview(null)
      fetchAll()
      alert('✅ Bukti foto berhasil diupload!')
    } catch (err) {
      console.error('Upload proof error:', err)
      alert(err.response?.data?.message || 'Gagal upload')
    }
  }

  const handleVerifyProof = async (registrationId, status) => {
    try {
      await api.post('/events/verify', { registration_id: registrationId, status })
      if (regModal?.id) fetchRegistrations(regModal.id)
    } catch (err) {
      alert('Gagal verifikasi')
    }
  }

  const sections = [
    { key: 'roundown', label: 'Roundown / Pendaftaran', color: 'bg-yellow-400' },
    { key: 'dilaksanakan', label: 'Sedang Dilaksanakan', color: 'bg-green-400' },
    { key: 'berakhir', label: 'Berakhir', color: 'bg-gray-400' },
  ]

  const joinedEventIds = new Set(myRegs.map(reg => reg.event_id))

  return (
    <div className="flex min-h-screen" style={{ background: BG }}>
      <UserSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="flex justify-between items-center px-8 py-7 border-b border-white/10">
          <div>
            <h1 className="font-black text-3xl text-white tracking-tighter uppercase italic">Event</h1>
            <p className="text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase mt-1">Buat & Ikuti Event</p>
          </div>
          <button
            onClick={() => setCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-green-400 text-green-900 font-black text-xs uppercase rounded-2xl hover:bg-green-300 transition"
          >
            <Plus size={16} /> Buat Event
          </button>
        </div>

        <div className="px-8 pt-6 flex gap-3">
          {[{ key: 'board', label: 'Temukan Event' }, { key: 'ikuti', label: 'Event Diikuti' }].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition ${activeTab === t.key ? 'bg-white text-green-800' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-8 max-w-6xl mx-auto">
          {loading ? (
            <div className="py-20 text-center text-white font-bold uppercase tracking-widest shimmer-loading inline-block px-8 py-4 rounded-2xl bg-white/5 border border-white/10">Memuat...</div>
          ) : activeTab === 'board' ? (
            sections.map(sec => (
              <div key={sec.key} className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-2 h-6 rounded-full ${sec.color}`} />
                  <h2 className="font-black text-xl text-gray-800 uppercase tracking-tighter">{sec.label}</h2>
                  <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-2 py-1 rounded-md">{(myEvents[sec.key] || []).length} EVENT</span>
                </div>

                {(myEvents[sec.key] || []).length === 0 ? (
                  <div className="py-8 text-center text-gray-300 font-black uppercase text-xs tracking-widest">Tidak ada event</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(myEvents[sec.key] || []).map(event => {
                      const joined = joinedEventIds.has(event.id)
                      const isOwner = event.host_id === user?.id

                      return (
                        <div key={event.id} className="border border-gray-100 rounded-[24px] overflow-hidden hover:shadow-md transition bg-white">
                          <div className="h-32 relative">
                            {event.thumbnail_type === 'image' && event.thumbnail ? (
                              <img src={getImageUrl(event.thumbnail)} className="w-full h-full object-cover" alt={event.title} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center" style={{ background: event.thumbnail_color || '#22c55e' }}>
                                <p className="text-white font-black text-lg text-center px-3">{event.thumbnail_text || event.title}</p>
                              </div>
                            )}
                            <div className="absolute top-2 right-2">
                              <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase ${STATUS_LABEL[event.status]?.color || 'bg-gray-100 text-gray-500'}`}>
                                {STATUS_LABEL[event.status]?.label || 'Event'}
                              </span>
                            </div>
                          </div>

                          <div className="p-4">
                            <h3 className="font-black text-gray-800 text-sm truncate mb-1">{event.title}</h3>
                            <div className="flex items-center gap-2 text-gray-400 text-[10px] mb-3">
                              <Users size={10} /> {event.total_registered || 0} terdaftar
                            </div>

                            {event.status === 'roundown' && countdown[event.id] && (
                              <div className={`text-[10px] font-black mb-3 px-2 py-1 rounded-lg text-center ${countdown[event.id].expired ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {countdown[event.id].expired ? '⏱️ Pendaftaran Ditutup' : `⏱️ ${countdown[event.id].text}`}
                              </div>
                            )}

                            <div className="flex gap-2">
                              <button
                                onClick={() => setDetailModal(event)}
                                className="flex-1 py-2 bg-gray-50 text-gray-600 text-[10px] font-black rounded-xl hover:bg-gray-100 transition flex items-center justify-center gap-1"
                              >
                                <Eye size={11} /> Detail
                              </button>

                              {!isOwner && !joined && event.status === 'roundown' ? (
                                <button
                                  onClick={() => handleRegisterEvent(event)}
                                  className="flex-1 py-2 bg-green-400 text-green-900 text-[10px] font-black rounded-xl hover:bg-green-300 transition"
                                >
                                  Daftar
                                </button>
                              ) : (
                                <button disabled className="flex-1 py-2 bg-blue-50 text-blue-600 text-[10px] font-black rounded-xl cursor-default">
                                  {isOwner ? 'Milikmu' : joined ? 'Terdaftar' : 'Tutup'}
                                </button>
                              )}

                              {isOwner && (
                                <button
                                  onClick={() => { setRegModal(event); fetchRegistrations(event.id) }}
                                  className="flex-1 py-2 bg-green-50 text-green-700 text-[10px] font-black rounded-xl hover:bg-green-100 transition flex items-center justify-center gap-1"
                                >
                                  <Users size={11} /> Peserta
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="space-y-4">
              {!myRegs.length ? (
                <div className="py-20 text-center bg-white/5 rounded-[32px] border border-dashed border-white/20">
                  <p className="text-white/30 font-black uppercase tracking-widest text-xs">Belum mengikuti event</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myRegs.map((reg, idx) => (
                    <div key={reg.id || idx} className="border border-white/10 rounded-[24px] overflow-hidden bg-white shadow-lg">
                      <div className="h-32 relative">
                        {reg.thumbnail_type === 'image' && reg.thumbnail ? (
                          <img src={getImageUrl(reg.thumbnail)} className="w-full h-full object-cover" alt={reg.title} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ background: reg.thumbnail_color || '#22c55e' }}>
                            <p className="text-white font-black text-lg text-center px-3">{reg.thumbnail_text || reg.title || 'Event'}</p>
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase ${STATUS_MAP[reg.event_status || reg.status]?.color || 'bg-gray-100 text-gray-500'}`}>
                            {STATUS_MAP[reg.event_status || reg.status]?.label || 'Event'}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[9px] font-black px-2 py-1 rounded-full uppercase bg-green-100 text-green-700">Terdaftar</span>
                        </div>
                        <h3 className="font-black text-gray-800 text-sm leading-tight mb-1 truncate">{reg.title || 'Event'}</h3>
                        <p className="text-gray-400 text-[10px] mb-3">{reg.location || 'Online'}</p>
                        <button
                          onClick={() => setDetailModal(reg)}
                          className="w-full py-2 bg-gray-50 text-gray-600 text-[10px] font-black rounded-xl hover:bg-gray-100 transition flex items-center justify-center gap-1"
                        >
                          <Eye size={11} /> Detail
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {detailModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setDetailModal(null)}>
          <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="relative h-52">
              {detailModal.thumbnail_type === 'image' && detailModal.thumbnail ? (
                <img src={getImageUrl(detailModal.thumbnail)} className="w-full h-full object-cover" alt={detailModal.title} />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: detailModal.thumbnail_color || '#22c55e' }}>
                  <p className="text-white font-black text-lg text-center px-3">{detailModal.thumbnail_text || detailModal.title}</p>
                </div>
              )}
              <button onClick={() => setDetailModal(null)} className="absolute top-4 right-4 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition">
                <X size={14} />
              </button>
            </div>

            <div className="p-7">
              <h2 className="font-black text-2xl text-gray-800 mb-2">{detailModal.title}</h2>
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">{detailModal.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  ['Lokasi', detailModal.location || 'Online'],
                  ['Status', STATUS_MAP[detailModal.event_status || detailModal.status]?.label || 'Event'],
                  ['Pendaftar', `${detailModal.total_registered || 0} orang`],
                  ['Medali', detailModal.medal_name || 'Medali Sosialisasi'],
                ].map(([label, value]) => (
                  <div key={label} className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">{label}</p>
                    <p className="text-sm font-bold text-gray-700">{value}</p>
                  </div>
                ))}
              </div>

              {detailModal.wa_link && (
                <a
                  href={detailModal.wa_link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 text-white font-black text-sm rounded-2xl hover:bg-green-600 transition mb-3"
                >
                  <Upload size={16} /> Bergabung ke Grup WA
                </a>
              )}

              <button onClick={() => setDetailModal(null)} className="w-full py-3 bg-gray-100 text-gray-500 font-black text-sm rounded-2xl hover:bg-gray-200 transition">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {createModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setCreateModal(false)}>
          <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white rounded-t-[40px] px-8 pt-8 pb-4 border-b border-gray-50 z-10">
              <div className="flex justify-between items-center">
                <h2 className="font-black text-2xl text-gray-800 uppercase italic">Buat Event</h2>
                <button onClick={() => setCreateModal(false)} className="text-gray-300 hover:text-gray-600"><X size={22} /></button>
              </div>
            </div>

            <div className="px-8 py-6 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Judul Event *</label>
                <input className="w-full bg-gray-50 rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:ring-2 ring-green-400" placeholder="Nama event kamu" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Deskripsi</label>
                <textarea className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 ring-green-400 min-h-[100px] resize-none" placeholder="Ceritakan tentang event ini..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Thumbnail</label>
                <div className="flex gap-3 mb-3">
                  {['image', 'text'].map(t => (
                    <button key={t} type="button" onClick={() => setForm({ ...form, thumbnail_type: t })} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition ${form.thumbnail_type === t ? 'bg-green-400 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {t === 'image' ? '🖼️ Gambar' : '✏️ Teks'}
                    </button>
                  ))}
                </div>
                {form.thumbnail_type === 'image' ? (
                  <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-green-400 transition">
                    <input
                      type="file"
                      hidden
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={e => {
                        const f = e.target.files[0]
                        if (f) {
                          setThumbFile(f)
                          setThumbPreview(URL.createObjectURL(f))
                        }
                      }}
                    />
                    {thumbPreview ? (
                      <img src={thumbPreview} className="w-full h-32 object-cover rounded-xl" alt="thumbnail preview" />
                    ) : (
                      <div className="text-gray-300">
                        <Upload size={28} className="mx-auto mb-2" />
                        <p className="text-xs font-bold">Klik upload gambar</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input className="w-full bg-gray-50 rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:ring-2 ring-green-400" placeholder="Teks thumbnail" value={form.thumbnail_text} onChange={e => setForm({ ...form, thumbnail_text: e.target.value })} />
                    <div className="flex items-center gap-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase">Warna:</label>
                      <input type="color" value={form.thumbnail_color} onChange={e => setForm({ ...form, thumbnail_color: e.target.value })} className="w-10 h-10 rounded-xl cursor-pointer" />
                      <div className="flex-1 rounded-xl py-3 flex items-center justify-center font-black text-white text-sm" style={{ background: form.thumbnail_color }}>
                        {form.thumbnail_text || form.title || 'Preview'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">📍 Lokasi</label>
                <button type="button" onClick={openMapModal}
                  className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 ring-green-400 text-left flex items-center gap-3 hover:bg-gray-100 transition-all">
                  <MapPin size={18} className="text-green-600 flex-shrink-0" />
                  <span className="font-bold text-gray-700">{form.location || 'Pilih lokasi dari peta...'}</span>
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Link Grup WA</label>
                <input className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 ring-green-400" placeholder="https://chat.whatsapp.com/..." value={form.wa_link} onChange={e => setForm({ ...form, wa_link: e.target.value })} />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Nama Medali (untuk member GLI)</label>
                <input className="w-full bg-gray-50 rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:ring-2 ring-green-400" value={form.medal_name} onChange={e => setForm({ ...form, medal_name: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  ['registration_start', 'Mulai Pendaftaran *'],
                  ['registration_end', 'Tutup Pendaftaran *'],
                  ['event_start', 'Mulai Pelaksanaan *'],
                  ['event_end', 'Selesai Pelaksanaan *']
                ].map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">{label}</label>
                    <input type="datetime-local" className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 ring-green-400" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                  </div>
                ))}
              </div>
            </div>

            <div className="px-8 pb-8 flex gap-3">
              <button onClick={handleCreate} disabled={submitting} className="flex-1 py-4 bg-green-500 text-white font-black rounded-2xl hover:bg-green-600 transition disabled:opacity-50 uppercase text-sm">
                {submitting ? 'Membuat...' : '✅ Buat Event'}
              </button>
              <button onClick={() => setCreateModal(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 font-black rounded-2xl uppercase text-sm">Batal</button>
            </div>
          </div>
        </div>
      )}

      {regModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setRegModal(null)}>
          <div className="bg-white rounded-[40px] w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-8 pt-8 pb-4 border-b border-gray-50 flex justify-between">
              <div>
                <h2 className="font-black text-xl text-gray-800">Peserta</h2>
                <p className="text-gray-400 text-xs font-bold">{regModal.title} · {registrations.length} peserta</p>
              </div>
              <button onClick={() => setRegModal(null)}><X size={20} className="text-gray-300" /></button>
            </div>
            <div className="overflow-y-auto flex-1">
              <table className="w-full">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-gray-50">
                    {['Nama', 'Email', 'Status GLI', 'Bukti', 'Aksi'].map(h => (
                      <th key={h} className="text-left text-[9px] font-black text-gray-300 uppercase tracking-widest py-4 px-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {registrations.map(reg => (
                    <tr key={reg.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4 text-sm font-bold text-gray-700">{reg.name}</td>
                      <td className="py-3 px-4 text-xs text-gray-400">{reg.email}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase ${reg.is_gli_member ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                          {reg.is_gli_member ? '✅ Member' : '👤 Guest'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {reg.proof_img ? (
                          <a href={getImageUrl(reg.proof_img)} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl overflow-hidden block border">
                            <img src={getImageUrl(reg.proof_img)} className="w-full h-full object-cover" alt="proof" />
                          </a>
                        ) : <span className="text-gray-300 text-[10px]">-</span>}
                      </td>
                      <td className="py-3 px-4">
                        {reg.proof_img && reg.proof_status === 'pending' ? (
                          <div className="flex gap-1">
                            <button onClick={() => handleVerifyProof(reg.id, 'approved')} className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"><CheckCircle size={14} /></button>
                            <button onClick={() => handleVerifyProof(reg.id, 'rejected')} className="p-1.5 bg-red-100 text-red-500 rounded-lg hover:bg-red-200"><XCircle size={14} /></button>
                          </div>
                        ) : reg.proof_status === 'approved' ? (
                          <span className="text-[9px] font-black text-green-500">✅ OK</span>
                        ) : reg.proof_status === 'rejected' ? (
                          <span className="text-[9px] font-black text-red-400">❌ Tolak</span>
                        ) : <span className="text-[9px] text-gray-300">Belum</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {registrations.length === 0 && <div className="py-10 text-center text-gray-300 font-black uppercase text-xs">Belum ada peserta</div>}
            </div>
          </div>
        </div>
      )}

      {proofModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setProofModal(null)}>
          <div className="bg-white rounded-[40px] w-full max-w-sm shadow-2xl p-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-xl text-gray-800">Upload Bukti</h2>
              <button onClick={() => setProofModal(null)}><X size={20} className="text-gray-300" /></button>
            </div>
            <p className="text-gray-400 text-xs mb-5 font-bold">{proofModal.title}</p>
            <div onClick={() => proofInputRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-green-400 transition mb-5">
              <input type="file" hidden ref={proofInputRef} accept="image/*" onChange={e => {
                const f = e.target.files[0]
                if (f) {
                  setProofFile(f)
                  setProofPreview(URL.createObjectURL(f))
                }
              }} />
              {proofPreview ? (
                <img src={proofPreview} className="w-full h-40 object-cover rounded-xl" alt="proof preview" />
              ) : (
                <div className="text-gray-300"><Camera size={32} className="mx-auto mb-2" /><p className="text-xs font-bold">Klik upload foto bukti</p></div>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={handleUploadProof} className="flex-1 py-3 bg-green-500 text-white font-black rounded-2xl hover:bg-green-600 transition">Upload</button>
              <button onClick={() => setProofModal(null)} className="flex-1 py-3 bg-gray-100 text-gray-500 font-black rounded-2xl">Batal</button>
            </div>
          </div>
        </div>
      )}

      {showMapModal && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowMapModal(false)}>
          <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white rounded-t-[40px] px-8 pt-8 pb-4 border-b border-gray-50 z-10 flex justify-between items-center">
              <h2 className="font-black text-2xl text-gray-800 uppercase italic">Pilih Lokasi Event</h2>
              <button onClick={() => setShowMapModal(false)} className="text-gray-300 hover:text-gray-600"><X size={22} /></button>
            </div>
            <div className="px-8 py-6">
              <MapLocationPicker
                key={mapModalKey}
                onLocationSelect={handleLocationSelect}
                initialLocation={form.latitude && form.longitude ? { latitude: form.latitude, longitude: form.longitude, address: form.location } : null}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
