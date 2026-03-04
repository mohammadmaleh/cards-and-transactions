import { getTransactions } from "./transactions";

const PRIVATE_CARD_ID = "a1b2c3d4-0001-4e5f-8a9b-c0d1e2f30001";

describe("getTransactions", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("resolves with an array for a known card id", async () => {
    const promise = getTransactions(PRIVATE_CARD_ID);
    vi.runAllTimers();
    const transactions = await promise;
    expect(Array.isArray(transactions)).toBe(true);
    expect(transactions.length).toBeGreaterThan(0);
  });

  it("returns transactions with id, amount, and description", async () => {
    const promise = getTransactions(PRIVATE_CARD_ID);
    vi.runAllTimers();
    const transactions = await promise;
    for (const transaction of transactions) {
      expect(typeof transaction.id).toBe("string");
      expect(typeof transaction.amount).toBe("number");
      expect(typeof transaction.description).toBe("string");
    }
  });

  it("returns an empty array for an unknown card id", async () => {
    const promise = getTransactions("unknown-card-id");
    vi.runAllTimers();
    const transactions = await promise;
    expect(transactions).toEqual([]);
  });
});
