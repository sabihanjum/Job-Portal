import axios from 'axios'

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // If running in production on Render
  if (import.meta.env.PROD) {
    // Use VITE_API_BASE_URL environment variable if available
    if (import.meta.env.VITE_API_BASE_URL) {
      return import.meta.env.VITE_API_BASE_URL
    }
    // Fallback to relative path (works if frontend served from backend)
    return '/api'
  }
  // Development: use relative path (proxied by Vite)
  return '/api'
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  getProfile: () => api.get('/auth/profile/'),
}

export const resumeAPI = {
  upload: (formData) => api.post('/resumes/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  list: () => api.get('/resumes/'),
  get: (id) => api.get(`/resumes/${id}/`),
  reparse: (id) => api.post(`/resumes/${id}/reparse/`),
}

export const jobAPI = {
  list: (params) => api.get('/jobs/jobs/', { params }),
  get: (id) => api.get(`/jobs/jobs/${id}/`),
  create: (data) => api.post('/jobs/jobs/', data),
  update: (id, data) => api.patch(`/jobs/jobs/${id}/`, data),
  delete: (id) => api.delete(`/jobs/jobs/${id}/`),
  apply: (id, data) => api.post(`/jobs/jobs/${id}/apply/`, data),
  applications: () => api.get('/jobs/applications/'),
}

export const matchAPI = {
  match: (data) => api.post('/match/', data),
  detectBias: (text) => api.post('/match/bias/', { text }),
  detectFraud: (resumeId) => api.post('/match/fraud/', { resume_id: resumeId }),
  learningPath: (skills) => api.post('/match/learning-path/', { missing_skills: skills }),
}

export const interviewAPI = {
  schedule: (data) => api.post('/interviews/schedule/', data),
  list: () => api.get('/interviews/'),
  generateQuestions: (id) => api.post(`/interviews/${id}/generate_questions/`),
}

export const analyticsAPI = {
  dashboard: () => api.get('/analytics/dashboard/'),
  job: (id) => api.get(`/analytics/job/${id}/`),
}

export const feedbackAPI = {
  submitCorrection: (data) => api.post('/feedback/correction/', data),
  auditLogs: () => api.get('/feedback/audit-logs/'),
}

export default api
