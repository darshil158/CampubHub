import * as React from "react"
import { ChevronDown, AlertCircle } from "lucide-react"
import { cn } from "../../lib/utils"

const Select = React.forwardRef(
  ({ className, children, leftIcon, error, ...props }, ref) => {
    const hasError = Boolean(error)

    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <select
          ref={ref}
          className={cn(
            "flex h-11 w-full appearance-none rounded-xl border border-border/80 bg-background/90 px-3.5 py-2 pr-10 text-sm shadow-2xs transition-all duration-200 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
            leftIcon && "pl-10",
            hasError && "border-red-500/80 focus-visible:border-red-500 focus-visible:ring-red-500/20 text-red-900 dark:text-red-200",
            className
          )}
          aria-invalid={hasError}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground flex items-center">
          {hasError ? (
            <AlertCircle size={16} className="text-red-500" />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>
        {typeof error === "string" && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 font-medium">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
