import { useState, useEffect } from 'react'
import { INITIAL_PROPERTIES } from './data/properties'
import Header from './components/Header'
import FilterTabs from './components/FilterTabs'
import PropertyCard from './components/PropertyCard'
import PropertyDetail from './components/PropertyDetail'
import AdminPanel from './components/AdminPanel'
import AdminLogin from './components/AdminLogin'
import { savePropertiesToCloud, getPropertiesFromCloud, saveTenantsToCloud, getTenantsFromCloud } from './jsonbin'

const STORAGE_KEY = 'speed_motor_cars_v1'
const TENANTS_KEY = 'speed_motor_inquiries_v1'

export default function App() {
  const [view, setView] = useState('cars')
  const [filter, setFilter] = useState('semua')
  const [properties, setProperties] = useState([])
  const [selectedProp, setSelectedProp] = useState(null)
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    })
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        const cloudProperties = await getPropertiesFromCloud()
        const cloudTenants = await getTenantsFromCloud()
        
        if (cloudProperties && cloudProperties.length > 0) {
          setProperties(cloudProperties)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudProperties))
        } else {
          setProperties(INITIAL_PROPERTIES)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROPERTIES))
          await savePropertiesToCloud(INITIAL_PROPERTIES)
        }
        
        if (cloudTenants && cloudTenants.length > 0) {
          setTenants(cloudTenants)
          localStorage.setItem(TENANTS_KEY, JSON.stringify(cloudTenants))
        }
      } catch (error) {
        console.error("Error loading data:", error)
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          setProperties(JSON.parse(saved))
        } else {
          setProperties(INITIAL_PROPERTIES)
        }
        const savedTenants = localStorage.getItem(TENANTS_KEY)
        if (savedTenants) setTenants(JSON.parse(savedTenants))
      }
      setLoading(false)
    }
    loadData()
  }, [])

  function saveProperties(props) {
    setProperties(props)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(props))
    savePropertiesToCloud(props)
  }

  function saveTenants(newTenants) {
    setTenants(newTenants)
    localStorage.setItem(TENANTS_KEY, JSON.stringify(newTenants))
    saveTenantsToCloud(newTenants)
  }

  function getFilteredProperties() {
    if (filter === 'semua') {
      return properties
    }
    return properties.filter(p => p.brand === filter)
  }

  function handlePropertyClick(prop) {
    setSelectedProp(prop)
    setView('detail')
  }

  function handleAdminLogin() {
    setView('admin')
  }

  function handleLoginSuccess() {
    setAdminLoggedIn(true)
  }

  function handleConfirm(tenantData) {
    const updated = tenants.map(t => {
      if (t.appliedAt === tenantData.appliedAt && t.carId === tenantData.carId) {
        return { ...t, status: 'confirmed' }
      }
      return t
    })
    saveTenants(updated)
  }

  function handleUpdateTenant(updatedTenant) {
    const updated = tenants.map(t => t.appliedAt === updatedTenant.appliedAt && t.carId === updatedTenant.carId ? updatedTenant : t)
    saveTenants(updated)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  const totalCars = properties.length
  const availableCars = properties.filter(p => p.rooms.some(r => r.beds.some(b => !b.occupied))).length

  return (
    <div className="min-h-screen bg-gray-100 pb-8">
      {view === 'cars' && (
        <>
          <Header 
            onAdmin={() => handleAdminLogin()} 
            availableCars={availableCars} 
            totalCars={totalCars} 
            onInstall={handleInstall} 
            showInstall={!!deferredPrompt} 
          />
          <FilterTabs filter={filter} onFilterChange={setFilter} />
          <div className="px-4 space-y-4">
            {getFilteredProperties().map(prop => (
              <PropertyCard key={prop.id} property={prop} onClick={() => handlePropertyClick(prop)} />
            ))}
          </div>
        </>
      )}
      {view === 'detail' && selectedProp && (
        <PropertyDetail 
          property={selectedProp} 
          onBack={() => setView('cars')} 
        />
      )}
      {view === 'admin' && !adminLoggedIn && (
        <AdminLogin onLogin={handleLoginSuccess} />
      )}
      {view === 'admin' && adminLoggedIn && (
        <AdminPanel
          properties={properties}
          onSave={saveProperties}
          onBack={() => setView('cars')}
          tenants={tenants}
          onUpdateTenant={handleUpdateTenant}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}
