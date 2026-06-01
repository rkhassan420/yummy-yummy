import api from './axiosInstance'

const cartAPI = {
  getCart:    ()        => api.get('/cart/'),
  addItem:    (data)    => api.post('/cart/add/', data),
  updateItem: (id, qty) => api.put(`/cart/update/${id}/`, { qty }),
  removeItem: (id)      => api.delete(`/cart/remove/${id}/`),
  clearCart:  ()        => api.delete('/cart/clear/'),
}

export default cartAPI
