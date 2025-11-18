import { useState, useEffect } from 'react'
import { jobAPI, resumeAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'

export default function JobList() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    loadJobs()
    if (user.role === 'candidate') {
      loadResumes()
    }
  }, [user.role])

  const loadJobs = async () => {
    try {
      const response = await jobAPI.list()
      setJobs(response.data.results || response.data)
    } catch (error) {
      toast.error('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const loadResumes = async () => {
    try {
      const response = await resumeAPI.list()
      setResumes(response.data.results || response.data)
    } catch (error) {
      console.error('Failed to load resumes')
    }
  }

  const handleApplyClick = (job) => {
    if (user.role !== 'candidate') {
      toast.error('Only candidates can apply for jobs. Please register as a candidate.')
      return
    }
    
    if (resumes.length === 0) {
      toast.error('Please upload a resume first from your dashboard')
      return
    }
    
    setSelectedJob(job)
    setShowResumeModal(true)
  }

  const handleApply = async (resumeId) => {
    setApplying(true)
    try {
      await jobAPI.apply(selectedJob.id, { resume_id: resumeId })
      toast.success('Application submitted successfully!')
      setShowResumeModal(false)
      setSelectedJob(null)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  if (loading) return <Layout><div className="text-center py-8">Loading...</div></Layout>

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Available Jobs</h1>
        
        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No jobs available at the moment.</p>
            <p className="text-gray-400 mt-2">Check back later for new opportunities!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-semibold">{job.title}</h2>
                  <p className="text-gray-600">{job.company} • {job.location}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {job.job_type}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {job.experience_level}
                    </span>
                  </div>
                </div>
                {(job.salary_min || job.salary_max) && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">
                    ${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}
                  </span>
                )}
              </div>
              
              <p className="text-gray-700 mb-4">{job.description?.substring(0, 200)}...</p>
              
              {job.required_skills && job.required_skills.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Required Skills:</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.required_skills.map((skill, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Posted {new Date(job.created_at).toLocaleDateString()}
                </span>
                {user.role === 'candidate' && (
                  <button 
                    onClick={() => handleApplyClick(job)}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  >
                    Apply Now
                  </button>
                )}
                {user.role === 'recruiter' && (
                  <span className="text-sm text-gray-600 italic">
                    Posted by your organization
                  </span>
                )}
                {user.role === 'admin' && (
                  <span className="text-sm text-gray-600 italic">
                    Admin view only
                  </span>
                )}
              </div>
            </div>
            ))}
          </div>
        )}

        {/* Resume Selection Modal */}
        {showResumeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Select Resume</h2>
              <p className="text-gray-600 mb-4">
                Choose which resume to use for this application:
              </p>
              
              <div className="space-y-3 mb-6">
                {resumes.filter(r => r.is_processed).map((resume) => (
                  <button
                    key={resume.id}
                    onClick={() => handleApply(resume.id)}
                    disabled={applying}
                    className="w-full text-left border rounded p-3 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <p className="font-medium">{resume.name || 'Unnamed Resume'}</p>
                    <p className="text-sm text-gray-600">{resume.email}</p>
                    <p className="text-xs text-gray-500">
                      Uploaded {new Date(resume.created_at).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>

              {resumes.filter(r => r.is_processed).length === 0 && (
                <p className="text-center text-gray-500 mb-4">
                  No processed resumes available. Please upload and wait for processing.
                </p>
              )}

              <button
                onClick={() => {
                  setShowResumeModal(false)
                  setSelectedJob(null)
                }}
                disabled={applying}
                className="w-full px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
