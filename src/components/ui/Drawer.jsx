import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

export function Drawer({
  isOpen,
  onClose,
  children,
  side = "bottom",
  className,
  showCloseButton = true,
}) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // ESC key handler
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  const sideVariants = {
    bottom: {
      initial: { y: "100%", opacity: 0.5 },
      animate: { y: 0, opacity: 1 },
      exit: { y: "100%", opacity: 0 },
      wrapper: "fixed inset-x-0 bottom-0 max-h-[88vh] rounded-t-3xl border-t",
    },
    right: {
      initial: { x: "100%", opacity: 0.5 },
      animate: { x: 0, opacity: 1 },
      exit: { x: "100%", opacity: 0 },
      wrapper: "fixed inset-y-0 right-0 w-full max-w-md border-l rounded-l-2xl",
    },
    left: {
      initial: { x: "-100%", opacity: 0.5 },
      animate: { x: 0, opacity: 1 },
      exit: { x: "-100%", opacity: 0 },
      wrapper: "fixed inset-y-0 left-0 w-full max-w-md border-r rounded-r-2xl",
    },
  }

  const currentVariant = sideVariants[side] || sideVariants.bottom

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Drawer Sheet */}
          <motion.div
            initial={currentVariant.initial}
            animate={currentVariant.animate}
            exit={currentVariant.exit}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className={cn(
              "z-50 bg-card text-card-foreground shadow-2xl border-border/80 flex flex-col overflow-hidden",
              currentVariant.wrapper,
              className
            )}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Grab handle for bottom sheet */}
            {side === "bottom" && (
              <div className="w-full flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
              </div>
            )}

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all z-20 cursor-pointer"
                aria-label="Close drawer"
              >
                <X size={18} />
              </button>
            )}

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function DrawerHeader({ className, children, ...props }) {
  return (
    <div
      className={cn("p-6 pb-4 border-b border-border/60 shrink-0", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function DrawerTitle({ className, children, ...props }) {
  return (
    <h2
      className={cn("text-xl font-bold tracking-tight text-foreground pr-8", className)}
      {...props}
    >
      {children}
    </h2>
  )
}

export function DrawerDescription({ className, children, ...props }) {
  return (
    <p
      className={cn("text-sm text-muted-foreground mt-1 leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  )
}

export function DrawerBody({ className, children, ...props }) {
  return (
    <div
      className={cn("p-6 overflow-y-auto flex-1", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function DrawerFooter({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "p-5 sm:p-6 pt-3 sm:pt-4 border-t border-border/60 flex items-center justify-end gap-3 shrink-0 bg-muted/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Drawer
