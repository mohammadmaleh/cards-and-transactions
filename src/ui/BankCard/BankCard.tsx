import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CARD_TYPE_LABEL } from "@/shared/constants";
import type { CardType } from "@/types/card";

const CARD_GRADIENT: Record<CardType, string> = {
  private: "from-slate-700 to-slate-900",
  business: "from-indigo-800 to-slate-900",
};

type BankCardProps = {
  type: CardType;
};

function BankCard({ type }: BankCardProps): ReactNode {
  return (
    <div
      className={cn(
        "rounded-2xl bg-linear-to-br text-white",
        CARD_GRADIENT[type],
        "aspect-[1.586/1] w-full",
      )}
    >
      <div className="flex h-full flex-col p-5">
        <span className="text-sm font-medium text-white/70">{CARD_TYPE_LABEL[type]}</span>
      </div>
    </div>
  );
}

export { BankCard };
export type { BankCardProps };
