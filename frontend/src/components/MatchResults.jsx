import { useState } from 'react'
import { jobAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function MatchResults({ matches, resumeId }) {
  const [applying, setApplying] = useState({})

  const handleApply = async (jobId, matchId) => {
    if (!resumeId) {
      toast.error('Resume ID not found')
      return
    }

    setApplying(prev => ({ ...prev, [matchId]: true }))
    try {
      await jobAPI.apply(jobId, { resume_id: resumeId })
      toast.success('Application submitted successfully!')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to apply')
    } finally {
      setApplying(prev => ({ ...prev, [matchId]: false }))
    }
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <div key={match.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{match.job_title}</h3>
              <p className="text-gray-600">{match.job_company}</p>
            </div>
            <div className="text-right ml-4">
              <div className={`text-2xl font-bold ${
                match.match_percentage >= 80 ? 'text-green-600' :
                match.match_percentage >= 60 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {match.match_percentage}%
              </div>
              <p className="text-sm text-gray-500">Match Score</p>
            </div>
          </div>
          
          <div className="mb-3">
            <h4 className="font-semibold text-sm mb-2">Matched Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {match.matched_skills.map((skill, idx) => (
                <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          {match.missing_skills.length > 0 && (
            <div className="mb-3">
              <h4 className="font-semibold text-sm mb-2">Missing Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {match.missing_skills.map((skill, idx) => (
                  <span key={idx} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="bg-blue-50 p-3 rounded mb-3">
            <p className="text-sm text-blue-900">{match.recommendation}</p>
          </div>

          {resumeId && (
            <button
              onClick={() => handleApply(match.job, match.id)}
              disabled={applying[match.id]}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 mb-3"
            >
              {applying[match.id] ? 'Applying...' : 'Apply for this Job'}
            </button>
          )}
          
          {match.heatmap && match.heatmap.length > 0 && (
            <div className="mt-3">
              <h4 className="font-semibold text-sm mb-2">Match Explainability:</h4>
              <div className="space-y-2">
                {match.heatmap.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="bg-gray-50 p-2 rounded text-sm">
                    <p className="text-gray-700 mb-1">
                      <span className="font-medium">Requirement:</span> {item.job_requirement}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Matched in resume:</span> {item.resume_fragment}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Similarity: {(item.match_score * 100).toFixed(0)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
