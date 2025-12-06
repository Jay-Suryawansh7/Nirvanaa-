import type React from "react"

import { cn } from "@/lib/utils"

export type TextureVariant =
  | "fabric-of-squares"
  | "grid-noise"
  | "inflicted"
  | "debut-light"
  | "groovepaper"
  | "none"

interface BackgroundImageTextureProps {
  variant?: TextureVariant
  opacity?: number
  className?: string
  children?: React.ReactNode
}

// Inline SVG patterns as data URIs for portability
const textureMap: Record<Exclude<TextureVariant, "none">, string> = {
  "fabric-of-squares": `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='20' height='20' fill='%23ffffff'/%3E%3Crect width='10' height='10' fill='%23f0f0f0'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23f0f0f0'/%3E%3C/svg%3E`,
  "grid-noise": `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%23ffffff'/%3E%3Crect width='1' height='1' fill='%23cccccc'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%23cccccc'/%3E%3C/svg%3E`,
  inflicted: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6' height='6'%3E%3Crect width='6' height='6' fill='%23ffffff'/%3E%3Cpath d='M0 0L6 6M6 0L0 6' stroke='%23e0e0e0' stroke-width='0.5'/%3E%3C/svg%3E`,
  "debut-light": `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='8' height='8' fill='%23fafafa'/%3E%3Ccircle cx='4' cy='4' r='1' fill='%23e5e5e5'/%3E%3C/svg%3E`,
  groovepaper: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Crect width='10' height='10' fill='%23f5f5f5'/%3E%3Cpath d='M0 5h10M5 0v10' stroke='%23e8e8e8' stroke-width='0.5'/%3E%3C/svg%3E`,
}

export function BackgroundImageTexture({
  variant = "fabric-of-squares",
  opacity = 0.5,
  className,
  children,
}: BackgroundImageTextureProps) {
  const textureUrl = variant !== "none" ? textureMap[variant] : null

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {textureUrl && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url("${textureUrl}")`,
            backgroundRepeat: "repeat",
            opacity,
          }}
        />
      )}
      {children && <div className="relative">{children}</div>}
    </div>
  )
}

