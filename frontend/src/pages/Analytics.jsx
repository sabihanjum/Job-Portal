import { useState, useEffect } from 'react'
import { analyticsAPI } from '../services/api'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const response = await analyticsAPI.dashboard()
      setData(response.data)
    } catch (error) {
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Layout><div>Loading analytics...</div></Layout>
  if (!data) return <Layout><div>No data available</div></Layout>

  const pipelineData = [
    { name: 'Applied', value: data.pipeline_stats.total_applications },
    { name: 'Screening', value: data.pipeline_stats.screening },
    { name: 'Interview', value: data.pipeline_stats.interview },
    { name: 'Accepted', value: data.pipeline_stats.accepted },
    { name: 'Rejected', value: data.pipeline_stats.rejected },
  ]

  const matchDistData = [
    { name: 'Excellent (80%+)', value: data.match_distribution.excellent },
    { name: 'Good (60-80%)', value: data.match_distribution.good },
    { name: 'Moderate (40-60%)', value: data.match_distribution.moderate },
    { name: 'Low (<40%)', value: data.match_distribution.low },
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-500 text-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold mb-2">Avg Match Score</h3>
            <p className="text-3xl font-bold">{data.avg_match_score}%</p>
          </div>
          <div className="bg-green-500 text-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold mb-2">Total Applications</h3>
            <p className="text-3xl font-bold">{data.pipeline_stats.total_applications}</p>
          </div>
          <div className="bg-purple-500 text-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold mb-2">Interviews</h3>
            <p className="text-3xl font-bold">{data.interview_stats.total_scheduled}</p>
          </div>
          <div className="bg-orange-500 text-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold mb-2">Time to Shortlist</h3>
            <p className="text-3xl font-bold">{data.time_to_shortlist_days} days</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Application Pipeline</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Match Score Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={matchDistData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {matchDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Top Skills in Demand</h2>
            <div className="space-y-2">
              {data.most_common_skills.slice(0, 10).map((skill, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-gray-700">{skill.skill}</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                    {skill.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Applications per Job</h2>
            <div className="space-y-2">
              {data.applications_per_job.slice(0, 10).map((job, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-700 font-medium">{job.job__title}</p>
                    <p className="text-sm text-gray-500">{job.job__company}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">
                    {job.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
