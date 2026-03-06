import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

function Skeleton({ className }: SkeletonProps): ReactNode {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-xl bg-muted", className)} />
}

export { Skeleton }
export type { SkeletonProps }
