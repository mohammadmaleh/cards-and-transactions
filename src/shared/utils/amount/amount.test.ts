import { formatLocalizedAmount, getAmountDisplayProps } from "./amount";

describe("formatLocalizedAmount", () => {
  it("formats a positive raw amount (expense) as a negative EUR value", () => {
    expect(formatLocalizedAmount(123.88, "de-DE", "EUR")).toBe("-123,88\u00a0€");
  });

  it("formats a negative raw amount (refund) as a positive EUR value", () => {
    expect(formatLocalizedAmount(-100, "de-DE", "EUR")).toBe("+100,00\u00a0€");
  });

  it("formats zero without a sign", () => {
    expect(formatLocalizedAmount(0, "de-DE", "EUR")).toBe("0,00\u00a0€");
  });

  it("formats large amounts correctly", () => {
    expect(formatLocalizedAmount(1234.56, "de-DE", "EUR")).toBe("-1.234,56\u00a0€");
  });
});

describe("getAmountDisplayProps", () => {
  it("identifies an expense", () => {
    const result = getAmountDisplayProps("-123,88\u00a0€");
    expect(result.isExpense).toBe(true);
    expect(result.isCredit).toBe(false);
    expect(result.type).toBe("expense");
    expect(result.absolute).toBe("123,88\u00a0€");
  });

  it("identifies a credit", () => {
    const result = getAmountDisplayProps("+100,00\u00a0€");
    expect(result.isExpense).toBe(false);
    expect(result.isCredit).toBe(true);
    expect(result.type).toBe("credit");
    expect(result.absolute).toBe("100,00\u00a0€");
  });

  it("identifies a zero amount", () => {
    const result = getAmountDisplayProps("0,00\u00a0€");
    expect(result.isExpense).toBe(false);
    expect(result.isCredit).toBe(false);
    expect(result.type).toBe("amount");
    expect(result.absolute).toBe("0,00\u00a0€");
  });

  it("strips minus sign from expense absolute value", () => {
    expect(getAmountDisplayProps("-1.234,56\u00a0€").absolute).toBe("1.234,56\u00a0€");
  });
});