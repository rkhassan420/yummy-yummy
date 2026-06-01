import api from './axiosInstance'

const menuAPI = {
  // GET all dishes — supports ?page_size=200 for bulk fetch
  getDishes:     (params) => api.get('/menu/dishes/', { params }),
  getDish:       (id)     => api.get(`/menu/dishes/${id}/`),
  getCategories: ()       => api.get('/menu/categories/'),
  getPopular:    ()       => api.get('/menu/popular/'),

  // Admin write operations
  createDish:    (data)   => api.post('/menu/dishes/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateDish:    (id, d)  => api.put(`/menu/dishes/${id}/`, d, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteDish:    (id)     => api.delete(`/menu/dishes/${id}/`),

  createCategory: (data)  => api.post('/menu/categories/', data),
  updateCategory: (id, d) => api.put(`/menu/categories/${id}/`, d),
  deleteCategory: (id)    => api.delete(`/menu/categories/${id}/`),

  createPopular:  (data)  => api.post('/menu/popular/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updatePopular:  (id, d) => api.put(`/menu/popular/${id}/`, d, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deletePopular:  (id)    => api.delete(`/menu/popular/${id}/`),
}

export default menuAPI
