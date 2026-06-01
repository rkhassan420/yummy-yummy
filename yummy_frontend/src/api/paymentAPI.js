import api from './axiosInstance'

const paymentAPI = {
  initiateJazzCash:  (data) => api.post('/payments/initiate/',            data).then(r => r.data),
  initiateEasyPaisa: (data) => api.post('/payments/easypaisa/initiate/',  data).then(r => r.data),
  cod:               (data) => api.post('/payments/cod/',                 data).then(r => r.data),
  getStatus:         (id)   => api.get(`/payments/status/${id}/`).then(r => r.data),
}

export default paymentAPI