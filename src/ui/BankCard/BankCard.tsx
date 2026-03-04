import { cn } from "@/lib/utils";
import { maskValue } from "@/shared/utils";
import type { CardType } from "@/types/card";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../Button/Button";

const REVEAL_DURATION_MS = 30_000;

const CARD_CONFIG: Record<CardType, { label: string; gradient: string }> = {
  private: { label: "Private Card", gradient: "from-slate-700 to-slate-900" },
  business: {
    label: "Business Card",
    gradient: "from-indigo-800 to-slate-900",
  },
};

type BankCardProps = {
  type: CardType;
  iban: string;
  selected?: boolean;
  onSelect: () => void;
  ref?: React.Ref<HTMLDivElement>;
};

function BankCard({
  type,
  iban,
  selected = false,
  onSelect,
  ref,
}: BankCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { label, gradient } = CARD_CONFIG[type];

  useEffect(() => {
    if (!isRevealed) return;
    const timer = setTimeout(() => setIsRevealed(false), REVEAL_DURATION_MS);
    return () => clearTimeout(timer);
  }, [isRevealed]);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(iban);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2_000);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-2xl bg-linear-to-br text-white",
        gradient,
        "aspect-[1.586/1] w-full transition-shadow duration-200",
        selected && "ring-2 ring-white",
        "has-[.card-select:focus-visible]:ring-2 has-[.card-select:focus-visible]:ring-white",
      )}
    >
      <button
        type="button"
        className="card-select absolute inset-0 rounded-2xl focus-visible:outline-none"
        aria-pressed={selected}
        aria-label={`Select ${label}`}
        onClick={onSelect}
      />

      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between p-5">
        <span className="text-sm font-medium text-white/70">{label}</span>
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
              onClick={(e) => {
                e.stopPropagation();
                setIsRevealed((prev) => !prev);
              }}
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
  );
}

export { BankCard };
export type { BankCardProps };
