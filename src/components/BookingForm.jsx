import { useState, useRef } from 'react'
import { ArrowLeft, Camera, Bed, Upload, CheckCircle } from 'lucide-react'

export default function BookingForm({ room, property, onBack, onSubmit }) {
  const [form, setForm] = useState({
    nama: '', ic: '', telefon: '', tarikhMasuk: '',
    selectedBedId: room.beds.find(b => !b.occupied)?.id || '',
    paymentMethod: 'booking_fee', // 'booking_fee' or 'full_payment'
    paymentReceipt: null
  })
  const [icPreview, setIcPreview] = useState(null)
  const [receiptPreview, setReceiptPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const icFileRef = useRef()
  const receiptFileRef = useRef()

  const availableBeds = room.beds.filter(b => !b.occupied)

  // Calculate prices
  const selectedBed = room.beds.find(b => b.id === form.selectedBedId)
  const bedPrice = selectedBed?.price || room.price || 0
  const bookingFee = 100
  // Full Payment = Deposit(1 month) + Utility(RM50) + Advance(1 month) + Agreement(RM100)
  const fullPayment = (bedPrice * 2) + 50 + 100
  const amountDue = form.paymentMethod === 'booking_fee' ? bookingFee : fullPayment

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function handleBedSelect(bedId) {
    setForm(prev => ({ ...prev, selectedBedId: bedId }))
    if (errors.bed) setErrors(prev => ({ ...prev, bed: '' }))
  }

  function handlePaymentMethodChange(method) {
    setForm(prev => ({ ...prev, paymentMethod: method }))
  }

  function handleIcImage(e) {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setIcPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  function handleReceiptImage(e) {
    const file = e.target.files[0]
    if (file) {
      setForm(prev => ({ ...prev, paymentReceipt: file }))
      const reader = new FileReader()
      reader.onloadend = () => setReceiptPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  function validate() {
    const errs = {}
    if (!form.nama.trim()) errs.nama = 'Sila masukkan nama penuh'
    if (!form.ic.trim()) errs.ic = 'Sila masukkan No. IC'
    if (!form.telefon.trim()) errs.telefon = 'Sila masukkan no. telefon'
    if (!form.tarikhMasuk) errs.tarikhMasuk = 'Sila pilih tarikh masuk'
    if (!form.selectedBedId) errs.bed = 'Sila pilih katil'
    if (!form.paymentReceipt) errs.receipt = 'Sila muat naik resit pembayaran'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    const selectedBed = room.beds.find(b => b.id === form.selectedBedId)
    onSubmit({
      ...form,
      selectedBedName: selectedBed?.name || '',
      bedPrice: selectedBed?.price || room.price || 0,
      amountPaid: amountDue
    })
  }

  return (
    <div className="min-h-screen bg-accent">
      <div className="bg-primary px-4 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div>
            <h1 className="text-white text-lg font-bold">Borang Tempahan</h1>
            <p className="text-secondary text-sm">{room.name}</p>
            <p className="text-secondary/70 text-xs">{property?.name}</p>
          </div>
        </div>
      </div>
      <div className="px-4 -mt-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl card-shadow p-5 space-y-4">
          {/* Bed Selection with Price */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-1.5">Pilih Katil *</label>
            <div className="grid grid-cols-2 gap-2">
              {availableBeds.map(bed => (
                <button key={bed.id} type="button" onClick={() => handleBedSelect(bed.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-colors ${form.selectedBedId == bed.id ? 'border-primary bg-accent' : 'border-accent'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <Bed size={16} className="text-primary" />
                    {form.selectedBedId == bed.id && <CheckCircle size={16} className="text-primary" />}
                  </div>
                  <p className="text-sm font-semibold text-primary">{bed.name}</p>
                  <p className="text-xs text-green-600">🟢 Tersedia</p>
                  <p className="text-sm font-bold text-primary mt-1">RM {bed.price || room.price}/bulan</p>
                </button>
              ))}
            </div>
            {errors.bed && <p className="text-red-500 text-xs mt-1">{errors.bed}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-1.5">Nama Penuh</label>
            <input name="nama" value={form.nama} onChange={handleChange} placeholder="Contoh: Ahmad bin Ali"
              className={`w-full border-2 ${errors.nama ? 'border-red-400' : 'border-accent'} rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none`} />
            {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
          </div>

          {/* IC */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-1.5">No. Kad Pengenalan (IC)</label>
            <input name="ic" value={form.ic} onChange={handleChange} placeholder="Contoh: 900101-01-1234"
              className={`w-full border-2 ${errors.ic ? 'border-red-400' : 'border-accent'} rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none`} />
            {errors.ic && <p className="text-red-500 text-xs mt-1">{errors.ic}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-1.5">No. Telefon (WhatsApp)</label>
            <input name="telefon" value={form.telefon} onChange={handleChange} placeholder="Contoh: 012-345 6789"
              className={`w-full border-2 ${errors.telefon ? 'border-red-400' : 'border-accent'} rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none`} />
            {errors.telefon && <p className="text-red-500 text-xs mt-1">{errors.telefon}</p>}
          </div>

          {/* Move-in Date */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-1.5">Tarikh Masuk</label>
            <input type="date" name="tarikhMasuk" value={form.tarikhMasuk} onChange={handleChange}
              className={`w-full border-2 ${errors.tarikhMasuk ? 'border-red-400' : 'border-accent'} rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none`} />
            {errors.tarikhMasuk && <p className="text-red-500 text-xs mt-1">{errors.tarikhMasuk}</p>}
          </div>

          {/* IC Image */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-1.5">Gambar Kad Pengenalan (IC)</label>
            <div onClick={() => icFileRef.current.click()} className="border-2 border-dashed border-accent rounded-2xl p-6 text-center cursor-pointer hover:border-primary">
              {icPreview ? (
                <img src={icPreview} alt="IC" className="max-h-48 mx-auto rounded-xl" />
              ) : (
                <div className="text-muted">
                  <Camera size={32} className="mx-auto mb-2 text-primary" />
                  <p className="text-sm">Klik untuk muat naik gambar IC</p>
                </div>
              )}
            </div>
            <input ref={icFileRef} type="file" accept="image/*" capture="environment" onChange={handleIcImage} className="hidden" />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-1.5">Kaedah Pembayaran</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => handlePaymentMethodChange('booking_fee')}
                className={`p-3 rounded-xl border-2 text-left transition-colors ${form.paymentMethod === 'booking_fee' ? 'border-primary bg-accent' : 'border-accent'}`}>
                <p className="text-sm font-semibold text-primary">📌 Booking Fee</p>
                <p className="text-lg font-bold text-primary">RM {bookingFee}</p>
                <p className="text-xs text-muted">Reservasi sahaja</p>
              </button>
              <button type="button" onClick={() => handlePaymentMethodChange('full_payment')}
                className={`p-3 rounded-xl border-2 text-left transition-colors ${form.paymentMethod === 'full_payment' ? 'border-primary bg-accent' : 'border-accent'}`}>
                <p className="text-sm font-semibold text-primary">💰 Bayaran Penuh</p>
                <p className="text-lg font-bold text-primary">RM {fullPayment}</p>
                <p className="text-xs text-muted">Termasuk semua</p>
              </button>
            </div>
            {form.paymentMethod === 'full_payment' && (
              <div className="bg-accent rounded-xl p-3 mt-2 text-xs">
                <p className="font-semibold text-primary">Breakdown Bayaran Penuh:</p>
                <p>• Deposit Sewa (1 bulan): RM {bedPrice}</p>
                <p>• Deposit Utility: RM 50</p>
                <p>• Sewa Advanced (1 bulan): RM {bedPrice}</p>
                <p>• Agreement Tenancy: RM 100</p>
                <p className="font-bold text-primary mt-1">Total: RM {fullPayment}</p>
              </div>
            )}
          </div>

          {/* Payment Receipt Upload */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-1.5">Resit Pembayaran *</label>
            <div onClick={() => receiptFileRef.current.click()} className={`border-2 ${errors.receipt ? 'border-red-400' : 'border-dashed border-accent'} rounded-2xl p-6 text-center cursor-pointer hover:border-primary`}>
              {receiptPreview ? (
                <img src={receiptPreview} alt="Receipt" className="max-h-48 mx-auto rounded-xl" />
              ) : (
                <div className="text-muted">
                  <Upload size={32} className="mx-auto mb-2 text-primary" />
                  <p className="text-sm">Klik untuk muat naik resit pembayaran</p>
                  <p className="text-xs mt-1">AMAUN: RM {amountDue}</p>
                </div>
              )}
            </div>
            <input ref={receiptFileRef} type="file" accept="image/*" capture="environment" onChange={handleReceiptImage} className="hidden" />
            {errors.receipt && <p className="text-red-500 text-xs mt-1">{errors.receipt}</p>}
          </div>

          {/* Summary */}
          <div className="bg-accent rounded-xl p-3">
            <p className="text-xs text-muted">Ringkasan:</p>
            <p className="font-bold text-primary">{room?.name} - {selectedBed?.name || 'Katil'}</p>
            <p className="text-sm text-muted">{property?.name}</p>
            <div className="border-t mt-2 pt-2">
              <p className="text-sm">Sewa bulanan: <span className="font-bold">RM {bedPrice}</span></p>
              <p className="text-sm">Amount due: <span className="font-bold text-primary">RM {amountDue}</span></p>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full text-center mt-2 text-base py-4">✅ Hantar Permohonan</button>
        </form>
      </div>
    </div>
  )
}
