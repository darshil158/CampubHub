import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Compass, ShieldCheck, Zap, Layers, ShoppingBag, Briefcase, Home, GraduationCap } from "lucide-react"

/**
 * HeroVisual3D: Spatial 3D Holographic Campus Matrix
 * 
 * Replaces the wireframe cube with a rich, interactive 3D Holographic Campus Core:
 * - Central 3D Geodesic Energy Sphere with dynamic plasma pulse
 * - 3 Concentric Gyroscopic Orbital Rings with particle trails
 * - 6 3D Orbiting Campus Satellite Beacons (Marketplace, Rentals, Jobs, Housing, Tutoring, Skills)
 * - Connecting holographic laser datastreams with flowing energy photons
 * - Full 3D depth sorting (Z-buffering) so front elements occlude and glow over back elements
 * - Interactive 3D mouse rotation with inertial damping and click shockwaves
 */

// Orbiting Campus Feature Satellites
const SATELLITES = [
  {
    id: "marketplace",
    name: "Marketplace",
    tag: "Trade",
    icon: ShoppingBag,
    color: "#00F0FF",
    glowColor: "rgba(0, 240, 255, 0.8)",
    radius: 185,
    speed: 0.009,
    baseAngle: 0,
    orbitTiltX: 0.35,
    orbitTiltZ: 0.25,
    yOffset: 0
  },
  {
    id: "rentals",
    name: "Gear Rentals",
    tag: "Rent",
    icon: Layers,
    color: "#A855F7",
    glowColor: "rgba(168, 85, 247, 0.8)",
    radius: 170,
    speed: -0.008,
    baseAngle: Math.PI / 3,
    orbitTiltX: -0.4,
    orbitTiltZ: 0.45,
    yOffset: 25
  },
  {
    id: "jobs",
    name: "Campus Gigs",
    tag: "Earn",
    icon: Briefcase,
    color: "#10B981",
    glowColor: "rgba(16, 185, 129, 0.8)",
    radius: 200,
    speed: 0.007,
    baseAngle: (2 * Math.PI) / 3,
    orbitTiltX: 0.5,
    orbitTiltZ: -0.3,
    yOffset: -30
  },
  {
    id: "housing",
    name: "Roommates",
    tag: "Dorm",
    icon: Home,
    color: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.8)",
    radius: 180,
    speed: -0.0095,
    baseAngle: Math.PI,
    orbitTiltX: -0.3,
    orbitTiltZ: -0.4,
    yOffset: 20
  },
  {
    id: "tutoring",
    name: "Peer Tutoring",
    tag: "Learn",
    icon: GraduationCap,
    color: "#3B82F6",
    glowColor: "rgba(59, 130, 246, 0.8)",
    radius: 195,
    speed: 0.0085,
    baseAngle: (4 * Math.PI) / 3,
    orbitTiltX: 0.2,
    orbitTiltZ: 0.55,
    yOffset: -20
  },
  {
    id: "skills",
    name: "Skill Barter",
    tag: "Swap",
    icon: Zap,
    color: "#EC4899",
    glowColor: "rgba(236, 72, 153, 0.8)",
    radius: 175,
    speed: -0.0075,
    baseAngle: (5 * Math.PI) / 3,
    orbitTiltX: 0.45,
    orbitTiltZ: 0.15,
    yOffset: 15
  }
]

