"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface ExpandableScreenContextType {
    isExpanded: boolean
    expand: () => void
    collapse: () => void
    layoutId: string
    triggerRadius: string
    contentRadius: string
    animationDuration: number
}

const ExpandableScreenContext = React.createContext<ExpandableScreenContextType | null>(null)

export function useExpandableScreen() {
    const context = React.useContext(ExpandableScreenContext)
    if (!context) {
        throw new Error("useExpandableScreen must be used within an ExpandableScreen")
    }
    return context
}

interface ExpandableScreenProps {
    children: React.ReactNode
    layoutId?: string
    triggerRadius?: string
    contentRadius?: string
    animationDuration?: number
    defaultExpanded?: boolean
    onExpandChange?: (expanded: boolean) => void
    lockScroll?: boolean
}

export function ExpandableScreen({
    children,
    layoutId = "expandable-card",
    triggerRadius = "100px",
    contentRadius = "24px",
    animationDuration = 0.3,
    defaultExpanded = false,
    onExpandChange,
    lockScroll = true,
}: ExpandableScreenProps) {
    const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

    const expand = React.useCallback(() => {
        setIsExpanded(true)
        onExpandChange?.(true)
    }, [onExpandChange])

    const collapse = React.useCallback(() => {
        setIsExpanded(false)
        onExpandChange?.(false)
    }, [onExpandChange])

    // Lock scroll when expanded
    React.useEffect(() => {
        if (lockScroll && isExpanded) {
            document.body.style.overflow = "hidden"
            return () => {
                document.body.style.overflow = ""
            }
        }
    }, [isExpanded, lockScroll])

    // Escape key to close
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isExpanded) {
                collapse()
            }
        }
        document.addEventListener("keydown", handleEscape)
        return () => document.removeEventListener("keydown", handleEscape)
    }, [isExpanded, collapse])

    return (
        <ExpandableScreenContext.Provider
            value={{
                isExpanded,
                expand,
                collapse,
                layoutId,
                triggerRadius,
                contentRadius,
                animationDuration,
            }}
        >
            {children}
        </ExpandableScreenContext.Provider>
    )
}

interface ExpandableScreenTriggerProps {
    children: React.ReactNode
    className?: string
}

export function ExpandableScreenTrigger({
    children,
    className,
}: ExpandableScreenTriggerProps) {
    const { isExpanded, expand, layoutId, triggerRadius, animationDuration } =
        useExpandableScreen()

    return (
        <AnimatePresence>
            {!isExpanded && (
                <motion.div
                    layoutId={layoutId}
                    onClick={expand}
                    className={className}
                    style={{
                        borderRadius: triggerRadius,
                        cursor: "pointer",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: animationDuration }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

interface ExpandableScreenContentProps {
    children: React.ReactNode
    className?: string
    showCloseButton?: boolean
    closeButtonClassName?: string
}

export function ExpandableScreenContent({
    children,
    className,
    showCloseButton = true,
    closeButtonClassName,
}: ExpandableScreenContentProps) {
    const { isExpanded, collapse, layoutId, contentRadius, animationDuration } =
        useExpandableScreen()

    return (
        <AnimatePresence>
            {isExpanded && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: animationDuration }}
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                        onClick={collapse}
                    />

                    {/* Content */}
                    <motion.div
                        layoutId={layoutId}
                        className={`fixed inset-4 z-50 overflow-auto transform-gpu will-change-transform ${className}`}
                        style={{
                            borderRadius: contentRadius,
                        }}
                        transition={{ duration: animationDuration, ease: "easeInOut" }}
                    >
                        {showCloseButton && (
                            <button
                                onClick={collapse}
                                className={`absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 backdrop-blur-sm transition-colors hover:bg-white/20 ${closeButtonClassName}`}
                                aria-label="Close"
                            >
                                <X className="h-6 w-6 text-white" />
                            </button>
                        )}
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

interface ExpandableScreenBackgroundProps {
    trigger?: React.ReactNode
    content?: React.ReactNode
    className?: string
}

export function ExpandableScreenBackground({
    trigger,
    content,
    className,
}: ExpandableScreenBackgroundProps) {
    const { isExpanded } = useExpandableScreen()

    return (
        <div className={className}>
            <AnimatePresence mode="wait">
                {isExpanded ? (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {content}
                    </motion.div>
                ) : (
                    <motion.div
                        key="trigger"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {trigger}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
