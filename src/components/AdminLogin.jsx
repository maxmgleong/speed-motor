import { useState } from 'react'
import { Lock } from 'lucide-react'

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (password === '888888') {
      onLogin()
    } else {
      setError(true)
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Speed Motor Admin</h2>
          <p className="text-gray-500 text-sm mt-1">Masukkan password untuk akses</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false) }}
              placeholder="Password"
              className={`w-full border-2 ${error ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-3 text-center text-lg focus:border-red-500 focus:outline-none`}
              maxLength={20}
            />
            {error && <p className="text-red-500 text-sm text-center mt-2">Password salah!</p>}
          </div>
          <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl text-base transition-colors">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
