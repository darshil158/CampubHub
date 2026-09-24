import * as React from "react"

export function Canvas3D({ className = "", count = 65, interactive = true }) {
  const canvasRef = React.useRef(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio || window.innerWidth)
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio || 500)
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1)
      height = canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1)
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)
    }

    window.addEventListener("resize", handleResize)

    // 3D Particles & Nodes
    const colors = ["#00F0FF", "#8B5CF6", "#EC4899", "#3B82F6", "#10B981"]
    const particles = []
    const logicalWidth = canvas.offsetWidth || window.innerWidth
    const logicalHeight = canvas.offsetHeight || 500

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * logicalWidth,
        y: Math.random() * logicalHeight,
        z: Math.random() * 400 + 50,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        vz: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2.2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        baseAlpha: Math.random() * 0.6 + 0.25,
      })
    }

    // Mouse Tracking for Interactive 3D Depth Field
    let mouse = { x: logicalWidth / 2, y: logicalHeight / 2, targetX: logicalWidth / 2, targetY: logicalHeight / 2 }

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.targetX = e.clientX - rect.left
      mouse.targetY = e.clientY - rect.top
    }

    if (interactive) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true })
    }

    let isVisible = true
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
    })
    observer.observe(canvas)

    // Main 3D Render Loop
    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      // Smooth mouse damping
      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      ctx.clearRect(0, 0, logicalWidth, logicalHeight)

      // Perspective field constant
      const focalLength = 300
      const centerX = logicalWidth / 2 + (mouse.x - logicalWidth / 2) * 0.08
      const centerY = logicalHeight / 2 + (mouse.y - logicalHeight / 2) * 0.08

      // Update and project particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        p.x += p.vx
        p.y += p.vy
        p.z += p.vz

        // Boundary wrap
        if (p.x < 0) p.x = logicalWidth
        if (p.x > logicalWidth) p.x = 0
        if (p.y < 0) p.y = logicalHeight
        if (p.y > logicalHeight) p.y = 0
        if (p.z < 50) p.z = 450
        if (p.z > 450) p.z = 50

        // 3D Perspective Projection
        const scale = focalLength / (focalLength + p.z)
        const projX = (p.x - centerX) * scale + centerX
        const projY = (p.y - centerY) * scale + centerY
        const projR = p.radius * scale * 1.5

        // Draw particle node with volumetric aura
        ctx.save()
        ctx.beginPath()
        ctx.arc(projX, projY, Math.max(0.5, projR), 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.baseAlpha * scale
        ctx.shadowBlur = 12 * scale
        ctx.shadowColor = p.color
        ctx.fill()
        ctx.restore()

        // Connect proximate nodes in 3D space
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dz = p.z - p2.z
          const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (dist3D < 110) {
            const scale2 = focalLength / (focalLength + p2.z)
            const proj2X = (p2.x - centerX) * scale2 + centerX
            const proj2Y = (p2.y - centerY) * scale2 + centerY

            ctx.save()
            ctx.beginPath()
            ctx.moveTo(projX, projY)
            ctx.lineTo(proj2X, proj2Y)
            ctx.strokeStyle = p.color
            ctx.globalAlpha = (1 - dist3D / 110) * 0.22 * scale
            ctx.lineWidth = 0.8 * scale
            ctx.stroke()
            ctx.restore()
          }
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
      if (interactive) {
        window.removeEventListener("pointermove", handlePointerMove)
      }
      observer.disconnect()
    }
  }, [count, interactive])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
      style={{ willChange: "transform" }}
    />
  )
}

export default Canvas3D
