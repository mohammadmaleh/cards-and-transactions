import { getCards } from "./cards";

describe("getCards", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("resolves with an array", async () => {
    const promise = getCards();
    vi.runAllTimers();
    const cards = await promise;
    expect(Array.isArray(cards)).toBe(true);
  });

  it("returns at least one card", async () => {
    const promise = getCards();
    vi.runAllTimers();
    const cards = await promise;
    expect(cards.length).toBeGreaterThan(0);
  });

  it("returns cards with id and type as strings", async () => {
    const promise = getCards();
    vi.runAllTimers();
    const cards = await promise;
    for (const card of cards) {
      expect(typeof card.id).toBe("string");
      expect(typeof card.type).toBe("string");
    }
  });
});
