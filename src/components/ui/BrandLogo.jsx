import * as React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

export function BrandSymbol({ size = "md", className = "", animated = true }) {
  const sizeMap = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 52,
    xl: 64,
  }

  const dimension = sizeMap[size] || 40

  const content = (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 drop-shadow-md select-none", className)}
    >
      <defs>
        <linearGradient id="brand-grad-primary" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="brand-grad-cyan" x1="6" y1="42" x2="42" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="brand-grad-facet" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <filter id="brand-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Rounded squircle backplate with subtle stroke */}
      <rect width="48" height="48" rx="14" fill="#0F172A" />
      <rect
        width="46"
        height="46"
        x="1"
        y="1"
        rx="13"
        stroke="url(#brand-grad-primary)"
        strokeWidth="1.2"
        strokeOpacity="0.4"
      />

      {/* Modern Multi-Facet Geometric Quad 'Q' Symbol */}
      <g filter="url(#brand-glow)">
        {/* Top-Right Facet (Academics & Notes) */}
        <path
          d="M24 9L36 18L24 24L12 18L24 9Z"
          fill="url(#brand-grad-primary)"
        />
        {/* Bottom-Right Facet (Jobs & Careers) */}
        <path
          d="M24 24L36 18L36 30L24 38V24Z"
          fill="url(#brand-grad-facet)"
          fillOpacity="0.88"
        />
        {/* Bottom-Left Facet (Housing & Roommates) */}
        <path
          d="M24 24V38L12 30V18L24 24Z"
          fill="url(#brand-grad-cyan)"
          fillOpacity="0.9"
        />

        {/* Central Core Prism Spark */}
        <circle cx="24" cy="24" r="2.8" fill="#FFFFFF" opacity="0.95" />
        <circle cx="24" cy="24" r="5" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.4" />

        {/* Dynamic Launch Tail (Commerce & Growth) */}
        <path
          d="M28 30L38 40"
          stroke="url(#brand-grad-primary)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="38" cy="40" r="1.5" fill="#EC4899" />
      </g>
    </svg>
  )

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.05, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="inline-flex items-center justify-center cursor-pointer"
      >
        {content}
      </motion.div>
    )
  }

  return <div className="inline-flex items-center justify-center">{content}</div>
}

export function BrandLogo({
  size = "md",
  showWordmark = true,
  showBadge = false,
  badgeText = "STUDENT OS",
  linkTo = "/",
  className = "",
  animated = true,
}) {
  const textSizeMap = {
    xs: "text-base",
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  }

  const logoNode = (
    <div className={cn("inline-flex items-center gap-2.5 group select-none", className)}>
      <BrandSymbol size={size} animated={animated} />
      
      {showWordmark && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "font-black tracking-tight text-foreground group-hover:text-primary transition-colors",
                textSizeMap[size] || "text-xl"
              )}
            >
              Quadly
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {showBadge && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                {badgeText}
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium tracking-tight text-muted-foreground group-hover:text-foreground/80 transition-colors">
            Campus Hub
          </span>
        </div>
      )}
    </div>
  )

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
        {logoNode}
      </Link>
    )
  }

  return logoNode
}

export default BrandLogo
