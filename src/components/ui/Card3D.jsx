import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "../../lib/utils"

export function Card3D({
  children,
  className = "",
  maxTilt = 10,
  glare = true,
  neonGlow = "purple",
  interactive = true,
  onClick,
  ...props
}) {
  const ref = React.useRef(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring physics for smooth tilt and return
  const mouseXSpring = useSpring(x, { stiffness: 280, damping: 22 })
  const mouseYSpring = useSpring(y, { stiffness: 280, damping: 22 })

  // Transform mouse values into 3D rotation degrees
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [maxTilt, -maxTilt])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-maxTilt, maxTilt])

  // Glare position
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100])
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100])

  const [isHovered, setIsHovered] = React.useState(false)

  const handleMouseMove = (e) => {
    if (!interactive || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseEnter = () => {
    if (!interactive) return
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    if (!interactive) return
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  const glowColors = {
    purple: "hover:border-purple-500/50 hover:shadow-[0_20px_50px_-10px_rgba(139,92,246,0.35)]",
    cyan: "hover:border-cyan-400/50 hover:shadow-[0_20px_50px_-10px_rgba(0,240,255,0.35)]",
    blue: "hover:border-blue-500/50 hover:shadow-[0_20px_50px_-10px_rgba(59,130,246,0.35)]",
    emerald: "hover:border-emerald-400/50 hover:shadow-[0_20px_50px_-10px_rgba(16,185,129,0.35)]",
    pink: "hover:border-pink-500/50 hover:shadow-[0_20px_50px_-10px_rgba(236,72,153,0.35)]",
  }

  return (
    <div
      style={{ perspective: 1200 }}
      className="relative h-full select-none"
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          rotateX: interactive ? rotateX : 0,
          rotateY: interactive ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative h-full rounded-2xl border border-white/10 bg-gradient-to-b from-[#111728]/90 via-[#0B0F1C]/90 to-[#070A14]/95 p-6 backdrop-blur-xl shadow-2xl transition-colors duration-300",
          glowColors[neonGlow] || glowColors.purple,
          interactive && "cursor-pointer",
          className
        )}
        {...props}
      >
        {/* Specular Holographic Glare */}
        {glare && interactive && isHovered && (
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-60 transition-opacity duration-300 overflow-hidden"
            style={{
              background: `radial-gradient(circle 320px at ${glareX.get()}% ${glareY.get()}%, rgba(255,255,255,0.14), transparent 70%)`,
            }}
          />
        )}

        {/* 3D Depth Layer */}
        <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="h-full flex flex-col">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

export default Card3D
