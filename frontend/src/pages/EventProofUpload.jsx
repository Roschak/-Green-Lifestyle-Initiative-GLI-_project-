import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import CameraCapture from '../components/CameraCapture';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const EventProofUpload = () => {
  const { eventId, registrationId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user, loading } = useAuth();

  const [event, setEvent] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [eventStatus, setEventStatus] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [uploadMode, setUploadMode] = useState(null); // 'camera' | 'gallery' | null
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      setError('Halaman ini hanya untuk user/admin yang login. Guest tidak perlu upload foto.');
      return;
    }

    checkEventStatus();
    const interval = setInterval(checkEventStatus, 1000);
    return () => clearInterval(interval);
  }, [eventId, loading, user]);

  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-4 md:p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-green-100">
          <AlertCircle size={48} className="mx-auto text-orange-500 mb-4" />
          <h1 className="text-2xl font-black text-gray-800 mb-2">Foto hanya untuk user/login</h1>
          <p className="text-sm text-gray-600 mb-6">
            Guest yang daftar dari landing page tidak perlu upload foto. Silakan kembali ke beranda.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const checkEventStatus = async () => {
    try {
      const res = await api.get(`/events/${eventId}/status`);
      setEventStatus(res.data);
      setTimeRemaining(res.data.time_remaining_seconds);

      if (res.data.is_closed) {
        setError('⏰ Event sudah ditutup. Tidak bisa upload bukti lagi.');
      }
    } catch (err) {
      console.error('Error checking event status:', err);
    }
  };

  const handlePhotoCapture = (file) => {
    setPhotoFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setError('');
    setUploadMode('camera');
  };

  const handleGallerySelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setError('');
      setUploadMode('gallery');
    }
  };

  const handleUpload = async () => {
    if (!photoFile) {
      setError('Pilih atau jepret foto terlebih dahulu');
      return;
    }

    if (eventStatus?.is_closed) {
      setError('Event sudah ditutup. Tidak bisa upload.');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('proof', photoFile);
      formData.append('event_id', eventId);
      formData.append('registration_id', registrationId);

      const res = await api.post(`/events/${eventId}/proof/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setSuccess(true);
        setPhotoFile(null);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal upload bukti kehadiran');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const formatTime = (seconds) => {
    if (seconds <= 0) return 'DITUTUP';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-8 pt-4">
          <h1 className="text-3xl md:text-4xl font-black text-green-700 mb-2">📸 Bukti Kehadiran</h1>
          <p className="text-gray-600 text-sm md:text-base">Unggah foto untuk konfirmasi kehadiran Anda di event</p>
        </div>

        {/* TIMER */}
        {eventStatus && (
          <div className="bg-white rounded-2xl p-4 md:p-5 mb-6 shadow-md border border-green-100">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-gray-600 font-semibold text-sm">⏰ Waktu Tersisa</p>
                <p className={`text-2xl md:text-3xl font-black ${eventStatus.is_closed ? 'text-red-600' : 'text-green-600'}`}>
                  {formatTime(timeRemaining || 0)}
                </p>
              </div>
              <div>
                <span className={`inline-block px-4 py-2 rounded-xl font-bold text-sm ${eventStatus.is_closed ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {eventStatus.is_closed ? '🔴 DITUTUP' : '🟢 AKTIF'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 flex items-start gap-3">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4 flex items-start gap-3">
            <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">✅ Berhasil Diupload!</p>
              <p className="text-xs text-green-600 mt-1">Status: <span className="font-black text-green-700">SUDAH TERVERIFIKASI</span></p>
            </div>
          </div>
        )}

        {/* MAIN CONTENT */}
        {!eventStatus?.is_closed ? (
          <div className="space-y-4">
            {/* UPLOAD MODE SELECTION */}
            {!uploadMode && (
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <button
                  onClick={() => setUploadMode('camera')}
                  className="flex flex-col items-center justify-center gap-3 p-6 md:p-8 bg-white rounded-2xl shadow-md border-2 border-transparent hover:border-blue-500 transition active:scale-95"
                >
                  <Camera size={40} className="text-blue-600" />
                  <span className="font-bold text-sm md:text-base text-gray-700 text-center">Ambil Foto</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-3 p-6 md:p-8 bg-white rounded-2xl shadow-md border-2 border-transparent hover:border-purple-500 transition active:scale-95"
                >
                  <Upload size={40} className="text-purple-600" />
                  <span className="font-bold text-sm md:text-base text-gray-700 text-center">Pilih dari File</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleGallerySelect}
                  className="hidden"
                />
              </div>
            )}

            {/* CAMERA MODE */}
            {uploadMode === 'camera' && !photoFile && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
                <CameraCapture
                  onCapture={handlePhotoCapture}
                  disabled={isUploading}
                />
                <button
                  onClick={() => setUploadMode(null)}
                  className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition"
                >
                  ← Kembali ke Menu
                </button>
              </div>
            )}

            {/* GALLERY/FILE MODE */}
            {uploadMode === 'gallery' && !photoFile && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg text-center">
                <div className="py-8">
                  <Upload size={48} className="mx-auto text-purple-400 mb-4" />
                  <p className="text-gray-600 mb-4">Pilih file foto dari perangkat Anda</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition inline-block"
                  >
                    Buka Penjelajah File
                  </button>
                </div>
                <button
                  onClick={() => setUploadMode(null)}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition"
                >
                  ← Kembali ke Menu
                </button>
              </div>
            )}

            {/* PREVIEW & CONFIRM */}
            {photoFile && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
                <div className="mb-6">
                  <div className="text-center mb-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full max-h-96 rounded-xl object-cover border-2 border-green-200"
                    />
                  </div>
                  <p className="text-center text-sm text-gray-600">📷 Pratinjau foto Anda</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUploading ? '⏳ Mengunggah...' : '✅ Konfirmasi Kehadiran'}
                  </button>

                  <button
                    onClick={() => {
                      setPhotoFile(null);
                      setPreviewUrl(null);
                      setUploadMode(null);
                    }}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    🔄 Pilih Ulang
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-3" />
            <h3 className="font-black text-lg text-red-700 mb-2">Event Sudah Ditutup</h3>
            <p className="text-red-600 text-sm mb-4">Maaf, waktu untuk upload bukti kehadiran sudah berakhir.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition"
            >
              Kembali ke Beranda
            </button>
          </div>
        )}

        {/* INFO CARD */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-5 md:p-6 mt-8">
          <h3 className="font-black text-blue-900 mb-3">ℹ️ Petunjuk Penting</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start gap-2">
              <span className="font-black">✓</span>
              <span>Pastikan wajah terlihat jelas di foto</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-black">✓</span>
              <span>Ambil foto di tempat yang cukup cahaya</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-black">✓</span>
              <span>Hanya bisa upload <strong>sekali saja</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-black">✓</span>
              <span>Upload <strong>sebelum event ditutup</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-black">✓</span>
              <span>Status akan berubah menjadi <strong className="text-green-700">SUDAH TERVERIFIKASI</strong> setelah upload</span>
            </li>
          </ul>
        </div>

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate('/')}
          className="w-full mt-8 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
        >
          ← Kembali ke Beranda
        </button>
      </div>
    </div>
  );
};

export default EventProofUpload;
