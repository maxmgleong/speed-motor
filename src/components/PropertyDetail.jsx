import { ArrowLeft, MapPin, Calendar, Gauge, Car, Settings, Fuel, Palette } from 'lucide-react'

export default function PropertyDetail({ property, onBack }) {
  const isAvailable = property.rooms.some(r => r.beds.some(b => !b.occupied))
  const price = property.price || property.rooms[0]?.price || 0

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative">
        <img src={property.image} alt={property.name} className="w-full h-72 object-cover"
          onError={e => e.target.src = 'https://placehold.co/800x500/E74C3C/ffffff?text=Speed+Motor'} />
        <button onClick={onBack} className="absolute top-4 left-4 bg-white/90 w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
          <ArrowLeft size={20} className="text-red-600" />
        </button>
        <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-xl font-bold">
          {property.brand}
        </div>
      </div>
      
      <div className="px-4 -mt-6 relative z-10 pb-8">
        <div className="bg-white rounded-3xl card-shadow p-5 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">{property.name}</h2>
              <p className="text-gray-500 text-sm flex items-center gap-1">
                <MapPin size={14} /> {property.location}
              </p>
            </div>
            <div className={`px-3 py-1.5 rounded-xl text-sm font-bold ${isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {isAvailable ? '🟢 Tersedia' : '🔴 Sold'}
            </div>
          </div>
          
          <div className="bg-red-50 rounded-2xl p-4 mb-4">
            <p className="text-red-600 font-bold text-3xl">RM {price.toLocaleString()}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
              <Calendar size={20} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Tahun</p>
                <p className="font-bold text-gray-800">{property.year}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
              <Gauge size={20} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Mileage</p>
                <p className="font-bold text-gray-800">{property.mileage?.toLocaleString()} km</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
              <Settings size={20} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Gear</p>
                <p className="font-bold text-gray-800">{property.transmission}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
              <Fuel size={20} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Fuel</p>
                <p className="font-bold text-gray-800">{property.fuel}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 mb-4">
            <Palette size={20} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Warna</p>
              <p className="font-bold text-gray-800">{property.color}</p>
            </div>
          </div>
          
          {property.description && (
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm font-semibold text-blue-800 mb-2">📝 Keterangan:</p>
              <p className="text-sm text-gray-700 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>{property.description}</p>
            </div>
          )}
        </div>

        {isAvailable && (
          <a 
            href={`https://wa.me/60143308892?text=Hai%2C%20saya%20berminat%20dengan%20${encodeURIComponent(property.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl text-center text-lg shadow-lg"
          >
            💬 WhatsApp untuk Tempahan
          </a>
        )}
      </div>
    </div>
  )
}
