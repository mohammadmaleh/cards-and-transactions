import { Copy, Check, Eye, EyeOff } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { maskValue } from "@/shared/utils"
import type { CardType } from "@/types/card"
import { Button } from "../Button/Button"

const REVEAL_DURATION_MS = 30_000

const CARD_CONFIG: Record<CardType, { label: string; gradient: string; ring: string }> = {
  private: {
    label: "Private Card",
    gradient: "from-slate-700 to-slate-900",
    ring: "ring-sky-400",
  },
  business: {
    label: "Business Card",
    gradient: "from-indigo-800 to-slate-900",
    ring: "ring-indigo-400",
  },
}

type BankCardProps = {
  type: CardType
  iban: string
  selected?: boolean
  onSelect: () => void
  ref?: React.Ref<HTMLDivElement>
}

function BankCard({ type, iban, selected = false, onSelect, ref }: BankCardProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const config = CARD_CONFIG[type]

  useEffect(() => {
    if (isRevealed) {
      hideTimerRef.current = setTimeout(() => setIsRevealed(false), REVEAL_DURATION_MS)
    }
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [isRevealed])

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    }
  }, [])

  const handleRevealToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsRevealed((prev) => !prev)
  }

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(iban)
    setIsCopied(true)
    copyTimerRef.current = setTimeout(() => setIsCopied(false), 2_000)
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-2xl bg-linear-to-br text-white",
        config.gradient,
        "aspect-[1.586/1] w-full",
        "transition-shadow duration-200",
        "ring-offset-2 ring-offset-background",
        selected && `ring-2 ${config.ring}`,
        `has-[.card-select:focus-visible]:ring-2 has-[.card-select:focus-visible]:${config.ring}`
      )}
    >
      <button
        type="button"
        className="card-select absolute inset-0 rounded-2xl focus-visible:outline-none"
        aria-pressed={selected}
        aria-label={`Select ${config.label}`}
        onClick={onSelect}
      />

      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between p-5">
        <span className="text-sm font-medium text-white/70">{config.label}</span>
        <div className="flex items-end justify-between gap-3">
          <div>
            <span aria-live="polite" aria-atomic="true" className="sr-only">
              {isRevealed ? "IBAN revealed" : "IBAN hidden"}
            </span>
            <span
              aria-label={
                !isRevealed
                  ? `IBAN ending in ${iban.replace(/\s/g, "").slice(-4)}, hidden`
                  : undefined
              }
              className="select-none font-mono text-sm tracking-wider"
            >
              {isRevealed ? iban : maskValue(iban)}
            </span>
          </div>
          <div className="pointer-events-auto flex shrink-0 gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="text-white/70 hover:bg-white/10 hover:text-white"
              aria-label={isRevealed ? "Hide card number" : "Show card number"}
              onClick={handleRevealToggle}
            >
              {isRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-white/70 hover:bg-white/10 hover:text-white"
              aria-label={isCopied ? "Copied" : "Copy card number"}
              onClick={handleCopy}
            >
              {isCopied ? <Check size={15} /> : <Copy size={15} />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { BankCard }
export type { BankCardProps }
