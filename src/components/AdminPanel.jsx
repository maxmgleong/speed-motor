import { useState, useRef } from 'react'
import { ArrowLeft, Edit2, Trash2, Plus, Save, X, Upload, Car } from 'lucide-react'

function ImageUpload({ value, onChange, label }) {
  const [preview, setPreview] = useState(value || null)
  const fileRef = useRef()

  function handleFile(e) {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => { setPreview(reader.result); onChange(reader.result) }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <div onClick={() => fileRef.current.click()} className="border-2 border-dashed border-gray-300 rounded-xl p-3 text-center cursor-pointer hover:border-red-400 transition-colors">
        {preview ? <img src={preview} alt="Preview" className="max-h-32 mx-auto rounded-lg object-cover" /> : <div className="text-gray-400 text-sm"><Upload size={24} className="mx-auto mb-1" />Klik upload</div>}
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  )
}

function EditCarModal({ car, onSave, onClose }) {
  const [form, setForm] = useState(car)
  
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Edit Kereta</h2>
          <button onClick={onClose} className="text-gray-400"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Nama Kereta</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-red-400 focus:outline-none" /></div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Brand</label>
            <select value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-red-400 focus:outline-none">
              <option value="Honda">Honda</option>
              <option value="Toyota">Toyota</option>
              <option value="Mazda">Mazda</option>
              <option value="Proton">Proton</option>
              <option value="Perodua">Perodua</option>
            </select></div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Harga (RM)</label>
            <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: +e.target.value }))}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-red-400 focus:outline-none" /></div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Tahun</label>
            <input type="number" value={form.year} onChange={e => setForm(p => ({ ...p, year: +e.target.value }))}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-red-400 focus:outline-none" /></div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Mileage (km)</label>
            <input type="number" value={form.mileage} onChange={e => setForm(p => ({ ...p, mileage: +e.target.value }))}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-red-400 focus:outline-none" /></div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Lokasi</label>
            <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-red-400 focus:outline-none" /></div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Transmission</label>
            <select value={form.transmission} onChange={e => setForm(p => ({ ...p, transmission: e.target.value }))}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-red-400 focus:outline-none">
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select></div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Fuel</label>
            <select value={form.fuel} onChange={e => setForm(p => ({ ...p, fuel: e.target.value }))}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-red-400 focus:outline-none">
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
            </select></div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Warna</label>
            <input value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-red-400 focus:outline-none" /></div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-red-400 focus:outline-none resize-none" /></div>
          <ImageUpload value={form.image} onChange={v => setForm(p => ({ ...p, image: v }))} label="Gambar Kereta" />
        </div>
        <button onClick={() => onSave(form)} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl mt-4 flex items-center justify-center gap-2">
          <Save size={18} /> Simpan
        </button>
      </div>
    </div>
  )
}

