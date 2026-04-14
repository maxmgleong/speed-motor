import { useState } from 'react'
import { ArrowLeft, Edit2, Save, X, Calendar, DollarSign } from 'lucide-react'

function EditTenantModal({ tenant, onSave, onClose }) {
  const [form, setForm] = useState({ ...tenant })

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleDateChange(e) {
    const { name, value } = e.target
    const newDate = new Date(value)
    const nextPayment = new Date(newDate)
    nextPayment.setMonth(nextPayment.getMonth() + 1)
    setForm(prev => ({
      ...prev,
      [name]: value,
      nextPaymentDate: nextPayment.toISOString()
    }))
  }

  function handleSave() {
    onSave(form)
    onClose()
  }

  function formatDisplayDate(iso) {
    if (!iso) return '-'
    return new Date(iso).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-primary">Edit Maklumat Sewa</h2>
          <button onClick={onClose} className="text-muted"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <div className="bg-accent rounded-xl p-3">
            <p className="text-xs text-muted">Nama Penyewa</p>
            <p className="font-bold text-primary">{form.nama}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">💰 Sewa (RM/sebulan)</label>
              <input type="number" name="rentAmount" value={form.rentAmount || 0} onChange={handleChange}
                className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">📅 Tarikh Masuk</label>
            <input type="date" name="tarikhMasuk" value={form.tarikhMasuk?.split('T')[0] || ''} onChange={handleDateChange}
              className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">📅 Tarikh Bayar Sewa Berikutnya</label>
            <input type="date" name="nextPaymentDate" value={form.nextPaymentDate?.split('T')[0] || ''} onChange={handleChange}
              className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
            <p className="text-xs text-muted mt-1">Auto: +1 bulan dari tarikh masuk</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">📝 Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none">
              <option value="pending">⏳ Menunggu</option>
              <option value="confirmed">✅ Disahkan</option>
              <option value="ended">🔴 Tamat</option>
            </select>
          </div>
        </div>
        <button onClick={handleSave} className="btn-primary w-full mt-4 flex items-center justify-center gap-2"><Save size={18} /> Simpan</button>
      </div>
    </div>
  )
}

