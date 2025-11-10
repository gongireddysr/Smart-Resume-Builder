interface CustomAlertProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

function CustomAlert({ isVisible, message, onClose }: CustomAlertProps) {
  if (!isVisible) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-black/20 backdrop-blur-md border border-red-500/50 rounded-lg p-6 max-w-md mx-4 shadow-2xl animate-fade-in">
        <div className="flex items-start gap-4">
          {/* Warning Icon */}
          <div className="flex-shrink-0">
            <svg 
              className="w-6 h-6 text-red-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          
          {/* Message Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-400 mb-2 poppins-font">
              Missing Information
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed poppins-font">
              {message}
            </p>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
            aria-label="Close alert"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Action Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600/80 backdrop-blur-sm hover:bg-red-700/80 text-white rounded-md font-medium border border-red-500/30 transition-all duration-200 poppins-font"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomAlert;
