const API_BASE = 'https://rumah-sewa-api.maxmgleong.workers.dev'

export async function savePropertiesToCloud(properties) {
  try {
    const response = await fetch(`${API_BASE}/api/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ properties })
    })
    return response.ok
  } catch (error) {
    console.error('Error saving properties:', error)
    return false
  }
}

export async function getPropertiesFromCloud() {
  try {
    const response = await fetch(`${API_BASE}/api/properties`)
    if (!response.ok) return null
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error getting properties:', error)
    return null
  }
}

export async function saveTenantsToCloud(tenants) {
  try {
    const response = await fetch(`${API_BASE}/api/tenants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenants })
    })
    return response.ok
  } catch (error) {
    console.error('Error saving tenants:', error)
    return false
  }
}

export async function getTenantsFromCloud() {
  try {
    const response = await fetch(`${API_BASE}/api/tenants`)
    if (!response.ok) return []
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error getting tenants:', error)
    return []
  }
}

export async function uploadImage(file, folder = 'misc') {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    
    const response = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) return null
    const data = await response.json()
    return data.url
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}
