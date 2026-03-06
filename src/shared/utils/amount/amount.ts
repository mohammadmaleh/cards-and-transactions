export const formatLocalizedAmount = (
  rawAmount: number,
  locale = "de-DE",
  currency = "EUR",
): string =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    signDisplay: "exceptZero",
  }).format(-rawAmount);

type AmountDisplayProps = {
  isExpense: boolean
  isCredit: boolean
  type: "expense" | "credit" | "amount"
  absolute: string
}

export const getAmountDisplayProps = (formatted: string): AmountDisplayProps => {
  const isExpense = formatted.startsWith("-")
  const isCredit = formatted.startsWith("+")
  return {
    isExpense,
    isCredit,
    type: isExpense ? "expense" : isCredit ? "credit" : "amount",
    absolute: formatted.replace(/^[+\-−]/, ""),
  }
}