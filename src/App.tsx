import { useState } from 'react'
import LeftPanel from './components/LeftPanel'
import RightPanel from './components/RightPanel'

function App() {
  const [textContent, setTextContent] = useState<string>('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleTextChange = (text: string) => {
    setTextContent(text)
  }

  const handleFileChange = (file: File | null) => {
    setUploadedFile(file)
  }

  const handleModify = () => {
    // This function will handle the modification logic
    // For now, it can trigger processing of both panels
    if (textContent && uploadedFile) {
      // Logic to process modifications will go here
      console.log('Modify button clicked - Processing changes...')
      // You can add your modification logic here
    } else if (!textContent && !uploadedFile) {
      alert('Please paste text or upload a document to modify.')
    } else if (!textContent) {
      alert('Please paste the resume text in the left panel.')
    } else if (!uploadedFile) {
      alert('Please upload a .docx file in the right panel.')
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="px-6 py-3">
          <h1 className="text-2xl font-bold text-blue-600">
            Smart Resume Modifier
          </h1>
        </div>
      </header>

      {/* Split Screen Container - Full Screen */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden">
        {/* Left Side - Text Input */}
        <LeftPanel onTextChange={handleTextChange} />

        {/* Right Side - File Upload/Display */}
        <RightPanel onFileChange={handleFileChange} />
      </div>

      {/* Modify Button - Bottom Center */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-center">
          <button
            onClick={handleModify}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Modify
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
