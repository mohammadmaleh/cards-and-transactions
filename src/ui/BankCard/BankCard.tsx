import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { CardType } from "@/types/card";

const CARD_CONFIG: Record<CardType, { label: string; gradient: string }> = {
  private: { label: "Private Card", gradient: "from-slate-700 to-slate-900" },
  business: {
    label: "Business Card",
    gradient: "from-indigo-800 to-slate-900",
  },
};

type BankCardProps = {
  type: CardType;
};

function BankCard({ type }: BankCardProps): ReactNode {
  const { label, gradient } = CARD_CONFIG[type];

  return (
    <div
      className={cn(
        "rounded-2xl bg-linear-to-br text-white",
        gradient,
        "aspect-[1.586/1] w-full",
      )}
    >
      <div className="flex h-full flex-col p-5">
        <span className="text-sm font-medium text-white/70">{label}</span>
      </div>
    </div>
  );
}

export { BankCard };
export type { BankCardProps };
