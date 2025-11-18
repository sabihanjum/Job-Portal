import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { resumeAPI, matchAPI, interviewAPI, jobAPI } from '../services/api'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import ResumeUpload from '../components/ResumeUpload'
import MatchResults from '../components/MatchResults'

export default function CandidateDashboard() {
  const { user } = useAuth()
  const [resumes, setResumes] = useState([])
  const [matches, setMatches] = useState([])
  const [interviews, setInterviews] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentResumeId, setCurrentResumeId] = useState(null)

  useEffect(() => {
    loadResumes()
    loadInterviews()
    loadApplications()
  }, [])

  const loadResumes = async () => {
    try {
      const response = await resumeAPI.list()
      setResumes(response.data.results || response.data)
    } catch (error) {
      toast.error('Failed to load resumes')
    }
  }

  const loadInterviews = async () => {
    try {
      const response = await interviewAPI.list()
      setInterviews(response.data.results || response.data)
    } catch (error) {
      console.error('Failed to load interviews')
    }
  }

  const loadApplications = async () => {
    try {
      const response = await jobAPI.applications()
      setApplications(response.data.results || response.data)
    } catch (error) {
      console.error('Failed to load applications')
    }
  }

  const handleResumeUploaded = () => {
    loadResumes()
  }

  const handleMatchJobs = async (resumeId) => {
    setLoading(true)
    setMatches([]) // Clear previous matches
    setCurrentResumeId(resumeId)
    try {
      const response = await matchAPI.match({ resume_id: resumeId })
      setMatches(response.data.matches || [])
      toast.success(`Found ${response.data.matches?.length || 0} matching jobs!`)
      
      // Scroll to matches section
      setTimeout(() => {
        document.getElementById('matches-section')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error) {
      toast.error('Matching failed')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user.first_name || user.username}!</h1>
        
        {/* Resume Management Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Resume Management</h2>
          
          {resumes.length === 0 ? (
            // Show upload when no resumes
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Upload your resume to get started with AI-powered job matching</p>
              <ResumeUpload onUploadSuccess={handleResumeUploaded} />
            </div>
          ) : (
            // Show resumes with actions
            <div className="space-y-4">
              {resumes.map((resume) => (
                <div key={resume.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{resume.name || 'Unnamed Resume'}</h3>
                      <p className="text-sm text-gray-600">{resume.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          resume.is_processed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {resume.is_processed ? '✓ Processed' : '⏳ Processing...'}
                        </span>
                        <span className="text-xs text-gray-500">
                          Uploaded {new Date(resume.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => window.open(resume.file, '_blank')}
                      className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                    >
                      📄 View Resume
                    </button>
                    <button
                      onClick={() => handleMatchJobs(resume.id)}
                      disabled={!resume.is_processed || loading}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
                    >
                      {loading ? '⏳ Matching...' : '🎯 Match Jobs'}
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Upload Another Resume */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-3">Want to upload another resume?</p>
                <ResumeUpload onUploadSuccess={handleResumeUploaded} />
              </div>
            </div>
          )}
        </div>
        
        {/* Applications Status */}
        {applications.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">My Applications</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Job</th>
                    <th className="px-4 py-2 text-left">Company</th>
                    <th className="px-4 py-2 text-left">Match Score</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Applied Date</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="border-t">
                      <td className="px-4 py-2">{app.job_title}</td>
                      <td className="px-4 py-2 text-gray-600">Company Name</td>
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
                        <span className={`px-2 py-1 rounded text-sm ${
                          app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          app.status === 'interview' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Scheduled Interviews */}
        {interviews.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Scheduled Interviews</h2>
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div key={interview.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">Interview Scheduled</h3>
                      <p className="text-gray-600">Job Position: {interview.application?.job_title || 'N/A'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded text-sm ${
                      interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {interview.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium">Date & Time:</span>
                      <p className="text-gray-700">
                        {new Date(interview.scheduled_date).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Type:</span>
                      <p className="text-gray-700 capitalize">{interview.interview_type}</p>
                    </div>
                    {interview.meeting_link && (
                      <div className="md:col-span-2">
                        <span className="font-medium">Meeting Link:</span>
                        <a 
                          href={interview.meeting_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline ml-2"
                        >
                          Join Meeting
                        </a>
                      </div>
                    )}
                    {interview.notes && (
                      <div className="md:col-span-2">
                        <span className="font-medium">Notes:</span>
                        <p className="text-gray-700">{interview.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Job Matches Section */}
        {matches.length > 0 && (
          <div id="matches-section" className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Job Matches ({matches.length} found)
            </h2>
            <MatchResults matches={matches} resumeId={currentResumeId} />
          </div>
        )}
      </div>
    </Layout>
  )
}
