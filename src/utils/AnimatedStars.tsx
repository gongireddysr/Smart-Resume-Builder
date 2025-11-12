function AnimatedStars() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Large stars */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={`large-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
      
      {/* Medium stars */}
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={`medium-${i}`}
          className="absolute w-0.5 h-0.5 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.6,
            animation: `twinkle ${3 + Math.random() * 4}s infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
      
      {/* Small stars */}
      {Array.from({ length: 200 }).map((_, i) => (
        <div
          key={`small-${i}`}
          className="absolute w-px h-px bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.4,
            animation: `twinkle ${4 + Math.random() * 6}s infinite`,
            animationDelay: `${Math.random() * 8}s`,
          }}
        />
      ))}
      
      {/* Shooting stars */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={`shooting-${i}`}
          className="absolute w-1 h-px bg-gradient-to-r from-transparent via-white to-transparent"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
            width: '100px',
            animation: `shooting ${8 + Math.random() * 4}s infinite`,
            animationDelay: `${Math.random() * 10}s`,
            transform: 'rotate(-45deg)',
          }}
        />
      ))}

    </div>
  )
}

export default AnimatedStars
