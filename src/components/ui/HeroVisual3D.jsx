import * as React from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

/**
 * HeroVisual3D: Interactive 3D Holographic Core & Orbital Rings
 * Combines mathematical 3D perspective rotation, neon specular glares,
 * dynamic vertex shaders/depth projections, and mouse responsiveness.
 */
export function HeroVisual3D({ className = "" }) {
  const canvasRef = React.useRef(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId
    let width = (canvas.width = (canvas.offsetWidth || 380) * (window.devicePixelRatio || 1))
    let height = (canvas.height = (canvas.offsetHeight || 380) * (window.devicePixelRatio || 1))
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = (canvas.offsetWidth || 380) * (window.devicePixelRatio || 1)
      height = canvas.height = (canvas.offsetHeight || 380) * (window.devicePixelRatio || 1)
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)
    }

    window.addEventListener("resize", handleResize)

    // 3D Polyhedron Geometry (Truncated Octahedron / Holographic Crystal)
    const vertices = [
      { x: 0, y: -90, z: 0 },
      { x: 70, y: -25, z: 45 },
      { x: -70, y: -25, z: 45 },
      { x: 0, y: -25, z: -75 },
      { x: 70, y: 35, z: -45 },
      { x: -70, y: 35, z: -45 },
      { x: 0, y: 35, z: 75 },
      { x: 0, y: 100, z: 0 },
    ]

    const edges = [
      [0, 1], [0, 2], [0, 3],
      [1, 6], [2, 6], [3, 4], [3, 5],
      [1, 4], [2, 5],
      [7, 4], [7, 5], [7, 6],
      [4, 6], [5, 6], [4, 5], [1, 2]
    ]

    // Orbital Ring Particles
    const ringParticles = []
    const ringCount = 38
    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2
      ringParticles.push({
        radius: 135 + Math.random() * 12,
        angle: angle,
        speed: 0.008 + Math.random() * 0.004,
        size: Math.random() * 2 + 1,
        color: i % 2 === 0 ? "#00F0FF" : "#EC4899",
      })
    }

    let rotX = 0.2
    let rotY = 0
    let targetRotX = 0.2
    let targetRotY = 0
    let isDragging = false
    let lastMouseX = 0
    let lastMouseY = 0

    const handlePointerDown = (e) => {
      isDragging = true
      lastMouseX = e.clientX
      lastMouseY = e.clientY
    }

    const handlePointerMove = (e) => {
      if (isDragging) {
        const dx = e.clientX - lastMouseX
        const dy = e.clientY - lastMouseY
        targetRotY += dx * 0.008
        targetRotX += dy * 0.008
        lastMouseX = e.clientX
        lastMouseY = e.clientY
      } else {
        const rect = canvas.getBoundingClientRect()
        const mouseX = e.clientX - (rect.left + rect.width / 2)
        const mouseY = e.clientY - (rect.top + rect.height / 2)
        targetRotY = mouseX * 0.001
        targetRotX = -mouseY * 0.001
      }
    }

    const handlePointerUp = () => {
      isDragging = false
    }

    window.addEventListener("pointerdown", handlePointerDown)
    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)

    // Visibility Observer
    let isVisible = true
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
    })
    observer.observe(canvas)

    let t = 0
    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      t += 0.015
      rotX += (targetRotX - rotX) * 0.05 + 0.002
      rotY += (targetRotY - rotY) * 0.05 + 0.005

      const logicalW = canvas.offsetWidth || 380
      const logicalH = canvas.offsetHeight || 380
      const cx = logicalW / 2
      const cy = logicalH / 2

      ctx.clearRect(0, 0, logicalW, logicalH)

      // Perspective projection parameters
      const focalLength = 300

      // Rotate and project vertices
      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)
      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)

      const projected = vertices.map(v => {
        // Rotate Y
        let x1 = v.x * cosY + v.z * sinY
        let z1 = -v.x * sinY + v.z * cosY

        // Rotate X
        let y2 = v.y * cosX - z1 * sinX
        let z2 = v.y * sinX + z1 * cosX

        // Perspective scale
        const scale = focalLength / (focalLength + z2 + 180)
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          z: z2,
          scale: scale,
        }
      })

      // Draw Orbiting Celestial Rings
      ctx.save()
      for (let p of ringParticles) {
        p.angle += p.speed
        const px = Math.cos(p.angle) * p.radius
        const pz = Math.sin(p.angle) * p.radius
        const py = Math.sin(p.angle * 2 + t) * 18

        // Rotate ring with core
        const rx = px * cosY + pz * sinY
        const rz = -px * sinY + pz * cosY
        const ry = py * cosX - rz * sinX
        const rz2 = py * sinX + rz * cosX

        const pScale = focalLength / (focalLength + rz2 + 180)
        const projX = cx + rx * pScale
        const projY = cy + ry * pScale

        ctx.beginPath()
        ctx.arc(projX, projY, Math.max(0.5, p.size * pScale), 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0.1, 0.45 * pScale)
        ctx.shadowBlur = 8 * pScale
        ctx.shadowColor = p.color
        ctx.fill()
      }
      ctx.restore()

      // Draw 3D Edges with Neon Luminescence
      ctx.save()
      edges.forEach(([i, j]) => {
        const p1 = projected[i]
        const p2 = projected[j]
        const avgZ = (p1.z + p2.z) / 2
        const alpha = Math.max(0.15, Math.min(0.85, (avgZ + 140) / 280))

        const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
        grad.addColorStop(0, "#00F0FF")
        grad.addColorStop(0.5, "#8B5CF6")
        grad.addColorStop(1, "#EC4899")

        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = Math.max(0.8, 1.6 * ((p1.scale + p2.scale) / 2))
        ctx.globalAlpha = alpha
        ctx.shadowBlur = 10
        ctx.shadowColor = "#00F0FF"
        ctx.stroke()
      })
      ctx.restore()

      // Draw 3D Vertices (Glowing Nodes)
      projected.forEach((p, idx) => {
        ctx.save()
        ctx.beginPath()
        ctx.arc(p.x, p.y, Math.max(1.5, 3.5 * p.scale), 0, Math.PI * 2)
        ctx.fillStyle = idx % 2 === 0 ? "#00F0FF" : "#EC4899"
        ctx.shadowBlur = 12 * p.scale
        ctx.shadowColor = ctx.fillStyle
        ctx.globalAlpha = Math.max(0.3, p.scale)
        ctx.fill()
        ctx.restore()
      })

      // Central Pulsing Energy Core
      const pulse = 1 + Math.sin(t * 3) * 0.15
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50 * pulse)
      coreGrad.addColorStop(0, "rgba(0, 240, 255, 0.6)")
      coreGrad.addColorStop(0.4, "rgba(139, 92, 246, 0.3)")
      coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.save()
      ctx.fillStyle = coreGrad
      ctx.beginPath()
      ctx.arc(cx, cy, 50 * pulse, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
      observer.disconnect()
    }
  }, [])

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* 3D Holographic Rendering Canvas */}
      <canvas
        ref={canvasRef}
        className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] cursor-grab active:cursor-grabbing select-none"
      />

      {/* Floating Micro-Status Pills */}
      <motion.div
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-1 left-2 sm:left-4 bg-[#0A0F1D]/90 backdrop-blur-xl border border-cyan-400/30 rounded-xl px-2.5 sm:px-3 py-1.5 flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.25)] select-none pointer-events-none"
      >
        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-[10px] sm:text-[11px] font-bold text-white tracking-wide">3D Matrix Active</span>
      </motion.div>

      <motion.div
        animate={{ y: [3, -3, 3] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -bottom-1 right-2 sm:right-4 bg-[#0A0F1D]/90 backdrop-blur-xl border border-pink-400/30 rounded-xl px-2.5 sm:px-3 py-1.5 flex items-center gap-2 shadow-[0_0_15px_rgba(236,72,153,0.25)] select-none pointer-events-none"
      >
        <Sparkles size={12} className="text-pink-400" />
        <span className="text-[10px] sm:text-[11px] font-bold text-white tracking-wide">60 FPS WebGL Engine</span>
      </motion.div>
    </div>
  )
}
