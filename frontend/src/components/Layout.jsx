import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

export default function Layout({ children }) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition">
                <Logo className="h-10 w-10" />
                <span>AI Job Portal</span>
              </Link>
              <Link to="/jobs" className="text-gray-700 hover:text-blue-600">
                Jobs
              </Link>
              {user?.role === 'candidate' && (
                <Link to="/skills-assessment" className="text-gray-700 hover:text-blue-600">
                  Skills Test
                </Link>
              )}
              {(user?.role === 'recruiter' || user?.role === 'admin') && (
                <Link to="/analytics" className="text-gray-700 hover:text-blue-600">
                  Analytics
                </Link>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {user?.username} ({user?.role})
              </span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
