import { store } from "./index";

describe("store", () => {
  it("initialises with the cardsApi slice in state", () => {
    const state = store.getState();
    expect(state).toHaveProperty("cardsApi");
  });

  it("initialises with the transactionsApi slice in state", () => {
    const state = store.getState();
    expect(state).toHaveProperty("transactionsApi");
  });

  it("has a queries object inside the cardsApi slice", () => {
    const state = store.getState();
    expect(state.cardsApi).toHaveProperty("queries");
  });

  it("has a queries object inside the transactionsApi slice", () => {
    const state = store.getState();
    expect(state.transactionsApi).toHaveProperty("queries");
  });

  it("has no pending queries in cardsApi on init", () => {
    const state = store.getState();
    expect(Object.keys(state.cardsApi.queries)).toHaveLength(0);
  });

  it("has no pending queries in transactionsApi on init", () => {
    const state = store.getState();
    expect(Object.keys(state.transactionsApi.queries)).toHaveLength(0);
  });
});
