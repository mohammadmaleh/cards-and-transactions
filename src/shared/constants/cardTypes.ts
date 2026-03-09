import type { CardType } from "@/types/card"

export const CARD_TYPE_LABEL: Record<CardType, string> = {
  private: "Private Card",
  business: "Business Card",
}

export const CARD_ACCENT: Record<CardType, string> = {
  private: "border-l-slate-600",
  business: "border-l-indigo-600",
}
