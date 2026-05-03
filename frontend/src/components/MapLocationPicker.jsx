import { useState } from 'react'
import { Map, Marker } from 'pigeon-maps'
import { MapPin, Loader2, Navigation } from 'lucide-react'

const parseInitialPosition = (initialLocation) => {
  if (
    initialLocation &&
    typeof initialLocation.latitude === 'number' &&
    typeof initialLocation.longitude === 'number'
  ) {
    return [initialLocation.latitude, initialLocation.longitude]
  }
  return [-6.2088, 106.8456]
}

export default function MapLocationPicker({ onLocationSelect, initialLocation = null }) {
  const [position, setPosition] = useState(parseInitialPosition(initialLocation))
  const [zoom, setZoom] = useState(13)
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState(initialLocation?.address || 'Klik di peta untuk memilih lokasi')
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)

  const applyLocation = (lat, lng, locationName) => {
    setPosition([lat, lng])
    setAddress(locationName)
    const locationLabel = locationName.split(',')[0] || locationName
    setSearchQuery(locationLabel)
    setSuggestions([])
    setShowSuggestions(false)

    onLocationSelect({
      latitude: lat,
      longitude: lng,
      address: locationName,
    })
  }

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
      const data = await response.json()
      const locationName =
        data.display_name ||
        data.address?.road ||
        data.address?.village ||
        data.address?.city ||
        data.address?.county ||
        `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      applyLocation(lat, lng, locationName)
    } catch (err) {
      console.error('Reverse geocoding error:', err)
      applyLocation(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`)
    }
  }

  // Search location using Nominatim API (OpenStreetMap)
  const searchLocation = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([])
      return
    }

    setSearchLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      )
      const data = await response.json()
      setSuggestions(data)
      setShowSuggestions(true)
    } catch (err) {
      console.error('Search error:', err)
      setSuggestions([])
    } finally {
      setSearchLoading(false)
    }
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (query.trim()) {
      searchLocation(query)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  // Select location from search result
  const selectFromSearch = (result) => {
    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)
    const name = result.display_name

    setZoom(15)
    applyLocation(lat, lng, name)
  }

  // Get user's current location
  const getCurrentLocation = () => {
    setLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          setZoom(15)
          reverseGeocode(latitude, longitude)
          setLoading(false)
        },
        (err) => {
          console.error('Geolocation error:', err)
          alert('Tidak bisa akses lokasi. Silakan klik di peta untuk memilih lokasi.')
          setLoading(false)
        }
      )
    } else {
      alert('Browser tidak mendukung geolocation')
      setLoading(false)
    }
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">📍 Pilih Lokasi dari Peta</label>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={loading}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
          Lokasi Saya
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Cari lokasi (cth: Jakarta, Bandung, Malang...)"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-blue-500 outline-none"
        />
        {searchLoading && <Loader2 size={16} className="animate-spin absolute right-3 top-2.5 text-gray-400" />}
        
        {/* Search Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
            {suggestions.map((result, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectFromSearch(result)}
                className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition"
              >
                <p className="text-sm font-medium text-gray-700 truncate">{result.display_name.split(',')[0]}</p>
                <p className="text-xs text-gray-400 truncate">{result.display_name}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-2 border-gray-300 rounded-lg overflow-hidden h-80 bg-gray-100">
        <Map
          height={320}
          center={position}
          zoom={zoom}
          minZoom={3}
          maxZoom={18}
          onBoundsChanged={({ center, zoom: nextZoom }) => {
            setPosition(center)
            setZoom(nextZoom)
          }}
          onClick={({ latLng }) => {
            const [lat, lng] = latLng
            reverseGeocode(lat, lng)
          }}
        >
          <Marker width={44} anchor={position} />
        </Map>
      </div>

      <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
        <MapPin size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs">
          <p className="font-semibold text-blue-900">Koordinat: {address}</p>
          <p className="text-blue-700 mt-1">💡 Cari lokasi, klik di peta, atau gunakan "Lokasi Saya" untuk GPS</p>
        </div>
      </div>
    </div>
  )
}
