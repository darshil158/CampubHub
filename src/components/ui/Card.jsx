import * as React from "react"
import { cn } from "../../lib/utils"

const Card = React.forwardRef(({ className, variant = "default", interactive = false, ...props }, ref) => {
  const variants = {
    default: "rounded-2xl border border-border/70 bg-card text-card-foreground shadow-xs transition-all duration-200",
    interactive:
      "rounded-2xl border border-border/70 bg-card text-card-foreground shadow-xs hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/35 transition-all duration-300 cursor-pointer",
    glass:
      "rounded-2xl border border-border/60 bg-card/80 backdrop-blur-md text-card-foreground shadow-sm hover:border-primary/30 transition-all duration-200",
    glow:
      "rounded-2xl border border-primary/20 bg-gradient-to-b from-card to-primary/5 text-card-foreground shadow-md shadow-primary/5 transition-all duration-200",
  }

  return (
    <div
      ref={ref}
      className={cn(
        variants[variant] || variants.default,
        interactive && variants.interactive,
        className
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-5 sm:p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-bold text-lg sm:text-xl leading-none tracking-tight text-foreground", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-5 sm:p-6 pt-0 sm:pt-0", className)}
    {...props}
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-5 sm:p-6 pt-0 sm:pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
