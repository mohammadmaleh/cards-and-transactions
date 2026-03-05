import { formatAmount, parseFormattedAmount } from "./amount";

describe("formatAmount", () => {
  it("formats a positive raw amount (expense) as a negative EUR value", () => {
    expect(formatAmount(123.88)).toBe("-123,88\u00a0€");
  });

  it("formats a negative raw amount (refund) as a positive EUR value", () => {
    expect(formatAmount(-100)).toBe("+100,00\u00a0€");
  });

  it("formats zero without a sign", () => {
    expect(formatAmount(0)).toBe("0,00\u00a0€");
  });

  it("formats large amounts correctly", () => {
    expect(formatAmount(1234.56)).toBe("-1.234,56\u00a0€");
  });
});

describe("parseFormattedAmount", () => {
  it("identifies an expense", () => {
    const result = parseFormattedAmount("-123,88\u00a0€");
    expect(result.isExpense).toBe(true);
    expect(result.isCredit).toBe(false);
    expect(result.type).toBe("expense");
    expect(result.absolute).toBe("123,88\u00a0€");
  });

  it("identifies a credit", () => {
    const result = parseFormattedAmount("+100,00\u00a0€");
    expect(result.isExpense).toBe(false);
    expect(result.isCredit).toBe(true);
    expect(result.type).toBe("credit");
    expect(result.absolute).toBe("100,00\u00a0€");
  });

  it("identifies a zero amount", () => {
    const result = parseFormattedAmount("0,00\u00a0€");
    expect(result.isExpense).toBe(false);
    expect(result.isCredit).toBe(false);
    expect(result.type).toBe("amount");
    expect(result.absolute).toBe("0,00\u00a0€");
  });

  it("strips minus sign from expense absolute value", () => {
    expect(parseFormattedAmount("-1.234,56\u00a0€").absolute).toBe("1.234,56\u00a0€");
  });
});