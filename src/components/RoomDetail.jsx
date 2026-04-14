import { ArrowLeft, Wifi, Snowflake, Refrigerator, Car, Bed } from 'lucide-react'
import { FACILITIES } from '../data/properties'

const ICONS = { Wifi, Snowflake, Refrigerator, Car }

export default function RoomDetail({ room, property, onBack, onBook }) {
  const kosong = room.beds.filter(b => !b.occupied).length
  const allOccupied = kosong === 0

  return (
    <div className="min-h-screen bg-accent">
      <div className="relative">
        <img src={room.image || property.image} alt={room.name} className="w-full h-64 object-cover"
          onError={e => e.target.src = 'https://placehold.co/600x400/e8f5f1/4A9B8C?text=Room'} />
        <button onClick={onBack} className="absolute top-4 left-4 bg-white/90 w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
          <ArrowLeft size={20} className="text-primary" />
        </button>
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${allOccupied ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
            {allOccupied ? 'Telah Ditempah Penuh' : `${kosong} Katil Kosong`}
          </span>
        </div>
      </div>
      <div className="px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-3xl card-shadow p-5 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-primary">{room.name}</h2>
              <p className="text-muted text-sm mt-1">{property.name} - {property.location}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">RM {room.price}</p>
              <p className="text-muted text-xs">sebulan</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">{room.description}</p>
          <div className="border-t pt-4 mb-4">
            <p className="text-xs text-muted mb-2 font-semibold uppercase">Fasiliti</p>
            <div className="flex flex-wrap gap-2">
              {room.facilities.map(f => {
                const Icon = ICONS[f]
                const label = FACILITIES[f]?.label || f
                return Icon ? (
                  <div key={f} className="flex items-center gap-1.5 bg-accent px-3 py-2 rounded-xl">
                    <Icon size={16} className="text-primary" />
                    <span className="text-sm text-primary font-medium">{label}</span>
                  </div>
                ) : null
              })}
            </div>
          </div>
          <div className="border-t pt-4">
            <p className="text-xs text-muted mb-2 font-semibold uppercase">Pilihan Katil</p>
            <div className="space-y-2">
              {room.beds.map(bed => (
                <div key={bed.id} className={`flex items-center gap-2 p-2 rounded-xl ${bed.occupied ? 'bg-red-50 opacity-60' : 'bg-green-50'}`}>
                  <Bed size={16} className={bed.occupied ? 'text-red-400' : 'text-green-600'} />
                  <span className={`text-sm font-medium ${bed.occupied ? 'text-red-500 line-through' : 'text-green-700'}`}>{bed.name}</span>
                  <span className={`text-xs ml-auto ${bed.occupied ? 'text-red-400' : 'text-green-600'}`}>{bed.occupied ? 'Occupied' : 'Tersedia'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {!allOccupied && (
          <button onClick={onBook} className="btn-primary w-full text-center mb-6 flex items-center justify-center gap-2">
            📋 Tempah Sekarang & Isi Maklumat
          </button>
        )}
        {allOccupied && (
          <div className="bg-red-100 border border-red-200 rounded-2xl p-4 text-center text-red-700 mb-6">
            <p className="font-semibold">Maaf, bilik ini telah ditempah penuh.</p>
            <p className="text-sm mt-1">Sila pilih bilik lain di property yang sama.</p>
          </div>
        )}
      </div>
    </div>
  )
}
