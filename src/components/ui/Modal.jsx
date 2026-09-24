import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

export function Modal({
  isOpen,
  onClose,
  children,
  className,
  size = "md",
  showCloseButton = true,
  closeOnBackdrop = true,
}) {
  // Lock body scroll when modal is active
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

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[95vw] h-[90vh]",
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={closeOnBackdrop ? onClose : undefined}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", damping: 26, stiffness: 350 }}
            className={cn(
              "relative w-full rounded-2xl border border-border/80 bg-card text-card-foreground shadow-2xl overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col",
              sizeClasses[size] || sizeClasses.md,
              className
            )}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {showCloseButton && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all z-20 cursor-pointer"
                aria-label="Close dialog"
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

export function ModalHeader({ className, children, ...props }) {
  return (
    <div
      className={cn("p-6 pb-4 border-b border-border/60 shrink-0", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function ModalTitle({ className, children, ...props }) {
  return (
    <h2
      className={cn("text-xl font-bold tracking-tight text-foreground pr-8", className)}
      {...props}
    >
      {children}
    </h2>
  )
}

export function ModalDescription({ className, children, ...props }) {
  return (
    <p
      className={cn("text-sm text-muted-foreground mt-1 leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  )
}

export function ModalBody({ className, children, ...props }) {
  return (
    <div
      className={cn("p-6 overflow-y-auto flex-1", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export const ModalContent = ModalBody

export function ModalFooter({ className, children, ...props }) {
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

export default Modal
