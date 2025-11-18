import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

export default function AdminDashboard() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/analytics" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600">View comprehensive analytics and reports</p>
          </Link>
          
          <Link to="/admin/users" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">User Management</h3>
            <p className="text-gray-600">Manage users and permissions</p>
          </Link>
          
          <Link to="/admin/jobs" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Job Management</h3>
            <p className="text-gray-600">Oversee all job postings</p>
          </Link>
          
          <Link to="/admin/audit-logs" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Audit Logs</h3>
            <p className="text-gray-600">Review system audit logs</p>
          </Link>
          
          <Link to="/jobs" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Browse Jobs</h3>
            <p className="text-gray-600">View all job postings</p>
          </Link>
        </div>
      </div>
    </Layout>
  )
}
