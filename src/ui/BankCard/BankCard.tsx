import { Copy, Check, Eye, EyeOff } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { maskValue } from "@/shared/utils"
import { Button } from "../Button/Button"

const REVEAL_DURATION_MS = 30_000

type BankCardProps = {
  name: string
  cardId: string
  selected?: boolean
  onSelect: () => void
  ref?: React.Ref<HTMLDivElement>
}

function BankCard({ name, cardId, selected = false, onSelect, ref }: BankCardProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    await navigator.clipboard.writeText(cardId)
    setIsCopied(true)
    copyTimerRef.current = setTimeout(() => setIsCopied(false), 2_000)
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white",
        "aspect-[1.586/1] w-full",
        "transition-shadow duration-200",
        selected && "ring-2 ring-sky-400 ring-offset-2 ring-offset-background"
      )}
    >
      <button
        type="button"
        className="absolute inset-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-pressed={selected}
        aria-label={`Select ${name}`}
        onClick={onSelect}
      />

      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between p-5">
        <span className="text-sm font-medium text-white/70">{name}</span>
        <span
          aria-live="polite"
          aria-label={isRevealed ? "Card number revealed" : "Card number hidden"}
          className="select-none font-mono text-base tracking-widest"
        >
          {isRevealed ? cardId : maskValue(cardId)}
        </span>
      </div>

      <div className="absolute bottom-3 right-3 z-20 flex gap-1">
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
  )
}

export { BankCard }
export type { BankCardProps }
