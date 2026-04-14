import { MapPin, Car, Gauge, Calendar } from 'lucide-react'

export default function PropertyCard({ property, onClick }) {
  const isAvailable = property.rooms.some(r => r.beds.some(b => !b.occupied))
  const price = property.price || property.rooms[0]?.price || 0

  return (
    <div onClick={onClick} className="bg-white rounded-3xl overflow-hidden card-shadow cursor-pointer active:scale-[0.98] transition-transform">
      <div className="relative">
        <img src={property.image} alt={property.name} className="w-full h-48 object-cover"
          onError={e => e.target.src = 'https://placehold.co/600x400/E74C3C/ffffff?text=Speed+Motor'} />
        <div className="absolute top-3 right-3 bg-dark/80 text-white px-3 py-1 rounded-xl text-sm font-bold">
          {isAvailable ? '🟢 Tersedia' : '🔴 Sold'}
        </div>
        <div className="absolute bottom-3 left-3 bg-red-600 text-white px-3 py-1 rounded-xl text-sm font-bold">
          {property.brand}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-base mb-1">{property.name}</h3>
        <div className="flex items-center gap-1 text-muted text-xs mb-2">
          <MapPin size={12} /> {property.location}
        </div>
        
        <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
          <span className="flex items-center gap-1"><Calendar size={12} /> {property.year}</span>
          <span className="flex items-center gap-1"><Gauge size={12} /> {property.mileage?.toLocaleString()} km</span>
          <span className="flex items-center gap-1"><Car size={12} /> {property.transmission}</span>
        </div>
        
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{property.description}</p>
        
        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-2">
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs">{property.fuel}</span>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs">{property.color}</span>
          </div>
          <div className="text-right">
            <p className="text-red-600 font-bold text-lg">RM {price.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
