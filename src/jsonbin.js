const MASTER_KEY = '$2a$10$22OIAkr3WFThNKgBTkp/1eqihQ2iEFU.zhvEFCys5ZByKu.W42Asy'
const BIN_ID = '69de529a856a682189327f6a'
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`

export async function savePropertiesToCloud(properties) {
  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': MASTER_KEY
      },
      body: JSON.stringify({ properties, tenants: [], updatedAt: new Date().toISOString() })
    })
    return response.ok
  } catch (error) {
    console.error('Error saving properties:', error)
    return false
  }
}

export async function getPropertiesFromCloud() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        'X-Master-Key': MASTER_KEY
      }
    })
    if (!response.ok) return null
    const data = await response.json()
    return data.record?.properties || null
  } catch (error) {
    console.error('Error getting properties:', error)
    return null
  }
}

export async function saveTenantsToCloud(tenants) {
  try {
    let currentData = { properties: [], tenants: [] }
    try {
      const getResp = await fetch(API_URL, {
        headers: { 'X-Master-Key': MASTER_KEY }
      })
      if (getResp.ok) {
        const record = await getResp.json()
        currentData = { properties: record.record?.properties || [], tenants: record.record?.tenants || [] }
      }
    } catch (e) { /* ignore */ }
    
    const mergedTenants = [...currentData.tenants, ...tenants.filter(t => 
      !currentData.tenants.some(ct => ct.appliedAt === t.appliedAt)
    )]
    
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': MASTER_KEY
      },
      body: JSON.stringify({ ...currentData, tenants: mergedTenants, updatedAt: new Date().toISOString() })
    })
    return response.ok
  } catch (error) {
    console.error('Error saving tenants:', error)
    return false
  }
}

export async function getTenantsFromCloud() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        'X-Master-Key': MASTER_KEY
      }
    })
    if (!response.ok) return []
    const data = await response.json()
    return data.record?.tenants || []
  } catch (error) {
    console.error('Error getting tenants:', error)
    return []
  }
}

export async function uploadImage(file, folder = 'misc') {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      resolve(reader.result)
    }
    reader.readAsDataURL(file)
  })
}
