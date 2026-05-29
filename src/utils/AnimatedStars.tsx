import { useMemo } from 'react'

interface StarStyle {
  left: string
  top: string
  animationDelay?: string
  animationDuration?: string
  opacity?: number
  animation?: string
  width?: string
  transform?: string
}

function createStars(
  count: number,
  generator: (index: number) => StarStyle
): StarStyle[] {
  return Array.from({ length: count }, (_, index) => generator(index))
}

function AnimatedStars() {
  const largeStars = useMemo(
    () =>
      createStars(50, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${2 + Math.random() * 2}s`,
      })),
    []
  )

  const mediumStars = useMemo(
    () =>
      createStars(100, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        opacity: 0.6,
        animation: `twinkle ${3 + Math.random() * 4}s infinite`,
        animationDelay: `${Math.random() * 5}s`,
      })),
    []
  )

  const smallStars = useMemo(
    () =>
      createStars(200, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        opacity: 0.4,
        animation: `twinkle ${4 + Math.random() * 6}s infinite`,
        animationDelay: `${Math.random() * 8}s`,
      })),
    []
  )

  const shootingStars = useMemo(
    () =>
      createStars(3, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 50}%`,
        width: '100px',
        animation: `shooting ${8 + Math.random() * 4}s infinite`,
        animationDelay: `${Math.random() * 10}s`,
        transform: 'rotate(-45deg)',
      })),
    []
  )

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {largeStars.map((style, i) => (
        <div
          key={`large-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
          style={style}
        />
      ))}

      {mediumStars.map((style, i) => (
        <div
          key={`medium-${i}`}
          className="absolute w-0.5 h-0.5 bg-white rounded-full"
          style={style}
        />
      ))}

      {smallStars.map((style, i) => (
        <div
          key={`small-${i}`}
          className="absolute w-px h-px bg-white rounded-full"
          style={style}
        />
      ))}

      {shootingStars.map((style, i) => (
        <div
          key={`shooting-${i}`}
          className="absolute w-1 h-px bg-gradient-to-r from-transparent via-white to-transparent"
          style={style}
        />
      ))}
    </div>
  )
}

export default AnimatedStars
