import api from './axiosInstance'

const authAPI = {
  register:       (data)  => api.post('/auth/register/',        data),
  login:          (data)  => api.post('/auth/login/',           data),
  logout:         (data)  => api.post('/auth/logout/',          data),
  getProfile:     ()      => api.get('/auth/profile/'),
  updateProfile:  (data)  => api.put('/auth/profile/',          data),
  changePassword: (data)  => api.post('/auth/change-password/', data),
  forgotPassword: (data)  => api.post('/auth/forgot-password/', data),
  resetPassword:  (data)  => api.post('/auth/reset-password/',  data),
  refreshToken:   (data)  => api.post('/auth/token/refresh/',   data),
}

export default authAPI
