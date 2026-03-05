const formatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  signDisplay: "exceptZero",
});

export const formatAmount = (rawAmount: number): string =>
  formatter.format(-rawAmount);

type ParsedAmount = {
  isExpense: boolean
  isCredit: boolean
  type: "expense" | "credit" | "amount"
  absolute: string
}

export const parseFormattedAmount = (formatted: string): ParsedAmount => {
  const isExpense = formatted.startsWith("-")
  const isCredit = formatted.startsWith("+")
  return {
    isExpense,
    isCredit,
    type: isExpense ? "expense" : isCredit ? "credit" : "amount",
    absolute: formatted.replace(/^[+\-−]/, ""),
  }
}