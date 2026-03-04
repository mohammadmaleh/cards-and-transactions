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

  return (
    <div className="flex items-center justify-between rounded-xl bg-muted px-5 py-4">
      <span className="text-sm font-medium text-foreground">{description}</span>
      <span
        className={cn(
          "text-sm font-semibold tabular-nums",
          isExpense && "text-destructive",
          isRefund && "text-emerald-600 dark:text-emerald-400"
        )}
        aria-label={`${isExpense ? "Expense" : isRefund ? "Refund" : "Amount"}: ${formatted}`}
      >
        {formatted}
      </span>
    </div>
  )
}

export { TransactionItem }
export type { TransactionItemProps }
