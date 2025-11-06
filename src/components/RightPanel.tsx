import { useState } from 'react'
import mammoth from 'mammoth'

interface RightPanelProps {
  onFileChange?: (file: File | null) => void
}

function RightPanel({ onFileChange }: RightPanelProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [fileContent, setFileContent] = useState<string>('')
  const [originalContent, setOriginalContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Check if content has been modified
  const hasChanges = fileContent !== originalContent

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
          file.name.endsWith('.docx')) {
        setUploadedFile(file)
        setIsLoading(true)
        onFileChange?.(file)
        
        try {
          // Read file as array buffer
          const arrayBuffer = await file.arrayBuffer()
          
          // Convert .docx to plain text using mammoth
          const result = await mammoth.extractRawText({ arrayBuffer })
          const extractedText = result.value
          setFileContent(extractedText)
          setOriginalContent(extractedText) // Store original content for comparison
        } catch (error) {
          console.error('Error reading file:', error)
          alert('Error reading the file. Please try again.')
          setFileContent('')
          setUploadedFile(null)
          onFileChange?.(null)
          event.target.value = '' // Reset input
        } finally {
          setIsLoading(false)
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
    <div className="flex flex-col bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-base font-semibold text-gray-700">
          Upload Resume (.docx)
        </h2>
        {uploadedFile && (
          <div className="flex items-center gap-3">
            {hasChanges && (
              <button
                onClick={handleDownload}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1 rounded hover:bg-blue-50 flex items-center gap-1.5 border border-blue-300"
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
              className="text-sm text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50"
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading document...</p>
            </div>
          </div>
        ) : uploadedFile && fileContent ? (
          <div className="h-full flex flex-col">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex-shrink-0">
              <p className="text-sm font-medium text-gray-700 truncate">
                {uploadedFile.name}
              </p>
            </div>
            <div className="flex-1 p-4 overflow-hidden">
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                className="w-full h-full p-4 text-base border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent overflow-y-auto"
                style={{ fontSize: '15px', lineHeight: '1.6', fontFamily: 'inherit' }}
                placeholder="Document content will appear here..."
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-4">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-colors"
            >
              <div className="flex flex-col items-center justify-center">
                <svg
                  className="w-16 h-16 mb-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  .DOCX files only
                </p>
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