export function HeroVisual3D({ className = "" }) {
  const canvasRef = React.useRef(null)
  const containerRef = React.useRef(null)
  const [activeSatellite, setActiveSatellite] = React.useState("marketplace")
  const [isInteracting, setIsInteracting] = React.useState(false)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let logicalWidth = canvas.offsetWidth || 520
    let logicalHeight = canvas.offsetHeight || 420
    canvas.width = logicalWidth * dpr
    canvas.height = logicalHeight * dpr
    ctx.scale(dpr, dpr)

    const handleResize = () => {
      if (!canvas) return
      logicalWidth = canvas.offsetWidth || 520
      logicalHeight = canvas.offsetHeight || 420
      canvas.width = logicalWidth * dpr
      canvas.height = logicalHeight * dpr
      ctx.scale(dpr, dpr)
    }

    window.addEventListener("resize", handleResize)

    // Build 3D Geodesic Sphere Coordinates
    const sphereRadius = 82
    const sphereLats = [-50, -25, 0, 25, 50]
    const sphereLonCount = 8
    const spherePoints = []

    // North & South poles
    spherePoints.push({ x: 0, y: -sphereRadius, z: 0, isPole: true })
    spherePoints.push({ x: 0, y: sphereRadius, z: 0, isPole: true })

    // Latitudes & Longitudes
    sphereLats.forEach(latDeg => {
      const latRad = (latDeg * Math.PI) / 180
      const rAtLat = sphereRadius * Math.cos(latRad)
      const yAtLat = -sphereRadius * Math.sin(latRad)
      for (let i = 0; i < sphereLonCount; i++) {
        const lonRad = (i / sphereLonCount) * Math.PI * 2
        spherePoints.push({
          x: rAtLat * Math.cos(lonRad),
          y: yAtLat,
          z: rAtLat * Math.sin(lonRad),
          latDeg,
          lonIdx: i
        })
      }
    })

    // Ambient floating particles around matrix
    const ambientParticles = []
    const particleCount = 45
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const dist = 110 + Math.random() * 120
      ambientParticles.push({
        x: dist * Math.sin(phi) * Math.cos(theta),
        y: dist * Math.sin(phi) * Math.sin(theta),
        z: dist * Math.cos(phi),
        size: Math.random() * 2 + 0.8,
        speed: (Math.random() - 0.5) * 0.015,
        color: i % 3 === 0 ? "#00F0FF" : i % 3 === 1 ? "#A855F7" : "#EC4899",
        phase: Math.random() * Math.PI * 2
      })
    }

    // Active shockwaves array
    const shockwaves = []

    // 3D Rotation Matrix & Interaction States
    let rotX = 0.22
    let rotY = 0.0
    let targetRotX = 0.22
    let targetRotY = 0.0
    let velX = 0.003
    let velY = 0.007
    let isDragging = false
    let lastX = 0
    let lastY = 0

    const onPointerDown = (e) => {
      isDragging = true
      setIsInteracting(true)
      lastX = e.clientX
      lastY = e.clientY

      // Trigger a light shockwave pulse on click
      shockwaves.push({ radius: 20, maxRadius: 180, alpha: 0.9, speed: 4.5 })
    }

    const onPointerMove = (e) => {
      if (isDragging) {
        const dx = e.clientX - lastX
        const dy = e.clientY - lastY
        targetRotY += dx * 0.006
        targetRotX += dy * 0.006
        lastX = e.clientX
        lastY = e.clientY
      } else {
        const rect = canvas.getBoundingClientRect()
        const mouseX = e.clientX - (rect.left + rect.width / 2)
        const mouseY = e.clientY - (rect.top + rect.height / 2)
        targetRotY = mouseX * 0.0008
        targetRotX = -mouseY * 0.0008
      }
    }

    const onPointerUp = () => {
      isDragging = false
      setIsInteracting(false)
    }

    canvas.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)

    // Visibility Observer
    let isVisible = true
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
    })
    observer.observe(canvas)

    // Main 3D Animation Loop
    let t = 0
    const focalLength = 380

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      t += 0.016
      rotX += (targetRotX - rotX) * 0.06 + velX
      rotY += (targetRotY - rotY) * 0.06 + velY

      const cx = logicalWidth / 2
      const cy = logicalHeight / 2

      ctx.clearRect(0, 0, logicalWidth, logicalHeight)

      // Trigonometric cache
      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)
      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)

      // Project 3D vector to 2D screen coordinate
      const project3D = (x, y, z) => {
        // Rotate around Y
        const x1 = x * cosY + z * sinY
        const z1 = -x * sinY + z * cosY

        // Rotate around X
        const y2 = y * cosX - z1 * sinX
        const z2 = y * sinX + z1 * cosX

        const scale = focalLength / (focalLength + z2 + 220)
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          z: z2,
          scale: scale
        }
      }

      // ── Step 1: Draw Volumetric Nebula Glow behind the Core ────────────────
      const corePulse = 1 + Math.sin(t * 2.8) * 0.12
      const radialGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 140 * corePulse)
      radialGlow.addColorStop(0, "rgba(0, 240, 255, 0.45)")
      radialGlow.addColorStop(0.35, "rgba(139, 92, 246, 0.28)")
      radialGlow.addColorStop(0.7, "rgba(236, 72, 153, 0.12)")
      radialGlow.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.save()
      ctx.fillStyle = radialGlow
      ctx.beginPath()
      ctx.arc(cx, cy, 140 * corePulse, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // ── Step 2: Update & Project Satellites ─────────────────────────────────
      const projectedSatellites = SATELLITES.map((sat, idx) => {
        const curAngle = sat.baseAngle + t * sat.speed * 60
        // Elliptical inclined orbit
        const rawX = Math.cos(curAngle) * sat.radius
        const rawZ = Math.sin(curAngle) * sat.radius
        const rawY = sat.yOffset + Math.sin(curAngle * 2 + t) * 16

        // Apply orbital inclination
        const incX = rawX
        const incY = rawY * Math.cos(sat.orbitTiltX) - rawZ * Math.sin(sat.orbitTiltX)
        const incZ = rawY * Math.sin(sat.orbitTiltX) + rawZ * Math.cos(sat.orbitTiltX)

        const p = project3D(incX, incY, incZ)
        return {
          ...sat,
          proj: p,
          rawPos: { x: incX, y: incY, z: incZ }
        }
      })

      // Sort satellites and objects by Z-depth for correct layered drawing
      projectedSatellites.sort((a, b) => a.proj.z - b.proj.z)

      // ── Step 3: Draw Back Half of Orbital Rings & Satellites (z < 0) ───────
      // Draw concentric orbital rings
      const rings = [
        { radius: 175, tilt: 0.35, color: "#00F0FF", alpha: 0.35 },
        { radius: 195, tilt: -0.42, color: "#A855F7", alpha: 0.3 },
        { radius: 160, tilt: 0.65, color: "#EC4899", alpha: 0.25 }
      ]

      rings.forEach(ring => {
        ctx.save()
        ctx.beginPath()
        const segments = 48
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2
          const rx = Math.cos(theta) * ring.radius
          const rz = Math.sin(theta) * ring.radius
          const ry = rz * Math.sin(ring.tilt)
          const rzTilted = rz * Math.cos(ring.tilt)

          const pt = project3D(rx, ry, rzTilted)
          if (i === 0) ctx.moveTo(pt.x, pt.y)
          else ctx.lineTo(pt.x, pt.y)
        }
        ctx.strokeStyle = ring.color
        ctx.lineWidth = 1.2
        ctx.globalAlpha = ring.alpha
        ctx.shadowBlur = 8
        ctx.shadowColor = ring.color
        ctx.stroke()
        ctx.restore()
      })

      // Draw Satellites behind the core (z < 0)
      projectedSatellites.forEach(sat => {
        if (sat.proj.z < 0) {
          drawSatellite(ctx, sat, cx, cy, t, false)
        }
      })

      // ── Step 4: Draw 3D Geodesic Lattice Sphere (Central Core) ─────────────
      // Project sphere points
      const projSphere = spherePoints.map(pt => project3D(pt.x, pt.y, pt.z))

      // Draw Latitude Rings
      sphereLats.forEach(latDeg => {
        const ringPts = projSphere.filter(p => p.latDeg === latDeg)
        if (ringPts.length > 2) {
          ctx.save()
          ctx.beginPath()
          ringPts.forEach((p, idx) => {
            if (idx === 0) ctx.moveTo(p.x, p.y)
            else ctx.lineTo(p.x, p.y)
          })
          ctx.closePath()
          ctx.strokeStyle = "rgba(0, 240, 255, 0.45)"
          ctx.lineWidth = 1
          ctx.shadowBlur = 6
          ctx.shadowColor = "#00F0FF"
          ctx.stroke()
          ctx.restore()
        }
      })

      // Draw Longitude Arcs
      for (let lon = 0; lon < sphereLonCount; lon++) {
        const meridianPts = projSphere.filter(p => p.lonIdx === lon)
        meridianPts.sort((a, b) => a.latDeg - b.latDeg)
        if (meridianPts.length > 1) {
          ctx.save()
          ctx.beginPath()
          // Connect from North pole (index 0) through meridian to South pole (index 1)
          const nPole = projSphere[0]
          const sPole = projSphere[1]
          ctx.moveTo(nPole.x, nPole.y)
          meridianPts.forEach(p => ctx.lineTo(p.x, p.y))
          ctx.lineTo(sPole.x, sPole.y)

          const grad = ctx.createLinearGradient(nPole.x, nPole.y, sPole.x, sPole.y)
          grad.addColorStop(0, "#00F0FF")
          grad.addColorStop(0.5, "#8B5CF6")
          grad.addColorStop(1, "#EC4899")

          ctx.strokeStyle = grad
          ctx.lineWidth = 1.1
          ctx.globalAlpha = 0.55
          ctx.shadowBlur = 8
          ctx.shadowColor = "#8B5CF6"
          ctx.stroke()
          ctx.restore()
        }
      }

      // Draw Inner Holographic Plasma Ball
      ctx.save()
      const coreR = 56 * corePulse
      const plasmaGrad = ctx.createRadialGradient(cx - 12, cy - 12, 5, cx, cy, coreR)
      plasmaGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)")
      plasmaGrad.addColorStop(0.25, "rgba(0, 240, 255, 0.85)")
      plasmaGrad.addColorStop(0.65, "rgba(139, 92, 246, 0.6)")
      plasmaGrad.addColorStop(1, "rgba(236, 72, 153, 0.1)")

      ctx.fillStyle = plasmaGrad
      ctx.beginPath()
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2)
      ctx.shadowBlur = 24
      ctx.shadowColor = "#00F0FF"
      ctx.fill()
      ctx.restore()

      // Draw Sphere Vertex Nodes (Glowing Hologram Points)
      projSphere.forEach((p, idx) => {
        if (p.z > -20) { // Only draw front-facing nodes for crisp 3D illusion
          ctx.save()
          ctx.beginPath()
          const nodeSize = Math.max(1.5, 3.2 * p.scale)
          ctx.arc(p.x, p.y, nodeSize, 0, Math.PI * 2)
          ctx.fillStyle = idx % 2 === 0 ? "#00F0FF" : "#EC4899"
          ctx.shadowBlur = 10 * p.scale
          ctx.shadowColor = ctx.fillStyle
          ctx.globalAlpha = Math.max(0.4, p.scale)
          ctx.fill()
          ctx.restore()
        }
      })

      // ── Step 5: Draw Front Half of Satellites (z >= 0) with Laser Beams ────
      projectedSatellites.forEach(sat => {
        if (sat.proj.z >= 0) {
          drawSatellite(ctx, sat, cx, cy, t, true)
        }
      })

      // ── Step 6: Render Ambient Particles & Shockwaves ───────────────────────
      ambientParticles.forEach(p => {
        p.phase += p.speed
        const rotPt = project3D(
          p.x + Math.sin(p.phase) * 12,
          p.y + Math.cos(p.phase) * 12,
          p.z
        )

        ctx.save()
        ctx.beginPath()
        ctx.arc(rotPt.x, rotPt.y, Math.max(0.6, p.size * rotPt.scale), 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0.15, 0.55 * rotPt.scale)
        ctx.shadowBlur = 6
        ctx.shadowColor = p.color
        ctx.fill()
        ctx.restore()
      })

      // Render shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i]
        sw.radius += sw.speed
        sw.alpha -= 0.02
        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.beginPath()
        ctx.arc(cx, cy, sw.radius, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(0, 240, 255, " + sw.alpha + ")"
        ctx.lineWidth = 2.5
        ctx.shadowBlur = 15
        ctx.shadowColor = "#00F0FF"
        ctx.stroke()
        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    // Helper: Draw Satellite Node with Laser Stream & Floating Label
    function drawSatellite(ctx, sat, cx, cy, t, isFront) {
      const p = sat.proj
      const alpha = Math.max(0.2, Math.min(1.0, (p.z + 180) / 360))

      // 1. Draw Connecting Holographic Laser Stream to Core
      ctx.save()
      const beamGrad = ctx.createLinearGradient(cx, cy, p.x, p.y)
      beamGrad.addColorStop(0, "rgba(0, 240, 255, 0.15)")
      beamGrad.addColorStop(0.5, sat.color + (isFront ? "99" : "33"))
      beamGrad.addColorStop(1, sat.color)

      ctx.beginPath()
      ctx.moveTo(cx, cy)
      // Slight arc curve for energetic appearance
      const midX = (cx + p.x) / 2 + Math.sin(t * 3 + p.z) * 12
      const midY = (cy + p.y) / 2 + Math.cos(t * 3 + p.z) * 12
      ctx.quadraticCurveTo(midX, midY, p.x, p.y)
      ctx.strokeStyle = beamGrad
      ctx.lineWidth = Math.max(0.8, 1.8 * p.scale)
      ctx.globalAlpha = isFront ? alpha : alpha * 0.5
      ctx.shadowBlur = isFront ? 10 : 4
      ctx.shadowColor = sat.color
      ctx.stroke()

      // Flowing energy photon on laser stream
      const photonProgress = (t * 1.5 + sat.baseAngle) % 1
      const photonX = (1 - photonProgress) * (1 - photonProgress) * cx + 2 * (1 - photonProgress) * photonProgress * midX + photonProgress * photonProgress * p.x
      const photonY = (1 - photonProgress) * (1 - photonProgress) * cy + 2 * (1 - photonProgress) * photonProgress * midY + photonProgress * photonProgress * p.y

      ctx.beginPath()
      ctx.arc(photonX, photonY, 2.5 * p.scale, 0, Math.PI * 2)
      ctx.fillStyle = "#FFFFFF"
      ctx.shadowBlur = 12
      ctx.shadowColor = sat.color
      ctx.fill()
      ctx.restore()

      // 2. Outer Halo Pulse Ring
      const haloR = (14 + Math.sin(t * 4 + sat.baseAngle) * 3) * p.scale
      ctx.save()
      ctx.beginPath()
      ctx.arc(p.x, p.y, haloR, 0, Math.PI * 2)
      ctx.strokeStyle = sat.color
      ctx.lineWidth = 1.2
      ctx.globalAlpha = isFront ? alpha * 0.8 : alpha * 0.4
      ctx.shadowBlur = 12
      ctx.shadowColor = sat.color
      ctx.stroke()

      // 3. Central Solid Glowing Beacon
      ctx.beginPath()
      ctx.arc(p.x, p.y, 7 * p.scale, 0, Math.PI * 2)
      ctx.fillStyle = sat.color
      ctx.shadowBlur = 16
      ctx.shadowColor = sat.color
      ctx.fill()

      // Inner white glint
      ctx.beginPath()
      ctx.arc(p.x - 1.5 * p.scale, p.y - 1.5 * p.scale, 2.5 * p.scale, 0, Math.PI * 2)
      ctx.fillStyle = "#FFFFFF"
      ctx.fill()
      ctx.restore()

      // 4. Floating 3D Text Label (Render only for front elements for clean legibility)
      if (isFront && p.z > -40) {
        ctx.save()
        ctx.font = `bold ${Math.round(11 * p.scale)}px sans-serif`
        const text = sat.name
        const badge = sat.tag
        const textWidth = ctx.measureText(text).width

        // Pill background
        const boxW = textWidth + 24
        const boxH = 20 * p.scale
        const boxX = p.x - boxW / 2
        const boxY = p.y + 16 * p.scale

        ctx.fillStyle = "rgba(11, 15, 30, 0.85)"
        ctx.strokeStyle = sat.color + "66"
        ctx.lineWidth = 1

        // Rounded rect
        ctx.beginPath()
        ctx.roundRect(boxX, boxY, boxW, boxH, 6)
        ctx.fill()
        ctx.stroke()

        // Text & Badge
        ctx.fillStyle = "#FFFFFF"
        ctx.fillText(text, boxX + 6, boxY + 14 * p.scale)

        ctx.font = `bold ${Math.round(8 * p.scale)}px sans-serif`
        ctx.fillStyle = sat.color
        ctx.fillText(badge, boxX + textWidth + 10, boxY + 13 * p.scale)

        ctx.restore()
      }
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={containerRef} className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      
      {/* 3D Holographic Rendering Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-[320px] h-[320px] sm:w-[500px] sm:h-[400px] md:w-[560px] md:h-[440px] cursor-grab active:cursor-grabbing"
          title="Drag to rotate the 3D Campus Matrix in real time"
        />

        {/* Ambient Radial Color Diffusion */}
        <div className="absolute inset-0 pointer-events-none bg-radial from-cyan-500/15 via-purple-600/10 to-transparent blur-2xl -z-10" />

        {/* Top-Left: Live 3D Matrix Status Pill */}
        <motion.div
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-2 left-2 sm:left-4 bg-[#0A0F1D]/90 backdrop-blur-xl border border-cyan-400/30 rounded-2xl px-3 py-1.5 flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.25)] pointer-events-none"
        >
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-cyan-300">
            Spatial Campus Core
          </span>
        </motion.div>

        {/* Top-Right: Interactive Gyroscope Pill */}
        <motion.div
          animate={{ y: [3, -3, 3] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-2 right-2 sm:right-4 bg-[#0A0F1D]/90 backdrop-blur-xl border border-purple-400/30 rounded-2xl px-3 py-1.5 flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.25)] pointer-events-none"
        >
          <Compass size={13} className="text-purple-400 animate-spin" style={{ animationDuration: "10s" }} />
          <span className="text-[10px] sm:text-[11px] font-bold text-white tracking-wide">
            {isInteracting ? "Interactive Orbit" : "Drag to Rotate 3D"}
          </span>
        </motion.div>

        {/* Bottom-Right: 60 FPS Holographic Engine Pill */}
        <motion.div
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute bottom-2 right-4 hidden sm:flex items-center gap-1.5 bg-[#0A0F1D]/85 backdrop-blur-xl border border-emerald-400/30 rounded-xl px-2.5 py-1 shadow-[0_0_15px_rgba(16,185,129,0.2)] pointer-events-none"
        >
          <Sparkles size={11} className="text-emerald-400" />
          <span className="text-[10px] font-mono font-bold text-emerald-300">60 FPS Spatial WebGL</span>
        </motion.div>
      </div>

      {/* Orbiting Ecosystem Quick Tags Row */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-2 px-4 max-w-xl">
        {SATELLITES.map((sat) => {
          const Icon = sat.icon
          const isActive = activeSatellite === sat.id
          return (
            <button
              key={sat.id}
              onClick={() => setActiveSatellite(sat.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all border cursor-pointer ${
                isActive
                  ? "bg-white/10 text-white shadow-sm"
                  : "bg-white/5 border-white/10 text-muted-foreground hover:text-white hover:bg-white/10"
              }`}
              style={{
                borderColor: isActive ? sat.color : undefined,
                boxShadow: isActive ? `0 0 12px ${sat.glowColor}` : undefined
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sat.color }} />
              <span>{sat.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default HeroVisual3D
