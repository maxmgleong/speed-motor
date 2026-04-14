const IMGBB_API_KEY = '0a17599dfe65f7df888b5e4fe211daf0'
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload'

export async function uploadImage(file, folder = 'misc') {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1] // Remove data:image/...;base64, prefix
      
      try {
        const formData = new FormData()
        formData.append('image', base64)
        formData.append('name', `${folder}_${Date.now()}`)
        
        const response = await fetch(`${IMGBB_API_URL}?key=${IMGBB_API_KEY}`, {
          method: 'POST',
          body: formData
        })
        
        const data = await response.json()
        if (data.success && data.data.url) {
          resolve(data.data.url)
        } else {
          // Fallback to base64 if upload fails
          resolve(reader.result)
        }
      } catch (error) {
        console.error('Image upload error:', error)
        // Fallback to base64
        resolve(reader.result)
      }
    }
    reader.readAsDataURL(file)
  })
}
