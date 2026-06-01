export const formatCurrency = (amount) =>
  `Rs. ${Number(amount).toLocaleString('en-PK')} /-`

export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-PK', { day:'2-digit', month:'short', year:'numeric' })
}

export const getImageUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_MEDIA_URL || 'http://localhost:8000/media'}/${path}`
}

export const getInitials = (name) =>
  name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'
