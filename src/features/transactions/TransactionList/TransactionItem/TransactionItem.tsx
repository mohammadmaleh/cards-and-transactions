import { cn } from "@/lib/utils"
import { formatAmount } from "@/shared/utils"

type TransactionItemProps = {
  description: string
  amount: number
}

function TransactionItem({ description, amount }: TransactionItemProps) {
  const formatted = formatAmount(amount)
  const isExpense = formatted.startsWith("-")
  const isRefund = formatted.startsWith("+")

  const type = isExpense ? "expense" : isRefund ? "refund" : "amount"
  const absoluteFormatted = formatted.replace(/^[+\-−]/, "")

  return (
    <li
      className="flex items-center justify-between rounded-xl bg-muted px-5 py-4"
      aria-label={`${description}, ${type}, ${absoluteFormatted}.`}
    >
      <span aria-hidden="true" className="text-sm font-medium text-foreground">{description}</span>
      <span
        aria-hidden="true"
        className={cn(
          "text-sm font-semibold tabular-nums",
          isExpense && "text-destructive",
          isRefund && "text-emerald-600 dark:text-emerald-400"
        )}
      >
        {formatted}
      </span>
    </li>
  )
}

export { TransactionItem }
export type { TransactionItemProps }
