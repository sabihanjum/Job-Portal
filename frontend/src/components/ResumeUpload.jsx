import { useState } from 'react'
import { resumeAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function ResumeUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Please upload PDF, DOCX, or image files only')
        return
      }
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('file_type', file.type.split('/')[1])

    try {
      await resumeAPI.upload(formData)
      toast.success('Resume uploaded successfully!')
      setFile(null)
      if (onUploadSuccess) onUploadSuccess()
    } catch (error) {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.docx,.jpg,.jpeg,.png"
          className="hidden"
          id="resume-upload"
        />
        <label
          htmlFor="resume-upload"
          className="cursor-pointer text-blue-600 hover:text-blue-700"
        >
          {file ? file.name : 'Click to select resume (PDF, DOCX, or Image)'}
        </label>
      </div>
      
      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {uploading ? 'Uploading...' : 'Upload Resume'}
        </button>
      )}
    </div>
  )
}
