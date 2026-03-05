import { configureStore } from "@reduxjs/toolkit";
import { getTransactions } from "@/services";
import { transactionsApi } from "./transactions.api";

const { mockTransactions } = vi.hoisted(() => ({
  mockTransactions: [
    { id: "t1", amount: 67.3, description: "Rewe" },
    { id: "t2", amount: -50.0, description: "Ticket Refund" },
  ],
}));

vi.mock("@/services", () => ({
  getCards: vi.fn().mockResolvedValue([]),
  getTransactions: vi.fn().mockImplementation((cardId: string) =>
    Promise.resolve(cardId === "card-1" ? mockTransactions : []),
  ),
}));

function makeStore() {
  return configureStore({
    reducer: { [transactionsApi.reducerPath]: transactionsApi.reducer },
    middleware: (getDefault) => getDefault().concat(transactionsApi.middleware),
  });
}

describe("transactionsApi", () => {
  it("has the correct reducer path", () => {
    expect(transactionsApi.reducerPath).toBe("transactionsApi");
  });

  it("exposes a getTransactions endpoint", () => {
    expect(transactionsApi.endpoints).toHaveProperty("getTransactions");
  });

  it("resolves with transactions for a known card ID", async () => {
    const store = makeStore();
    const result = await store.dispatch(
      transactionsApi.endpoints.getTransactions.initiate("card-1"),
    );
    expect(result.data).toEqual(mockTransactions);
  });

  it("resolves with an empty array for an unknown card ID", async () => {
    const store = makeStore();
    const result = await store.dispatch(
      transactionsApi.endpoints.getTransactions.initiate("unknown-card"),
    );
    expect(result.data).toEqual([]);
  });

  it("reaches fulfilled status after a successful fetch", async () => {
    const store = makeStore();
    await store.dispatch(
      transactionsApi.endpoints.getTransactions.initiate("card-1"),
    );
    const queryEntry = Object.values(
      store.getState().transactionsApi.queries,
    )[0];
    expect(queryEntry?.status).toBe("fulfilled");
  });

  it("reaches error status when the service throws", async () => {
    vi.mocked(getTransactions).mockRejectedValueOnce(
      new Error("Service unavailable"),
    );
    const store = makeStore();
    const result = await store.dispatch(
      transactionsApi.endpoints.getTransactions.initiate("card-1"),
    );
    expect(result.error).toBeDefined();
  });
});