import re

with open('src/components/AdminPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Lock import
content = content.replace(
    'import { ArrowLeft, Edit2, Trash2, Plus, Save, X, Upload, Calendar, DollarSign, Users, CheckCircle, Phone, Image } from "lucide-react"',
    'import { ArrowLeft, Edit2, Trash2, Plus, Save, X, Upload, Calendar, DollarSign, Users, CheckCircle, Phone, Image, Lock } from "lucide-react"'
)

# Add showPasswordModal state
content = content.replace(
    "const [tab, setTab] = useState('properties') // 'properties', 'applications', 'tenants'",
    "const [tab, setTab] = useState('properties')\n  const [showPasswordModal, setShowPasswordModal] = useState(false)"
)

# Add ChangePasswordModal before ViewTenantModal
change_pw_modal = '''
function ChangePasswordModal({ onClose }) {
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [err, setErr] = useState('')
  function handleSave() {
    const stored = localStorage.getItem('admin_password') || '888888'
    if (oldPw !== stored) { setErr('Password lama salah!'); return }
    if (newPw.length < 4) { setErr('Password baru最少4个字符!'); return }
    localStorage.setItem('admin_password', newPw)
    onClose()
  }
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-sm w-full p-5" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold mb-4">🔐 Ubah Password</h2>
        <div className="space-y-3">
          <input type="password" placeholder="Password lama" value={oldPw} onChange={e => setOldPw(e.target.value)} className="w-full border-2 border-accent rounded-xl px-4 py-3" />
          <input type="password" placeholder="Password baru" value={newPw} onChange={e => setNewPw(e.target.value)} className="w-full border-2 border-accent rounded-xl px-4 py-3" />
          {err && <p className="text-red-500 text-sm">{err}</p>}
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 py-3 bg-gray-200 rounded-xl font-bold">Batal</button>
          <button onClick={handleSave} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold">Simpan</button>
        </div>
      </div>
    </div>
  )
}

'''

content = content.replace('function ViewTenantModal', change_pw_modal + 'function ViewTenantModal')

# Add Lock button in header
content = content.replace(
    '<h1 className="text-white text-lg font-bold">🏠 Admin Panel</h1>',
    '<h1 className="text-white text-lg font-bold flex-1">🏠 Admin Panel</h1><button onClick={() => setShowPasswordModal(true)} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><Lock size={20} className="text-white" /></button>'
)

# Add modal rendering before closing
content = content.replace(
    '{viewTenant && <ViewTenantModal',
    '{showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}\n      {viewTenant && <ViewTenantModal'
)

with open('src/components/AdminPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')
