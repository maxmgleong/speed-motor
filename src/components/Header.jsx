import { User, Users, Download, Car } from 'lucide-react'

export default function Header({ onAdmin, availableCars, totalCars, onInstall, showInstall }) {
  return (
    <div className="bg-red-600 px-4 pt-6 pb-8 rounded-b-3xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-red-200 text-sm">Selamat Datang!</p>
          <h1 className="text-white text-xl font-bold flex items-center gap-2">
            <Car size={24} /> Speed Motor
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onAdmin} className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-xl text-sm font-medium flex items-center gap-1">
            <Users size={16} /> Admin
          </button>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <User size={20} className="text-red-600" />
          </div>
        </div>
      </div>
      <div className="bg-white/15 rounded-2xl p-3 flex items-center justify-between">
        <div>
          <p className="text-white/80 text-xs">Tersedia</p>
          <p className="text-white text-2xl font-bold">{availableCars}</p>
        </div>
        <div className="text-center">
          <p className="text-white/80 text-xs">Jumlah</p>
          <p className="text-white text-2xl font-bold">{totalCars}</p>
        </div>
        <div className="text-right">
          <p className="text-white/80 text-xs">Brand</p>
          <p className="text-white text-2xl font-bold">5</p>
        </div>
      </div>
      {showInstall && (
        <button onClick={onInstall} className="w-full mt-4 bg-white text-red-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2">
          <Download size={18} /> Install App ni di Phone
        </button>
      )}
    </div>
  )
}
