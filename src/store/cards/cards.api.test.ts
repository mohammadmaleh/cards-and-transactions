import { configureStore } from "@reduxjs/toolkit";
import { getCards } from "@/services";
import { cardsApi } from "./cards.api";

const { mockCards } = vi.hoisted(() => ({
  mockCards: [
    { id: "card-1", type: "private" as const },
    { id: "card-2", type: "business" as const },
  ],
}));

vi.mock("@/services", () => ({
  getCards: vi.fn().mockResolvedValue(mockCards),
  getTransactions: vi.fn().mockResolvedValue([]),
}));

function makeStore() {
  return configureStore({
    reducer: { [cardsApi.reducerPath]: cardsApi.reducer },
    middleware: (getDefault) => getDefault().concat(cardsApi.middleware),
  });
}

describe("cardsApi", () => {
  it("has the correct reducer path", () => {
    expect(cardsApi.reducerPath).toBe("cardsApi");
  });

  it("exposes a getCards endpoint", () => {
    expect(cardsApi.endpoints).toHaveProperty("getCards");
  });

  it("resolves with card data from the service", async () => {
    const store = makeStore();
    const result = await store.dispatch(
      cardsApi.endpoints.getCards.initiate(),
    );
    expect(result.data).toEqual(mockCards);
  });

  it("reaches fulfilled status after a successful fetch", async () => {
    const store = makeStore();
    await store.dispatch(cardsApi.endpoints.getCards.initiate());
    const queryEntry = Object.values(store.getState().cardsApi.queries)[0];
    expect(queryEntry?.status).toBe("fulfilled");
  });

  it("reaches error status when the service throws", async () => {
    vi.mocked(getCards).mockRejectedValueOnce(new Error("Service unavailable"));
    const store = makeStore();
    const result = await store.dispatch(
      cardsApi.endpoints.getCards.initiate(),
    );
    expect(result.error).toBeDefined();
  });
});