import re

with open('src/components/AdminPanel.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add Lock import
old_import = "import { ArrowLeft, Edit2, Trash2, Plus, Save, X, Upload, Calendar, DollarSign, Users, CheckCircle, Phone, Image } from 'lucide-react'"
new_import = "import { ArrowLeft, Edit2, Trash2, Plus, Save, X, Upload, Calendar, DollarSign, Users, CheckCircle, Phone, Image, Lock } from 'lucide-react'"
c = c.replace(old_import, new_import)

# Add state
old_state = "const [tab, setTab] = useState('properties') // 'properties', 'applications', 'tenants'"
new_state = "const [tab, setTab] = useState('properties')\n  const [showPasswordModal, setShowPasswordModal] = useState(false)"
c = c.replace(old_state, new_state)

# Add Lock button in header
old_header = '<h1 className="text-white text-lg font-bold">🏠 Admin Panel</h1>'
new_header = '<h1 className="text-white text-lg font-bold flex-1">🏠 Admin Panel</h1><button onClick={() => setShowPasswordModal(true)} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><Lock size={20} className="text-white" /></button>'
c = c.replace(old_header, new_header)

# Add ChangePasswordModal before ViewTenantModal
modal = """
function ChangePasswordModal({ onClose }) {
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  function handleSave() {
    setError('')
    const PASSWORD_KEY = 'admin_password'
    const currentPassword = localStorage.getItem(PASSWORD_KEY) || '888888'
    if (oldPass !== currentPassword) { setError('Password lama salah!'); return }
    if (newPass.length < 4) { setError('Password最少4个字!'); return }
    if (newPass !== confirmPass) { setError('Password不一样!'); return }
    localStorage.setItem(PASSWORD_KEY, newPass)
    setSuccess(true)
    setTimeout(() => { localStorage.removeItem('rental_admin_logged_in'); onClose(); window.location.reload() }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-sm w-full p-5" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-primary">🔐 修改密码</h3>
          <button onClick={onClose} className="text-muted"><X size={20} /></button>
        </div>
        {success ? (
          <div className="text-center py-4"><div className="text-4xl mb-2">✅</div><p className="text-green-600 font-bold">密码修改成功!</p></div>
        ) : (
          <div className="space-y-3">
            <div><label className="block text-xs font-semibold text-primary mb-1">Password Lama</label><input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm" placeholder="Enter password lama" /></div>
            <div><label className="block text-xs font-semibold text-primary mb-1">Password Baru</label><input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm" placeholder="最少4个字" /></div>
            <div><label className="block text-xs font-semibold text-primary mb-1">确认 Password Baru</label><input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm" placeholder=" ulang password baru" /></div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button onClick={handleSave} className="btn-primary w-full">Simpan Password Baru</button>
          </div>
        )}
      </div>
    </div>
  )
}

"""
c = c.replace('function ViewTenantModal({ tenant, onClose }) {', modal + 'function ViewTenantModal({ tenant, onClose }) {')

# Add modal rendering at end
c = c.replace(
    '{viewTenant && <ViewTenantModal',
    '{showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}\n      {viewTenant && <ViewTenantModal'
)

with open('src/components/AdminPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('Done!')