export default function TenantList({ tenants, properties, onBack, onUpdateTenant }) {
  const [editTenant, setEditTenant] = useState(null)

  function getRoomInfo(roomId, propId) {
    const prop = properties.find(p => p.id === propId)
    if (!prop) return { propName: 'Property', roomName: 'Bilik' }
    const room = prop.rooms.find(r => r.id === roomId)
    return { propName: prop.name, roomName: room?.name || 'Bilik', roomPrice: room?.price || 0 }
  }

  function formatDate(iso) {
    if (!iso) return '-'
    return new Date(iso).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  function formatShortDate(iso) {
    if (!iso) return '-'
    return new Date(iso).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' })
  }

  // Filter confirmed tenants for the main list
  const confirmedTenants = tenants.filter(t => t.status === 'confirmed')
  const pendingTenants = tenants.filter(t => t.status === 'pending')

  // Calculate monthly stats
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const monthlyIncome = confirmedTenants.reduce((sum, t) => {
    const paymentDate = new Date(t.nextPaymentDate)
    if (paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear) {
      return sum + (t.rentAmount || 0)
    }
    return sum
  }, 0)

  const totalMonthlyRent = confirmedTenants.reduce((sum, t) => sum + (t.rentAmount || 0), 0)

  return (
    <div className="min-h-screen bg-accent">
      <div className="bg-primary px-4 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h1 className="text-white text-lg font-bold">📋 Senarai Penyewa</h1>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/15 rounded-2xl p-3 text-center">
            <p className="text-white/80 text-xs">Jumlah Penyewa</p>
            <p className="text-white text-2xl font-bold">{confirmedTenants.length}</p>
          </div>
          <div className="bg-white/15 rounded-2xl p-3 text-center">
            <p className="text-white/80 text-xs">Pendapatan Bulanan</p>
            <p className="text-white text-2xl font-bold">RM {totalMonthlyRent}</p>
          </div>
        </div>
      </div>
      <div className="px-4 -mt-4 pb-6">
        {confirmedTenants.length === 0 ? (
          <div className="bg-white rounded-3xl card-shadow p-8 text-center mt-4">
            <p className="text-muted">Belum ada penyewa yang disahkan.</p>
            <p className="text-xs text-muted mt-2">Sila sahkan tempahan di Dashboard.</p>
          </div>
        ) : (
          <>
            <h2 className="text-sm font-bold text-muted uppercase tracking-wide mb-3 mt-4">💼 Penyewa Aktif ({confirmedTenants.length})</h2>
            <div className="space-y-3">
              {confirmedTenants.map((tenant, idx) => {
                const { propName, roomName } = getRoomInfo(tenant.roomId, tenant.propId)
                const nextPayment = tenant.nextPaymentDate ? new Date(tenant.nextPaymentDate) : null
                const daysUntilPayment = nextPayment ? Math.ceil((nextPayment - new Date()) / (1000 * 60 * 60 * 24)) : null
                return (
                  <div key={idx} className="bg-white rounded-2xl card-shadow p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-primary">{tenant.nama}</h3>
                        <p className="text-xs text-muted">{propName} - {roomName}</p>
                      </div>
                      <button onClick={() => setEditTenant(tenant)} className="p-2 text-primary hover:bg-accent rounded-lg">
                        <Edit2 size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-green-50 rounded-xl p-2 text-center">
                        <DollarSign size={14} className="text-green-600 mx-auto mb-1" />
                        <p className="text-xs text-muted">Sewa</p>
                        <p className="font-bold text-green-700">RM {tenant.rentAmount || 0}</p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-2 text-center">
                        <Calendar size={14} className="text-blue-600 mx-auto mb-1" />
                        <p className="text-xs text-muted">Masuk</p>
                        <p className="font-bold text-blue-700">{formatShortDate(tenant.tarikhMasuk)}</p>
                      </div>
                      <div className={`rounded-xl p-2 text-center ${daysUntilPayment !== null && daysUntilPayment <= 7 ? 'bg-red-50' : 'bg-orange-50'}`}>
                        <Calendar size={14} className={`mx-auto mb-1 ${daysUntilPayment !== null && daysUntilPayment <= 7 ? 'text-red-600' : 'text-orange-600'}`} />
                        <p className="text-xs text-muted">Bayar</p>
                        <p className={`font-bold ${daysUntilPayment !== null && daysUntilPayment <= 7 ? 'text-red-700' : 'text-orange-700'}`}>
                          {daysUntilPayment !== null ? `${daysUntilPayment}h` : '-'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted">
                      <p>📅 Tarikh masuk: {formatDate(tenant.tarikhMasuk)}</p>
                      <p>💵 Bayar berikutnya: {formatDate(tenant.nextPaymentDate)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {pendingTenants.length > 0 && (
          <>
            <h2 className="text-sm font-bold text-muted uppercase tracking-wide mb-3 mt-6">⏳ Menunggu Pengesahan ({pendingTenants.length})</h2>
            <div className="space-y-3 pb-6">
              {pendingTenants.map((tenant, idx) => {
                const { propName, roomName } = getRoomInfo(tenant.roomId, tenant.propId)
                return (
                  <div key={idx} className="bg-white rounded-2xl card-shadow p-4 opacity-75">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-primary">{tenant.nama}</h3>
                        <p className="text-xs text-muted">{propName} - {roomName}</p>
                        <p className="text-xs text-muted mt-1">📅 {formatDate(tenant.appliedAt)}</p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg text-xs font-bold">Menunggu</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
      {editTenant && (
        <EditTenantModal tenant={editTenant} onSave={onUpdateTenant} onClose={() => setEditTenant(null)} />
      )}
    </div>
  )
}