export default function AdminPanel({ properties, onSave, onBack, tenants, onUpdateTenant, onConfirm }) {
  const [editCar, setEditCar] = useState(null)
  const [tab, setTab] = useState('cars')

  function saveCar(updated) {
    onSave(properties.map(p => p.id === updated.id ? updated : p))
    setEditCar(null)
  }

  function deleteCar(carId) {
    if (!confirm('Delete kereta ini?')) return
    onSave(properties.filter(p => p.id !== carId))
  }

  function addCar() {
    const newCar = {
      id: Date.now(),
      name: 'Kereta Baru',
      brand: 'Honda',
      location: 'Kuala Lumpur',
      price: 50000,
      year: 2024,
      mileage: 0,
      transmission: 'Automatic',
      fuel: 'Petrol',
      color: 'White',
      image: 'https://placehold.co/800x500/E74C3C/ffffff?text=New+Car',
      description: 'Kereta baru',
      rooms: [{ id: Date.now(), name: 'This Car', price: 50000, status: 'kosong', beds: [{ id: Date.now(), name: 'Available', occupied: false }], description: '' }]
    }
    onSave([...properties, newCar])
  }

  const totalCars = properties.length
  const availableCars = properties.filter(p => p.rooms.some(r => r.beds.some(b => !b.occupied))).length
  const totalValue = properties.reduce((sum, p) => sum + (p.price || 0), 0)
  const pendingInquiries = tenants.filter(t => t.status === 'pending')
  const confirmedInquiries = tenants.filter(t => t.status === 'confirmed')

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-red-600 px-4 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <ArrowLeft size={20} className="text-white" /></button>
          <h1 className="text-white text-lg font-bold flex-1">Speed Motor Admin</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab('cars')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs ${tab === 'cars' ? 'bg-white text-red-600' : 'bg-white/20 text-white'}`}>
            🚗 Cars ({totalCars})
          </button>
          <button onClick={() => setTab('inquiries')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs ${tab === 'inquiries' ? 'bg-white text-red-600' : 'bg-white/20 text-white'}`}>
            📋 ({pendingInquiries.length})
          </button>
        </div>
      </div>

      <div className="px-4 -mt-4 pb-6">
        {tab === 'cars' && (
          <>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-white rounded-2xl p-3 text-center shadow"><p className="text-gray-500 text-xs">Total</p><p className="text-red-600 text-2xl font-bold">{totalCars}</p></div>
              <div className="bg-white rounded-2xl p-3 text-center shadow"><p className="text-gray-500 text-xs">Available</p><p className="text-green-600 text-2xl font-bold">{availableCars}</p></div>
              <div className="bg-white rounded-2xl p-3 text-center shadow"><p className="text-gray-500 text-xs">Value</p><p className="text-red-600 text-2xl font-bold">RM{(totalValue/1000).toFixed(0)}K</p></div>
            </div>

            {properties.map(car => (
              <div key={car.id} className="bg-white rounded-2xl shadow p-4 mt-4">
                <div className="flex items-start gap-3">
                  <img src={car.image} alt={car.name} className="w-20 h-20 rounded-xl object-cover"
                    onError={e => e.target.src = 'https://placehold.co/200x200/E74C3C/ffffff?text=Car'} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-800">{car.name}</h3>
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">{car.brand}</span>
                        <p className="text-gray-500 text-xs mt-1">📍 {car.location}</p>
                        <p className="text-gray-500 text-xs">{car.year} | {car.mileage?.toLocaleString()} km</p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-600 font-bold text-lg">RM{car.price?.toLocaleString()}</p>
                        <span className={`text-xs px-2 py-0.5 rounded ${car.rooms.some(r => r.beds.some(b => !b.occupied)) ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {car.rooms.some(r => r.beds.some(b => !b.occupied)) ? 'Available' : 'Sold'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t">
                  <button onClick={() => setEditCar(car)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-1">
                    <Edit2 size={14} /> Edit
                  </button>
                  <button onClick={() => deleteCar(car.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-1">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}

            <button onClick={addCar} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-2xl mt-6 flex items-center justify-center gap-2">
              <Plus size={20} /> Tambah Kereta
            </button>
          </>
        )}

        {tab === 'inquiries' && (
          <>
            <h3 className="text-sm font-bold text-gray-500 mt-4 mb-2">📋 Pertanyaan Baru ({pendingInquiries.length})</h3>
            {pendingInquiries.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow">Tiada pertanyaan baru.</div>
            ) : (
              pendingInquiries.map((t, i) => (
                <div key={i} className="bg-white rounded-2xl shadow p-4 mt-3">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-bold text-gray-800">{t.nama}</h4>
                      <p className="text-gray-500 text-xs">📞 {t.phone}</p>
                      <p className="text-gray-500 text-xs">🚗 {t.carName}</p>
                      <p className="text-gray-400 text-xs mt-1">{new Date(t.appliedAt).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => onConfirm(t)} className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold h-fit">
                      ✓ Sah
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {editCar && <EditCarModal car={editCar} onSave={saveCar} onClose={() => setEditCar(null)} />}
    </div>
  )
}
