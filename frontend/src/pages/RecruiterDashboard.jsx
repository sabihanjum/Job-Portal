import { useState, useEffect } from 'react'
import { jobAPI, interviewAPI } from '../services/api'
import api from '../services/api'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import { Link } from 'react-router-dom'

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [showInterviewModal, setShowInterviewModal] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [scheduling, setScheduling] = useState(false)
  const [interviewData, setInterviewData] = useState({
    scheduled_time: '',
    interview_type: 'video',
    meeting_link: '',
    notes: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        jobAPI.list(),
        jobAPI.applications()
      ])
      setJobs(jobsRes.data.results || jobsRes.data)
      setApplications(appsRes.data.results || appsRes.data)
    } catch (error) {
      toast.error('Failed to load data')
    }
  }

  const updateApplicationStatus = async (appId, newStatus) => {
    try {
      await api.patch(`/jobs/applications/${appId}/`, { status: newStatus })
      toast.success('Status updated')
      loadData()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handleScheduleInterview = (application) => {
    setSelectedApplication(application)
    setShowInterviewModal(true)
    setInterviewData({
      scheduled_time: '',
      interview_type: 'video',
      meeting_link: '',
      notes: ''
    })
  }

  const scheduleInterview = async () => {
    if (!interviewData.scheduled_time) {
      toast.error('Please select date and time')
      return
    }

    setScheduling(true)
    try {
      await interviewAPI.schedule({
        application: selectedApplication.id,
        scheduled_time: interviewData.scheduled_time,
        interview_type: interviewData.interview_type,
        meeting_link: interviewData.meeting_link,
        notes: interviewData.notes
      })
      
      // Update application status to interview
      await updateApplicationStatus(selectedApplication.id, 'interview')
      
      toast.success('Interview scheduled successfully!')
      setShowInterviewModal(false)
      setSelectedApplication(null)
      loadData()
    } catch (error) {
      toast.error('Failed to schedule interview')
    } finally {
      setScheduling(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
          <Link to="/analytics" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            View Analytics
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-500 text-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Total Jobs</h3>
            <p className="text-4xl font-bold">{jobs.length}</p>
          </div>
          <div className="bg-green-500 text-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Applications</h3>
            <p className="text-4xl font-bold">{applications.length}</p>
          </div>
          <div className="bg-purple-500 text-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Interviews</h3>
            <p className="text-4xl font-bold">
              {applications.filter(a => a.status === 'interview').length}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Candidate</th>
                  <th className="px-4 py-2 text-left">Job</th>
                  <th className="px-4 py-2 text-left">Match Score</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 10).map((app) => (
                  <tr key={app.id} className="border-t">
                    <td className="px-4 py-2">{app.candidate_name}</td>
                    <td className="px-4 py-2">{app.job_title}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        app.match_score >= 80 ? 'bg-green-100 text-green-800' :
                        app.match_score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {app.match_score.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={app.status}
                        onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        <option value="applied">Applied</option>
                        <option value="screening">Screening</option>
                        <option value="interview">Interview</option>
                        <option value="rejected">Rejected</option>
                        <option value="accepted">Accepted</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleScheduleInterview(app)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Schedule Interview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interview Scheduling Modal */}
        {showInterviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Schedule Interview</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Candidate</label>
                  <input
                    type="text"
                    value={selectedApplication?.candidate_name || ''}
                    disabled
                    className="w-full border rounded px-3 py-2 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Job Position</label>
                  <input
                    type="text"
                    value={selectedApplication?.job_title || ''}
                    disabled
                    className="w-full border rounded px-3 py-2 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Interview Date & Time</label>
                  <input
                    type="datetime-local"
                    value={interviewData.scheduled_time}
                    onChange={(e) => setInterviewData({...interviewData, scheduled_time: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Interview Type</label>
                  <select
                    value={interviewData.interview_type}
                    onChange={(e) => setInterviewData({...interviewData, interview_type: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="phone">Phone</option>
                    <option value="video">Video</option>
                    <option value="in-person">In-Person</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Meeting Link (for video)</label>
                  <input
                    type="url"
                    value={interviewData.meeting_link}
                    onChange={(e) => setInterviewData({...interviewData, meeting_link: e.target.value})}
                    placeholder="https://zoom.us/..."
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea
                    value={interviewData.notes}
                    onChange={(e) => setInterviewData({...interviewData, notes: e.target.value})}
                    rows="3"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowInterviewModal(false)
                    setSelectedApplication(null)
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={scheduleInterview}
                  disabled={scheduling}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {scheduling ? 'Scheduling...' : 'Schedule Interview'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
