import { type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { formatLocalizedAmount, getAmountDisplayProps } from "@/shared/utils"

type TransactionItemProps = {
  description: string
  amount: number
  accentClass?: string
}

function TransactionItem({ description, amount, accentClass }: TransactionItemProps): ReactNode {
  const formatted = formatLocalizedAmount(amount, "de-DE", "EUR")
  const { isExpense, isCredit, type, absolute } = getAmountDisplayProps(formatted)

  return (
    <li
      className={cn(
        "flex items-center justify-between rounded-xl bg-muted px-5 py-4",
        "border-l-4",
        accentClass ?? "border-l-transparent",
      )}
      aria-label={`${description}, ${type}, ${absolute}.`}
    >
      <span aria-hidden="true" className="text-sm font-medium text-foreground">{description}</span>
      <span
        aria-hidden="true"
        className={cn(
          "text-sm font-semibold tabular-nums",
          isExpense && "text-destructive",
          isCredit && "text-emerald-600 dark:text-emerald-400"
        )}
      >
        {formatted}
      </span>
    </li>
  )
}

export { TransactionItem }