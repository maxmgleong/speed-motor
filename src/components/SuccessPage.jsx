import { CheckCircle, Home } from 'lucide-react'

export default function SuccessPage({ room, property, onHome }) {
  return (
    <div className="min-h-screen bg-accent flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl card-shadow p-8 text-center max-w-sm w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-primary mb-2">Terima Kasih!</h2>
        <p className="text-muted text-sm mb-6">Maklumat anda telah diterima. Tuan Rumah akan hubungi anda segera melalui WhatsApp.</p>
        <div className="bg-accent rounded-2xl p-4 mb-6 text-left">
          <p className="text-xs text-muted mb-1">Bilik Dipilih</p>
          <p className="font-bold text-primary">{room?.name}</p>
          <p className="text-sm text-muted">{property?.name}</p>
          <p className="text-sm text-primary font-semibold mt-1">RM {room?.price}/bulan</p>
        </div>
        <button onClick={onHome} className="btn-primary w-full text-center flex items-center justify-center gap-2">
          <Home size={18} /> Kembali ke Laman Utama
        </button>
      </div>
    </div>
  )
}
