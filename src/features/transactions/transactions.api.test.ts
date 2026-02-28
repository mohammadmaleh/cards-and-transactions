import { transactionsApi } from "./transactions.api";

describe("transactionsApi", () => {
  it("has the correct reducer path", () => {
    expect(transactionsApi.reducerPath).toBe("transactionsApi");
  });

  it("exposes a getTransactions endpoint", () => {
    expect(transactionsApi.endpoints).toHaveProperty("getTransactions");
  });
});
