import { useState, useEffect } from 'react'
import mammoth from 'mammoth'

interface RightPanelProps {
  onFileChange?: (file: File | null, extractedText?: string) => void
  isLoading?: boolean
  uploadedFile?: File | null
  resumeText?: string
}

function RightPanel({ onFileChange, isLoading: externalLoading, uploadedFile: propUploadedFile, resumeText: propResumeText }: RightPanelProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(propUploadedFile || null)
  const [fileContent, setFileContent] = useState<string>(propResumeText || '')
  const [originalContent, setOriginalContent] = useState<string>(propResumeText || '')
  const [isFileLoading, setIsFileLoading] = useState<boolean>(false)

  // Sync local state with props when they change (when coming back from results view)
  useEffect(() => {
    if (propUploadedFile !== undefined) {
      setUploadedFile(propUploadedFile)
    }
    if (propResumeText !== undefined) {
      setFileContent(propResumeText)
      setOriginalContent(propResumeText)
    }
  }, [propUploadedFile, propResumeText])

  // Check if content has been modified
  const hasChanges = fileContent !== originalContent
  const isLoading = externalLoading || isFileLoading

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
          file.name.endsWith('.docx')) {
        setUploadedFile(file)
        setIsFileLoading(true)
        
        try {
          const arrayBuffer = await file.arrayBuffer()
          const result = await mammoth.extractRawText({ arrayBuffer })
          const extractedText = result.value
          
          setFileContent(extractedText)
          setOriginalContent(extractedText)
          
          // Pass both file and extracted text to parent
          onFileChange?.(file, extractedText)
          
          console.log('Extracted text:', extractedText)
        } catch (error) {
          console.error('Error reading file:', error)
          alert('Error reading the document. Please try again.')
          setUploadedFile(null)
          onFileChange?.(null)
          event.target.value = '' // Reset input
        } finally {
          setIsFileLoading(false)
        }
      } else {
        alert('Please upload a .docx file only')
        event.target.value = '' // Reset input
      }
    }
  }

  const handleClearFile = () => {
    setUploadedFile(null)
    setFileContent('')
    setOriginalContent('')
    onFileChange?.(null)
    // Reset file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleDownload = () => {
    if (!fileContent || !uploadedFile) {
      return
    }

    try {
      // Create a text blob from the file content
      const blob = new Blob([fileContent], { type: 'text/plain' })
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = uploadedFile.name.replace('.docx', '.txt') || 'resume.txt'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading file:', error)
      alert('Error downloading the file. Please try again.')
    }
  }

  return (
    <div className="flex flex-col bg-black/10 backdrop-blur-sm rounded-lg shadow-md border border-gray-700/30 overflow-hidden relative z-10 h-80 lg:h-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-3 sm:px-4 py-2 border-b border-gray-700/30 flex-shrink-0 gap-2 sm:gap-0">
        <h2 className="text-sm sm:text-base font-semibold text-green-400 poppins-font">
          Upload Resume (.docx)
        </h2>
        {uploadedFile && (
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {hasChanges && (
              <button
                onClick={handleDownload}
                className="text-sm text-green-400 hover:text-green-300 font-medium px-3 py-1.5 rounded-md bg-black/20 backdrop-blur-sm border border-green-500/30 hover:border-green-400/50 transition-all duration-200 flex items-center gap-1.5 poppins-font"
                title="Download modified document"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download
              </button>
            )}
            <button
              onClick={handleClearFile}
              className="text-xs sm:text-sm text-green-400 hover:text-green-300 font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-md bg-black/20 backdrop-blur-sm border border-green-500/30 hover:border-green-400/50 transition-all duration-200 poppins-font"
            >
              Remove
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-300 poppins-font">
                {externalLoading ? 'Modifying resume...' : 'Loading document...'}
              </p>
            </div>
          </div>
        ) : uploadedFile && fileContent ? (
          <div className="h-full flex flex-col">
            <div className="px-4 py-2 bg-black/20 backdrop-blur-sm border-b border-gray-600/30 flex-shrink-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-green-400 truncate poppins-font">
                  {uploadedFile.name}
                </p>
              </div>
            </div>
            <div className="flex-1 p-2 sm:p-4 overflow-hidden">
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                className="w-full h-full p-2 sm:p-4 text-sm sm:text-base bg-black/10 backdrop-blur-sm text-white border border-gray-600/30 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent overflow-y-auto custom-scrollbar poppins-font"
                style={{ fontSize: '14px', lineHeight: '1.5' }}
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-4">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-600/30 rounded-lg cursor-pointer hover:bg-black/10 hover:border-green-500/50 transition-colors backdrop-blur-sm"
            >
              <div className="flex flex-col items-center justify-center">
                <svg className="w-16 h-16 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mb-2 text-sm text-gray-400 poppins-font">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400 poppins-font">.DOCX files only</p>
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  )
}

export default RightPanel

