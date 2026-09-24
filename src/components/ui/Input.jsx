import * as React from "react"
import { AlertCircle } from "lucide-react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(
  ({ className, type = "text", leftIcon, rightIcon, error, ...props }, ref) => {
    const hasError = Boolean(error)

    if (leftIcon || rightIcon || hasError) {
      return (
        <div className="relative w-full">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-11 w-full rounded-xl border border-border/80 bg-background/90 px-3.5 py-2 text-sm shadow-2xs transition-all duration-200 placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon && "pl-10",
              (rightIcon || hasError) && "pr-10",
              hasError && "border-red-500/80 focus-visible:border-red-500 focus-visible:ring-red-500/20 text-red-900 dark:text-red-200",
              className
            )}
            ref={ref}
            aria-invalid={hasError}
            {...props}
          />
          {rightIcon && !hasError && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center justify-center">
              {rightIcon}
            </div>
          )}
          {hasError && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-red-500 flex items-center justify-center pointer-events-none" title={typeof error === "string" ? error : undefined}>
              <AlertCircle size={16} />
            </div>
          )}
          {typeof error === "string" && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 font-medium">
              {error}
            </p>
          )}
        </div>
      )
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-border/80 bg-background/90 px-3.5 py-2 text-sm shadow-2xs transition-all duration-200 placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
