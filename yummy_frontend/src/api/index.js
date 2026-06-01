import api from './axiosInstance'

export const contactAPI = {
  submit:        (data) => api.post('/contact/', data),
  getMessages:   ()     => api.get('/contact/admin/messages/'),
  deleteMessage: (id)   => api.delete(`/contact/admin/messages/${id}/`),
}

export const feedbackAPI = {
  getAll:    ()     => api.get('/feedback/'),
  submit:    (data) => api.post('/feedback/', data),
  adminDelete: (id) => api.delete(`/feedback/admin/${id}/`),
}

export const adminAPI = {
  login:        (data) => api.post('/admin/login/', data),
  getStats:     ()     => api.get('/admin/dashboard/stats/'),
  getCustomers: ()     => api.get('/admin/customers/'),
  deleteCustomer: (id) => api.delete(`/admin/customers/${id}/`),
}
