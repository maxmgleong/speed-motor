import { Wifi, Snowflake, Refrigerator, Bed } from 'lucide-react'

const FAC = { wifi: Wifi, ac: Snowflake, peti_sejuk: Refrigerator }
const FAC_LABEL = { wifi: 'WiFi', ac: 'AC', peti_sejuk: 'Peti Sejuk' }

export default function RoomCard({ room, onBook }) {
  const availableBeds = room.beds.filter(b => !b.occupied)
  const allOccupied = availableBeds.length === 0

  function getFacilityIcon(f) {
    const Icon = FAC[f]
    return Icon ? <Icon size={13} className="text-primary" /> : <span className="text-xs">✨</span>
  }

  function formatFacilityName(f) {
    if (FAC_LABEL[f]) return FAC_LABEL[f]
    return f.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="bg-white rounded-3xl overflow-hidden card-shadow">
      <div className="relative">
        <img src={room.image} alt={room.name} className="w-full h-48 object-cover"
          onError={e => e.target.src = 'https://placehold.co/600x300/e8f5f1/4A9B8C?text=Bilik'} />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${allOccupied ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
            {allOccupied ? '🔴 Penuh' : `🟢 ${availableBeds.length} Katil Tersedia`}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 bg-dark/80 text-white px-3 py-1 rounded-xl text-sm font-bold">
          RM {room.price}/bulan
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-primary text-lg mb-3">{room.name}</h3>
        
        {room.description && (
          <div className="bg-accent rounded-xl p-4 mb-4">
            <p className="text-sm font-semibold text-primary mb-2">📝 Deskripsi:</p>
            <p className="text-sm text-gray-700 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>{room.description}</p>
          </div>
        )}
        
        <div className="mb-4">
          <p className="text-sm font-semibold text-primary mb-2">🛏️ Pilihan Katil:</p>
          <div className="space-y-2">
            {room.beds.map((bed) => (
              <div key={bed.id} className={`flex items-center justify-between p-3 rounded-xl ${bed.occupied ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                <div className="flex items-center gap-2">
                  <Bed size={16} />
                  <span className="font-medium">{bed.name}</span>
                  {bed.occupied && <span className="text-xs">(Penuh)</span>}
                </div>
                <span className="font-bold">RM {bed.price || room.price}/bulan</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-semibold text-primary mb-2">✨ Fasiliti:</p>
          <div className="flex flex-wrap gap-2">
            {room.facilities.map(f => (
              <div key={f} className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg">
                {getFacilityIcon(f)}
                <span className="text-xs text-blue-700 font-medium">{formatFacilityName(f)}</span>
              </div>
            ))}
          </div>
        </div>

        {allOccupied ? (
          <button disabled className="btn-secondary w-full text-center py-3 opacity-50">
            🔴 Tiada Katil Tersedia
          </button>
        ) : (
          <button onClick={onBook} className="btn-primary w-full text-center py-3 text-base">
            📋 Tempah Sekarang
          </button>
        )}
      </div>
    </div>
  )
}
