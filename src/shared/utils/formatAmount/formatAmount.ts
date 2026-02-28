const formatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  signDisplay: "exceptZero",
});

export const formatAmount = (rawAmount: number): string =>
  formatter.format(-rawAmount);
