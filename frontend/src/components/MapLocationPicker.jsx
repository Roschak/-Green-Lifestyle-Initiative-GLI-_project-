import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from 'react-leaflet'
import L from 'leaflet'
import { MapPin, Loader2, Navigation } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
})

// Map click handler component - with reverse geocoding
function MapClickHandler({ onLocationSelect }) {
  useMapEvent('click', async (e) => {
    const { lat, lng } = e.latlng
    
    // Reverse geocoding - get location name from coordinates
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
      const data = await response.json()
      const locationName = data.address?.road || data.address?.village || data.address?.city || data.address?.county || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      
      onLocationSelect({ 
        latitude: lat, 
        longitude: lng, 
        address: locationName 
      })
    } catch (err) {
      console.error('Reverse geocoding error:', err)
      onLocationSelect({ 
        latitude: lat, 
        longitude: lng, 
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` 
      })
    }
  })
  return null
}

// Center map on current position component
function CenterMap({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position && Array.isArray(position) && position.length === 2) {
      map.flyTo(position, 15, { duration: 1 })
    } else if (position && position.latitude !== undefined && position.longitude !== undefined) {
      map.flyTo([position.latitude, position.longitude], 15, { duration: 1 })
    }
  }, [position, map])
  return null
}

export default function MapLocationPicker({ onLocationSelect, initialLocation = null }) {
  const [position, setPosition] = useState(initialLocation || [-6.2088, 106.8456]) // Jakarta default
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState(initialLocation?.address || 'Klik di peta untuk memilih lokasi')
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)

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
    
    setPosition([lat, lng])
    setAddress(name)
    setSearchQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    
    onLocationSelect({
      latitude: lat,
      longitude: lng,
      address: name
    })
  }

  // Get user's current location
  const getCurrentLocation = () => {
    setLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          setPosition([latitude, longitude])
          setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
          setLoading(false)
        },
        (err) => {
          console.error('Geolocation error:', err)
          alert('Tidak bisa akses lokasi. Silakan klik di peta untuk memilih lokasi.')
          setLoading(false)
        }
      )
    }
  }

  const handleLocationSelect = (loc) => {
    setPosition([loc.latitude, loc.longitude])
    setAddress(loc.address)
    // Extract location name for search field
    const locationName = loc.address.split(',')[0] || loc.address
    setSearchQuery(locationName)
    setSuggestions([])
    setShowSuggestions(false)
    
    onLocationSelect({
      latitude: loc.latitude,
      longitude: loc.longitude,
      address: loc.address
    })
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
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {position && (
            <>
              <Marker position={position}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">Lokasi Terpilih</p>
                    <p>{address}</p>
                  </div>
                </Popup>
              </Marker>
              <CenterMap position={position} />
            </>
          )}
          <MapClickHandler onLocationSelect={handleLocationSelect} />
        </MapContainer>
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
