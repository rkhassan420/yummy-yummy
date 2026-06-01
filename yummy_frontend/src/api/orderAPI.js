import api from './axiosInstance'

const orderAPI = {
  getOrders:     ()         => api.get('/orders/'),
  placeOrder:    (data)     => api.post('/orders/place/', data),
  getOrder:      (id)       => api.get(`/orders/${id}/`),
  // Admin
  getAllOrders:  ()         => api.get('/orders/admin/all/'),
  updateStatus:  (id, data) => api.put(`/orders/admin/${id}/status/`, data),
}

export default orderAPI
