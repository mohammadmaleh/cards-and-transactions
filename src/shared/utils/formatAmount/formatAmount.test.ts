import { formatAmount } from "./formatAmount";

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
