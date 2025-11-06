import { useState } from 'react'

interface LeftPanelProps {
  onTextChange?: (text: string) => void
}

function LeftPanel({ onTextChange }: LeftPanelProps) {
  const [textContent, setTextContent] = useState<string>('')

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setTextContent(newText)
    onTextChange?.(newText)
  }

  const handleClearText = () => {
    setTextContent('')
    onTextChange?.('')
  }

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-base font-semibold text-gray-700">
          Paste Resume Text
        </h2>
        {textContent && (
          <button
            onClick={handleClearText}
            className="text-sm text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex-1 p-4 overflow-hidden">
        <textarea
          value={textContent}
          onChange={handleTextChange}
          placeholder="Paste your resume text here..."
          className="w-full h-full p-4 text-base border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent overflow-y-auto"
          style={{ fontSize: '15px', lineHeight: '1.6' }}
        />
      </div>
    </div>
  )
}

export default LeftPanel

