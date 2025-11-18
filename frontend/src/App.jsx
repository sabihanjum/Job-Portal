import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import CandidateDashboard from './pages/CandidateDashboard'
import RecruiterDashboard from './pages/RecruiterDashboard'
import AdminDashboard from './pages/AdminDashboard'
import JobList from './pages/JobList'
import Analytics from './pages/Analytics'
import UserManagement from './pages/UserManagement'
import JobManagement from './pages/JobManagement'
import AuditLogs from './pages/AuditLogs'
import SkillsAssessment from './pages/SkillsAssessment'
import AICoach from './components/AICoach'

function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()
  
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
  
  if (!user) return <Navigate to="/login" />
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />
  }
  
  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <AICoach />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <PrivateRoute>
              <DashboardRouter />
            </PrivateRoute>
          } />
          
          <Route path="/jobs" element={
            <PrivateRoute>
              <JobList />
            </PrivateRoute>
          } />
          
          <Route path="/analytics" element={
            <PrivateRoute allowedRoles={['recruiter', 'admin']}>
              <Analytics />
            </PrivateRoute>
          } />
          
          <Route path="/admin/users" element={
            <PrivateRoute allowedRoles={['admin']}>
              <UserManagement />
            </PrivateRoute>
          } />
          
          <Route path="/admin/jobs" element={
            <PrivateRoute allowedRoles={['admin']}>
              <JobManagement />
            </PrivateRoute>
          } />
          
          <Route path="/admin/audit-logs" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AuditLogs />
            </PrivateRoute>
          } />
          
          <Route path="/skills-assessment" element={
            <PrivateRoute allowedRoles={['candidate']}>
              <SkillsAssessment />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

function DashboardRouter() {
  const { user } = useAuth()
  
  if (user.role === 'candidate') return <CandidateDashboard />
  if (user.role === 'recruiter') return <RecruiterDashboard />
  if (user.role === 'admin') return <AdminDashboard />
  
  return <Navigate to="/login" />
}

export default App
