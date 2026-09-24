import * as React from "react"
import { ShieldCheck, Wifi, Flame, Sparkles } from "lucide-react"
import { cn } from "../../lib/utils"

const badgeVariants = {
  default:
    "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15",
  secondary:
    "bg-secondary text-secondary-foreground border-border/60 hover:bg-secondary/80",
  outline:
    "bg-background/60 backdrop-blur-xs text-foreground/80 border-border/80 hover:bg-muted/50",
  verified:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 font-semibold",
  urgent:
    "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25 font-semibold",
  active:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 font-semibold",
  remote:
    "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/25 font-semibold",
  warning:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25 font-semibold",
  purple:
    "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25 font-semibold",
  gradient:
    "bg-gradient-to-r from-primary/15 via-purple-500/15 to-pink-500/15 text-primary border-primary/25 font-semibold",
}

const badgeSizes = {
  xs: "text-[10px] px-1.5 py-0.5 rounded-md gap-1",
  sm: "text-xs px-2.5 py-0.5 rounded-full gap-1.5",
  md: "text-xs px-3 py-1 rounded-full gap-1.5",
}

function Badge({
  className,
  variant = "default",
  size = "sm",
  dot = false,
  icon,
  children,
  ...props
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium border transition-colors select-none",
        badgeVariants[variant] || badgeVariants.default,
        badgeSizes[size] || badgeSizes.sm,
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-2 w-2 shrink-0">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              variant === "urgent" ? "bg-rose-400" : "bg-emerald-400"
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              variant === "urgent" ? "bg-rose-500" : "bg-emerald-500"
            )}
          />
        </span>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  )
}

// Preset helper components for high-frequency status indicators
export function VerifiedBadge({ className, children = "Verified Student" }) {
  return (
    <Badge
      variant="verified"
      icon={<ShieldCheck size={12} className="text-emerald-500" />}
      className={className}
    >
      {children}
    </Badge>
  )
}

export function UrgentBadge({ className, children = "Urgent Need" }) {
  return (
    <Badge
      variant="urgent"
      dot={true}
      icon={<Flame size={12} className="text-rose-500" />}
      className={className}
    >
      {children}
    </Badge>
  )
}

export function RemoteBadge({ className, children = "Remote Allowed" }) {
  return (
    <Badge
      variant="remote"
      icon={<Wifi size={12} className="text-cyan-500" />}
      className={className}
    >
      {children}
    </Badge>
  )
}

export function ActiveBadge({ className, children = "Active Listing" }) {
  return (
    <Badge
      variant="active"
      dot={true}
      className={className}
    >
      {children}
    </Badge>
  )
}

export { Badge, Badge as Tag, badgeVariants }
export default Badge
