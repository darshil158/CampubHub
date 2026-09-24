import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Loader2 } from "lucide-react"
import { cn } from "../../lib/utils"

const buttonVariants = {
  default:
    "bg-gradient-to-r from-primary via-indigo-600 to-primary text-primary-foreground shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 hover:brightness-105 border border-primary/20",
  glow:
    "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(99,102,241,0.45)] hover:shadow-[0_0_28px_rgba(99,102,241,0.65)] hover:scale-[1.02] border border-white/20",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/80 shadow-2xs hover:border-primary/30",
  outline:
    "border border-border/90 bg-background/80 backdrop-blur-xs hover:bg-accent hover:text-accent-foreground hover:border-primary/40 shadow-2xs",
  ghost:
    "hover:bg-accent/80 hover:text-accent-foreground",
  glass:
    "bg-background/60 backdrop-blur-md border border-border/60 hover:bg-background/90 hover:border-primary/40 text-foreground shadow-xs",
  destructive:
    "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20 hover:shadow-red-500/35 border border-red-400/20",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 border border-emerald-400/20",
  link:
    "text-primary underline-offset-4 hover:underline p-0 h-auto",
}

const buttonSizes = {
  xs: "h-7 px-2.5 text-xs rounded-md gap-1.5",
  sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
  default: "h-10 px-4 py-2 text-sm rounded-xl gap-2",
  md: "h-10 px-4 py-2 text-sm rounded-xl gap-2",
  lg: "h-11 px-6 text-sm sm:text-base rounded-xl gap-2.5 font-semibold",
  xl: "h-13 px-8 text-base sm:text-lg rounded-2xl gap-3 font-semibold",
  icon: "h-10 w-10 rounded-xl p-0 justify-center",
  "icon-sm": "h-8 w-8 rounded-lg p-0 justify-center",
  "icon-lg": "h-12 w-12 rounded-xl p-0 justify-center",
}

const Button = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || loading

    // If asChild is true, we pass children directly to Slot
    if (asChild) {
      return (
        <Comp
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 active:scale-[0.98] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            buttonVariants[variant] || buttonVariants.default,
            buttonSizes[size] || buttonSizes.default,
            className
          )}
          ref={ref}
          disabled={isDisabled}
          aria-busy={loading}
          {...props}
        >
          {children}
        </Comp>
      )
    }

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 active:scale-[0.98] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          buttonVariants[variant] || buttonVariants.default,
          buttonSizes[size] || buttonSizes.default,
          className
        )}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants, buttonSizes }
